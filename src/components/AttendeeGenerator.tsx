import React, { useEffect, useState } from 'react';
import { ASSETS, DEFAULT_MEDIA_LIST } from '../data/mockData';
import {
  checkGeminiStatus,
  generatePostCopy,
  generatePostWithGemini,
  GeneratedPostContent,
} from '../services/aiGenerator';
import { AttachedMedia, DeviceMode, EventConfig, ToneType } from '../types';

interface AttendeeGeneratorProps {
  config: EventConfig;
  onShowToast: (msg: string) => void;
  onIncrementMetrics?: () => void;
}

export const AttendeeGenerator: React.FC<AttendeeGeneratorProps> = ({
  config,
  onShowToast,
  onIncrementMetrics,
}) => {
  const [takeaways, setTakeaways] = useState(
    'Incredible keynote on autonomous AI systems and low-latency cloud architecture. Loved catching up with fellow engineering leaders at the VIP roundtable!'
  );
  const [tone, setTone] = useState<ToneType>('professional');
  const [deviceView, setDeviceView] = useState<DeviceMode>('desktop');
  const [mediaList, setMediaList] = useState<AttachedMedia[]>(DEFAULT_MEDIA_LIST);
  const [selectedMediaId, setSelectedMediaId] = useState<string>(DEFAULT_MEDIA_LIST[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(45);
  const [highlightCard, setHighlightCard] = useState(false);
  const [lastSaved, setLastSaved] = useState('Just now');
  const [isGeminiReady, setIsGeminiReady] = useState(false);

  // Check Gemini server configuration on mount
  useEffect(() => {
    checkGeminiStatus().then((status) => {
      setIsGeminiReady(status.configured);
    });
  }, []);

  // Generated post content
  const [postContent, setPostContent] = useState<GeneratedPostContent>(() =>
    generatePostCopy('professional', takeaways, config)
  );

  const activeMedia = mediaList.find((m) => m.id === selectedMediaId) || mediaList[0];

  const handleInsertTag = (tag: string) => {
    if (!takeaways.includes(tag)) {
      setTakeaways((prev) => (prev.trim() ? `${prev.trim()} ${tag}` : tag));
      onShowToast(`Appended tag ${tag}`);
    }
  };

  const handleAppendPrompt = (promptText: string) => {
    if (!takeaways.includes(promptText)) {
      setTakeaways((prev) => (prev.trim() ? `${prev.trim()} ${promptText}` : promptText));
      onShowToast('Prompt idea inserted into takeaways');
    }
  };

  const handleToneSelect = async (newTone: ToneType) => {
    setTone(newTone);
    setIsGenerating(true);
    try {
      const updated = await generatePostWithGemini(newTone, takeaways, config);
      setPostContent(updated);
      setHighlightCard(true);
      setTimeout(() => setHighlightCard(false), 700);
      onShowToast(`Adjusted post tone to ${newTone.toUpperCase()}`);
    } catch {
      setPostContent(generatePostCopy(newTone, takeaways, config));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generatePostWithGemini(tone, takeaways, config);
      setPostContent(generated);
      setLastSaved('Just now');
      setHighlightCard(true);
      setTimeout(() => setHighlightCard(false), 900);
      if (generated.isLiveAI) {
        onShowToast('✨ Gemini 3.8 Flash crafted a personalized LinkedIn draft!');
      } else {
        onShowToast('✨ Post draft synthesized with official summit tags!');
      }
      if (onIncrementMetrics) onIncrementMetrics();
    } catch (err) {
      console.error(err);
      onShowToast('✨ Generated post draft!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const fileUrl = URL.createObjectURL(file);
    const newMedia: AttachedMedia = {
      id: `custom-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: fileUrl,
      altText: `Summit photo: ${file.name}`,
      label: file.name.slice(0, 16),
    };
    setMediaList([newMedia, ...mediaList]);
    setSelectedMediaId(newMedia.id);
    onShowToast(`Attached photo "${file.name}" to preview!`);
  };

  const handleRemoveMedia = (idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = mediaList.filter((m) => m.id !== idToRemove);
    if (filtered.length === 0) {
      onShowToast('At least one summit media photo is recommended for reach.');
      return;
    }
    setMediaList(filtered);
    if (selectedMediaId === idToRemove) {
      setSelectedMediaId(filtered[0].id);
    }
  };

  const fullCopyText = `${postContent.intro}\n\n${postContent.bulletPoints.join('\n')}\n\n${postContent.closing}\n\n${postContent.cta}\n\n${postContent.hashtags.join(' ')}`;

  const handleCopyPost = () => {
    navigator.clipboard.writeText(fullCopyText).then(() => {
      setCopied(true);
      onShowToast('Formatted LinkedIn post copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex flex-col w-full">
      {/* Dynamic Notification / Status Ribbon */}
      <div className="w-full bg-[#d6e3ff] text-[#001b3d] px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between border-b border-[#dee8ff]">
        <div className="flex items-center gap-2 mx-auto xl:mx-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004e99] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004e99]"></span>
          </span>
          <span className="text-xs">
            Live Engagement Amplification: <strong className="font-semibold">482 summit posts</strong> shared in the last 6 hours
          </span>
        </div>
        <div className="hidden xl:flex items-center gap-4">
          <span className="text-xs text-[#00468a]">
            Official Summit Stream Partner: LinkedIn Events
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-white text-[#004e99] font-bold shadow-xs">
            2.4x Reach Boost
          </span>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-5 flex flex-col gap-6">
        {/* 1. Top Event Banner */}
        <section className="w-full bg-white rounded-xl p-5 md:p-6 shadow-sm border border-[#e2e8f0] relative overflow-hidden">
          {/* Subtle Brand Accent Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004e99] via-[#0a66c2] to-[#97f7b6]"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative">
            <div className="flex flex-col gap-1 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#97f7b6] text-[#00210e] text-[11px] font-semibold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006d3c]"></span>
                  Live · {config.location}
                </span>
                <span className="text-[#cbd5e1] text-xs">•</span>
                <span className="text-xs text-[#64748b] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#004e99]">calendar_month</span>
                  {config.sessionWindow}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#111c2d]">
                  {config.name}
                </h1>
              </div>

              <div className="flex items-center gap-1 text-[#64748b] text-xs">
                <span>
                  Hosted by <strong className="text-[#111c2d] font-semibold">{config.hostOrg}</strong>
                </span>
                <span
                  className="material-symbols-outlined text-[16px] text-[#0a66c2]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>

              {/* Clickable Official Social Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className="text-xs text-[#64748b] mr-1">Recommended Tags:</span>
                {config.hashtags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleInsertTag(tag)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#004e99] text-xs font-semibold transition-colors cursor-pointer border border-[#dee8ff]"
                  >
                    {tag}
                  </button>
                ))}
                {config.twitterHandle && (
                  <button
                    type="button"
                    onClick={() => handleInsertTag(config.twitterHandle)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#004e99] text-xs font-semibold transition-colors cursor-pointer border border-[#dee8ff]"
                  >
                    {config.twitterHandle}
                  </button>
                )}
                {config.agendaUrl && (
                  <a
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#414752] hover:text-[#111c2d] text-xs transition-colors border border-[#dee8ff]"
                    href={config.agendaUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined text-[14px]">language</span>
                    {config.agendaUrl.replace('https://', '')}
                  </a>
                )}
              </div>
            </div>

            {/* Social Proof Motivator Card */}
            <div className="lg:self-center flex items-center bg-gradient-to-br from-[#f0f3ff] via-[#e7eeff] to-[#dee8ff] p-3.5 rounded-xl border border-[#dee8ff] gap-3">
              <div className="w-10 h-10 rounded-full bg-[#004e99] flex items-center justify-center text-white shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#111c2d] leading-tight">Trending Now</span>
                <span className="text-xs text-[#414752] leading-snug">
                  ⚡ Join <strong>480+ attendees</strong> sharing their summit takeaways on LinkedIn
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Two-Column Workspace (Left 6 cols / Right 6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Input Form */}
          <section className="lg:col-span-6 flex flex-col gap-5">
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-[#e2e8f0] flex flex-col gap-5">
              {/* Header */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#111c2d]">Draft Your LinkedIn Post</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d6e3ff] text-[#004e99] text-[11px] font-bold flex items-center gap-1 border border-[#dee8ff]">
                    <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                    {postContent.isLiveAI || isGeminiReady ? 'Gemini 3.8 Flash' : 'AI Enhanced'}
                  </span>
                </div>
                <p className="text-xs text-[#64748b]">
                  Generate high-visibility social copy in seconds tailored to your summit experience.
                </p>
              </div>

              {/* Section 1: Photos & Media Dropzone */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#111c2d] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#004e99]">add_a_photo</span>
                    Summit Media & Stage Photos
                  </label>
                  <span className="text-[11px] text-[#64748b]">Max 10MB</span>
                </div>

                {/* Dropzone */}
                <div className="w-full rounded-xl bg-[#f0f3ff] p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#e7eeff] border border-dashed border-[#cbd5e1] hover:border-[#004e99] transition-all group relative">
                  <input
                    accept="image/png, image/jpeg"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <div className="w-11 h-11 rounded-full bg-white text-[#004e99] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform mb-1.5">
                    <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
                  </div>
                  <span className="text-xs text-[#111c2d] font-semibold">
                    Drag & drop your summit photos here, or{' '}
                    <span className="text-[#0a66c2] hover:underline">browse files</span>
                  </span>
                  <span className="text-[11px] text-[#64748b] mt-0.5">
                    Supports high-res PNG, JPG (16:9 keynote shots look best)
                  </span>
                </div>

                {/* Thumbnail Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-1">
                  {mediaList.map((media) => {
                    const isSelected = media.id === selectedMediaId;
                    return (
                      <div
                        key={media.id}
                        onClick={() => setSelectedMediaId(media.id)}
                        className={`relative rounded-lg overflow-hidden cursor-pointer flex flex-col border transition-all ${
                          isSelected
                            ? 'ring-2 ring-[#004e99] shadow-md border-transparent'
                            : 'border-[#cbd5e1] hover:border-[#004e99]'
                        }`}
                      >
                        <div className="relative h-20 w-full bg-[#111c2d]">
                          <img
                            src={media.url}
                            alt={media.altText}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                          <button
                            type="button"
                            onClick={(e) => handleRemoveMedia(media.id, e)}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 text-[#111c2d] hover:bg-[#ba1a1a] hover:text-white flex items-center justify-center transition-colors shadow-sm"
                            title="Remove photo"
                          >
                            <span className="material-symbols-outlined text-[12px]">close</span>
                          </button>

                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#006d3c] text-white text-[9px] font-bold flex items-center gap-0.5 shadow-sm">
                            <span className="material-symbols-outlined text-[10px]">check_circle</span>
                            {isSelected ? 'Active Preview' : 'Uploaded'}
                          </span>
                        </div>
                        <div className="p-1.5 bg-white flex items-center justify-between text-[11px]">
                          <span className="text-[#111c2d] truncate font-medium max-w-[80px]">
                            {media.name}
                          </span>
                          <span className="text-[10px] text-[#64748b]">{media.size}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add more button */}
                  <label className="h-[108px] rounded-lg bg-[#f0f3ff] hover:bg-[#e7eeff] border border-dashed border-[#cbd5e1] hover:border-[#004e99] text-[#64748b] hover:text-[#004e99] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                    <span className="text-xs font-semibold">+ Add more</span>
                    <span className="text-[10px] text-[#64748b]">Up to 4 images</span>
                  </label>
                </div>
              </div>

              {/* Section 2: Key Highlights / Takeaways */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#111c2d] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#004e99]">edit_note</span>
                    Key Highlights / Takeaways
                  </label>
                  <span className="text-xs text-[#64748b] font-medium">
                    {takeaways.length} / 500 characters
                  </span>
                </div>

                <div className="relative rounded-lg bg-[#f0f3ff] p-3 border border-[#cbd5e1] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#004e99] transition-all">
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={takeaways}
                    onChange={(e) => setTakeaways(e.target.value)}
                    placeholder="What did you learn today? (e.g. Blown away by the serverless LLM orchestration session, met incredible founders at the networking lounge, tested the new Apex SDK at booth 402...)"
                    className="w-full bg-transparent resize-none border-none outline-none text-xs text-[#111c2d] placeholder:text-[#94a3b8] leading-relaxed"
                  />
                </div>

                {/* Quick Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-[#64748b] mr-0.5">Quick prompts:</span>
                  <button
                    type="button"
                    onClick={() => handleAppendPrompt('Breakthrough keynote insight: ')}
                    className="px-2.5 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-xs transition-colors flex items-center gap-1 border border-[#dee8ff] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#004e99]">add</span>
                    Keynote Insights
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAppendPrompt('Tested the live demo at the booth: ')}
                    className="px-2.5 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-xs transition-colors flex items-center gap-1 border border-[#dee8ff] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#004e99]">add</span>
                    Booth Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAppendPrompt('Fantastic meeting new collaborators: ')}
                    className="px-2.5 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-xs transition-colors flex items-center gap-1 border border-[#dee8ff] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#004e99]">add</span>
                    Networking
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAppendPrompt('Deep-dive architectural session takeaway: ')}
                    className="px-2.5 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-xs transition-colors flex items-center gap-1 border border-[#dee8ff] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#004e99]">add</span>
                    Workshops
                  </button>
                </div>
              </div>

              {/* Section 3: Tone Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111c2d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#004e99]">tune</span>
                  Post Tone & Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleToneSelect('professional')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      tone === 'professional'
                        ? 'bg-[#0a66c2] text-white shadow-sm'
                        : 'bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#414752] border border-[#dee8ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {tone === 'professional' ? 'check_circle' : 'business_center'}
                    </span>
                    Professional
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToneSelect('grateful')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      tone === 'grateful'
                        ? 'bg-[#0a66c2] text-white shadow-sm'
                        : 'bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#414752] border border-[#dee8ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-pink-500">
                      {tone === 'grateful' ? 'check_circle' : 'favorite'}
                    </span>
                    Grateful Attendee
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToneSelect('takeaways')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      tone === 'takeaways'
                        ? 'bg-[#0a66c2] text-white shadow-sm'
                        : 'bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#414752] border border-[#dee8ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#004e99]">
                      {tone === 'takeaways' ? 'check_circle' : 'format_list_bulleted'}
                    </span>
                    Key Takeaways
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToneSelect('casual')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      tone === 'casual'
                        ? 'bg-[#0a66c2] text-white shadow-sm'
                        : 'bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#414752] border border-[#dee8ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-amber-500">
                      {tone === 'casual' ? 'check_circle' : 'bolt'}
                    </span>
                    Casual & Energetic
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0a66c2] hover:bg-[#004e99] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0a66c2]/20 hover:shadow-[#0a66c2]/35 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75"
                >
                  {isGenerating ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">
                        progress_activity
                      </span>
                      <span>Drafting Tailored Post...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                      <span>Generate LinkedIn Post</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-center text-[#64748b] text-[11px] mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-[#006d3c]">
                    verified_user
                  </span>
                  <span>Powered by EventPulse AI · Optimized for LinkedIn algorithm reach & spacing</span>
                </div>
              </div>
            </div>

            {/* LinkedIn Reach Pro-Tip */}
            <div className="bg-[#f0f3ff] rounded-xl p-4 flex items-start gap-3 border border-[#dee8ff]">
              <div className="w-9 h-9 rounded-lg bg-white text-[#004e99] flex items-center justify-center shrink-0 shadow-xs border border-[#dee8ff]">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#111c2d]">LinkedIn Reach Pro-Tip</span>
                <p className="text-xs text-[#414752] mt-0.5 leading-relaxed">
                  Posts uploaded with keynote photos and 3–5 targeted community hashtags receive an average of{' '}
                  <strong className="text-[#006d3c]">320% higher impressions</strong> among enterprise tech networks within the first 2 hours.
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Live LinkedIn Post Preview (Sticky) */}
          <section className="lg:col-span-6 flex flex-col gap-4 lg:sticky lg:top-20">
            {/* Device Switcher Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006d3c]"></span>
                <h3 className="text-sm font-bold text-[#111c2d]">Live LinkedIn Preview</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#e7eeff] text-[#004e99]">
                  Realtime
                </span>
              </div>

              {/* Responsive Device Toggle */}
              <div className="flex items-center bg-[#f0f3ff] p-1 rounded-lg border border-[#dee8ff]">
                <button
                  type="button"
                  onClick={() => setDeviceView('desktop')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    deviceView === 'desktop'
                      ? 'bg-white text-[#004e99] shadow-xs'
                      : 'text-[#64748b] hover:text-[#111c2d]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
                  Desktop Feed
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('mobile')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    deviceView === 'mobile'
                      ? 'bg-white text-[#004e99] shadow-xs'
                      : 'text-[#64748b] hover:text-[#111c2d]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">smartphone</span>
                  Mobile
                </button>
              </div>
            </div>

            {/* LinkedIn Post Mockup Container */}
            <div className="w-full flex justify-center transition-all">
              <div
                className={`w-full bg-white rounded-xl shadow-md border border-[#e2e8f0] overflow-hidden transition-all duration-300 ${
                  deviceView === 'mobile' ? 'max-w-[380px] shadow-xl' : 'max-w-[555px]'
                } ${highlightCard ? 'ring-2 ring-[#0a66c2] scale-[1.01]' : ''}`}
              >
                {/* Author Header */}
                <div className="p-4 pb-2.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        alt="Sarah Jenkins"
                        className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200"
                        src={ASSETS.sarahAvatar}
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                        in
                      </div>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-[#111c2d] truncate leading-tight">
                          Sarah Jenkins
                        </span>
                        <span className="text-[11px] text-[#64748b] shrink-0">• 1st</span>
                      </div>
                      <span className="text-[11px] text-[#64748b] truncate max-w-[280px] sm:max-w-[340px] leading-tight mt-0.5">
                        Senior Product & Community Lead | Building high-scale dev ecosystems
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-[#64748b] mt-0.5">
                        <span>Just now</span>
                        <span>•</span>
                        <span className="material-symbols-outlined text-[12px]">public</span>
                        <span>•</span>
                        <span className="text-[#0a66c2] font-medium hover:underline cursor-pointer">
                          Edited
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-[#64748b]">
                    <button
                      className="w-8 h-8 rounded-full hover:bg-[#f0f3ff] flex items-center justify-center transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                    </button>
                  </div>
                </div>

                {/* Post Body Copy */}
                <div className="px-4 pb-3 text-[#111c2d] text-xs space-y-2.5 leading-relaxed">
                  <p>{postContent.intro}</p>

                  <div className="space-y-1">
                    {postContent.bulletPoints.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>

                  <p>{postContent.closing}</p>
                  <p>{postContent.cta}</p>

                  {/* Hashtags */}
                  <p className="text-[#0a66c2] font-semibold text-xs flex flex-wrap gap-1.5 pt-0.5">
                    {postContent.hashtags.map((tag) => (
                      <span key={tag} className="hover:underline cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </p>
                </div>

                {/* Attached Media Preview */}
                <div className="relative w-full aspect-[16/9] bg-[#111c2d] overflow-hidden group">
                  <img
                    src={activeMedia.url}
                    alt={activeMedia.altText}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">photo_camera</span>
                    {activeMedia.label}
                  </div>
                </div>

                {/* Social Counter / Reaction Summary */}
                <div className="px-4 py-2 flex items-center justify-between text-[#64748b] text-[11px] border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center -space-x-1">
                      <div className="w-4 h-4 rounded-full bg-[#0a66c2] text-white flex items-center justify-center text-[9px] shadow-xs">
                        <span className="material-symbols-outlined text-[10px]">thumb_up</span>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-[#006d3c] text-white flex items-center justify-center text-[9px] shadow-xs">
                        <span className="material-symbols-outlined text-[10px]">celebration</span>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-[#3967aa] text-white flex items-center justify-center text-[9px] shadow-xs">
                        <span className="material-symbols-outlined text-[10px]">lightbulb</span>
                      </div>
                    </div>
                    <span className="hover:text-[#0a66c2] cursor-pointer hover:underline pl-1">
                      David Kim, Elena Rostova, and {likeCount} others
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hover:text-[#0a66c2] cursor-pointer hover:underline">
                      8 comments
                    </span>
                    <span>•</span>
                    <span className="hover:text-[#0a66c2] cursor-pointer hover:underline">
                      3 reposts
                    </span>
                  </div>
                </div>

                {/* Post Action Toolbar (Like, Comment, Repost, Send) */}
                <div className="px-2 py-1 grid grid-cols-4 gap-1">
                  <button
                    type="button"
                    onClick={handleToggleLike}
                    className={`py-2 px-1 rounded hover:bg-[#f0f3ff] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isLiked ? 'text-[#0a66c2] font-bold' : 'text-[#64748b]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      thumb_up
                    </span>
                    <span className="text-xs font-semibold">Like</span>
                  </button>
                  <button
                    type="button"
                    className="py-2 px-1 rounded hover:bg-[#f0f3ff] text-[#64748b] hover:text-[#0a66c2] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                    <span className="text-xs font-semibold">Comment</span>
                  </button>
                  <button
                    type="button"
                    className="py-2 px-1 rounded hover:bg-[#f0f3ff] text-[#64748b] hover:text-[#0a66c2] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">repeat</span>
                    <span className="text-xs font-semibold">Repost</span>
                  </button>
                  <button
                    type="button"
                    className="py-2 px-1 rounded hover:bg-[#f0f3ff] text-[#64748b] hover:text-[#0a66c2] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span className="text-xs font-semibold">Send</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Publishing Actions */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#006d3c] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Ready to publish with {postContent.hashtags.length} event tags included
                </span>
                <span className="text-[#64748b]">Last saved {lastSaved}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="py-2.5 px-3 rounded-lg bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#dee8ff]"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#004e99]">
                    refresh
                  </span>
                  Regenerate
                </button>

                <button
                  type="button"
                  onClick={handleCopyPost}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    copied
                      ? 'bg-[#006d3c] text-white shadow-sm'
                      : 'bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] border border-[#dee8ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copied ? 'done_all' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied!' : 'Copy Copy'}</span>
                </button>

                <a
                  href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
                    fullCopyText
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-lg bg-[#0a66c2] hover:bg-[#004e99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  Open LinkedIn
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
