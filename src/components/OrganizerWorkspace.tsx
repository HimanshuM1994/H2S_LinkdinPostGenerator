import React, { useState } from 'react';
import { AttendeeActivity, EventConfig, MetricSummary } from '../types';

interface OrganizerWorkspaceProps {
  config: EventConfig;
  onUpdateConfig: (newConfig: EventConfig) => void;
  metrics: MetricSummary;
  activities: AttendeeActivity[];
  onPreviewAttendeeFlow: () => void;
  onOpenQrModal: () => void;
  onOpenWebhookModal: () => void;
  onOpenActivityModal: () => void;
  onShowToast: (msg: string) => void;
}

export const OrganizerWorkspace: React.FC<OrganizerWorkspaceProps> = ({
  config,
  onUpdateConfig,
  metrics,
  activities,
  onPreviewAttendeeFlow,
  onOpenQrModal,
  onOpenWebhookModal,
  onOpenActivityModal,
  onShowToast,
}) => {
  // Local form state so organizer can edit and click "Save & Update Generator"
  const [formData, setFormData] = useState<EventConfig>(config);
  const [newTagInput, setNewTagInput] = useState('');
  const [newTakeawayInput, setNewTakeawayInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareUrl = `https://eventpulse.ai/share/${formData.shareSlug || 'techconnect2025'}?ref=attendee`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      onShowToast('Attendee Share URL copied to clipboard');
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleAddHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      let tag = newTagInput.trim();
      if (!tag.startsWith('#')) tag = '#' + tag;
      if (!formData.hashtags.includes(tag)) {
        setFormData({
          ...formData,
          hashtags: [...formData.hashtags, tag],
        });
        onShowToast(`Added hashtag ${tag}`);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      hashtags: formData.hashtags.filter((t) => t !== tagToRemove),
    });
  };

  const handleAddTakeaway = () => {
    const text = newTakeawayInput.trim();
    if (!text) return;
    setFormData({
      ...formData,
      suggestedPrompts: [...formData.suggestedPrompts, text],
    });
    setNewTakeawayInput('');
    onShowToast('Preset takeaway prompt added.');
  };

  const handleRemoveTakeaway = (indexToRemove: number) => {
    setFormData({
      ...formData,
      suggestedPrompts: formData.suggestedPrompts.filter((_, idx) => idx !== indexToRemove),
    });
  };

  const handleSaveConfig = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateConfig(formData);
      setIsSaving(false);
      onShowToast('Configuration synced to all active Attendee Generators.');
    }, 600);
  };

  const handleExportCsv = () => {
    const csvHeader = 'Name,Role,Company,Time,Content,Reactions,Comments,Reposts\n';
    const csvRows = activities
      .map(
        (a) =>
          `"${a.name}","${a.role}","${a.company}","${a.timeAgo}","${a.content.replace(/"/g, '""')}",${a.reactions},${a.comments},${a.reposts}`
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TechConnect_Social_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Exported Analytics CSV with 486 attendee posts & metrics!');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Sub-Header Banner */}
      <div className="w-full bg-[#f0f3ff] px-4 md:px-6 lg:px-8 py-4 border-b border-[#dee8ff]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#414752] text-xs">
              <span>Events</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#004e99] font-semibold">{formData.name}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#97f7b6] text-[#00210e] text-[11px] font-semibold ml-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006d3c] animate-pulse"></span>
                Live On-Air
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[#111c2d]">Organizer Workspace</h1>
              <div className="flex items-center gap-1.5 bg-[#ffffff] px-3 py-1 rounded-full shadow-sm text-[#414752] text-xs border border-[#e2e8f0]">
                <span className="material-symbols-outlined text-[#004e99] text-[18px]">group</span>
                <span>
                  <strong className="text-[#111c2d]">1,420</strong> Registered Attendees
                </span>
                <span className="text-[#cbd5e1]">•</span>
                <span className="text-[#006d3c] font-semibold">84.2% Activation Target</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onPreviewAttendeeFlow}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ffffff] hover:bg-[#f8fafc] text-[#111c2d] rounded-lg shadow-sm border border-[#e2e8f0] text-xs font-semibold transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[#004e99] text-[18px]">visibility</span>
              <span>Preview Attendee Flow</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ffffff] hover:bg-[#f8fafc] text-[#111c2d] rounded-lg shadow-sm border border-[#e2e8f0] text-xs font-semibold transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Analytics CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid (7 cols / 5 cols) */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Amplification Settings */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[#ffffff] rounded-xl shadow-sm border border-[#e2e8f0] p-6 flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-2 border-b border-[#f1f5f9]">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#dee8ff] flex items-center justify-center text-[#004e99] shadow-sm flex-shrink-0">
                    <span className="material-symbols-outlined text-[26px]">campaign</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#111c2d]">Event Amplification Settings</h2>
                    <p className="text-xs text-[#414752] mt-0.5">
                      Configure default tags, speaker handles, and preset takeaways pushed to attendee post drafts.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#e7eeff] text-[#004e99] text-[11px] font-bold tracking-wider uppercase">
                  Auto-Sync
                </span>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-4">
                {/* Event Name & Session Window */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#111c2d]">Event Name & Session Window</label>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#004e99] bg-[#f0f3ff] px-2 py-0.5 rounded font-medium border border-[#dee8ff]">
                      <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                      {formData.sessionWindow}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#f0f3ff] focus:bg-white text-[#111c2d] text-xs rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#004e99] border border-[#cbd5e1] transition-all"
                  />
                </div>

                {/* Host Organization */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#111c2d]">Host Organization / Brand Name</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#64748b] text-[20px]">
                      corporate_fare
                    </span>
                    <input
                      type="text"
                      value={formData.hostOrg}
                      onChange={(e) => setFormData({ ...formData, hostOrg: e.target.value })}
                      className="w-full bg-[#f0f3ff] focus:bg-white text-[#111c2d] text-xs rounded-lg pl-10 pr-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#004e99] border border-[#cbd5e1] transition-all"
                    />
                  </div>
                </div>

                {/* Official Campaign Hashtags */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#111c2d]">Official Campaign Hashtags</label>
                    <span className="text-[11px] text-[#64748b]">Recommended: 3–5 tags</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 p-2 bg-[#f0f3ff] rounded-lg border border-[#cbd5e1] min-h-[46px]">
                    {formData.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-[#ffffff] text-[#004e99] px-2.5 py-1 rounded-md text-xs font-medium shadow-sm border border-[#dee8ff]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveHashtag(tag)}
                          className="text-[#64748b] hover:text-[#ba1a1a] ml-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1 pl-1">
                      <span className="material-symbols-outlined text-[16px] text-[#004e99]">add</span>
                      <input
                        type="text"
                        placeholder="Add hashtag..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={handleAddHashtag}
                        className="bg-transparent text-[#111c2d] text-xs outline-none w-28 py-0.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Handles & Destination Hubs */}
                <div className="flex flex-col gap-2 pt-1">
                  <label className="text-xs font-bold text-[#111c2d]">Social Handles & Destination Hubs</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-[#64748b] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#0a66c2]">link</span>
                        LinkedIn Page
                      </span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={formData.linkedinPage}
                          onChange={(e) => setFormData({ ...formData, linkedinPage: e.target.value })}
                          className="w-full bg-[#f0f3ff] text-[#111c2d] text-xs rounded-lg px-2.5 py-2 pr-7 outline-none border border-[#cbd5e1] focus:ring-2 focus:ring-[#004e99]"
                        />
                        <span
                          className="material-symbols-outlined absolute right-2 text-[#004e99] text-[16px]"
                          title="Verified Page Link"
                        >
                          verified
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-[#64748b] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">alternate_email</span>
                        X / Twitter
                      </span>
                      <input
                        type="text"
                        value={formData.twitterHandle}
                        onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                        className="w-full bg-[#f0f3ff] text-[#111c2d] text-xs rounded-lg px-2.5 py-2 outline-none border border-[#cbd5e1] focus:ring-2 focus:ring-[#004e99]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-[#64748b] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">public</span>
                        Official Agenda
                      </span>
                      <input
                        type="text"
                        value={formData.agendaUrl}
                        onChange={(e) => setFormData({ ...formData, agendaUrl: e.target.value })}
                        className="w-full bg-[#f0f3ff] text-[#111c2d] text-xs rounded-lg px-2.5 py-2 outline-none border border-[#cbd5e1] focus:ring-2 focus:ring-[#004e99]"
                      />
                    </div>
                  </div>
                </div>

                {/* Suggested Attendee Takeaway Prompts */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#111c2d]">Suggested Attendee Takeaway Prompts</label>
                    <span className="text-[11px] text-[#006d3c] font-semibold">
                      Auto-suggested in generator chips
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b]">
                    Attendees can click these inside their personal studio to draft instant, specific posts.
                  </p>

                  <div className="flex flex-col gap-2 mt-1">
                    {formData.suggestedPrompts.map((prompt, index) => {
                      const icons = ['lightbulb', 'handshake', 'code', 'rocket_launch'];
                      const iconName = icons[index % icons.length];
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2.5 bg-[#f0f3ff] p-2.5 rounded-lg border border-[#dee8ff]"
                        >
                          <span className="material-symbols-outlined text-[#004e99] text-[20px]">
                            {iconName}
                          </span>
                          <span className="text-xs text-[#111c2d] flex-grow font-medium leading-snug">
                            {prompt}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTakeaway(index)}
                            className="text-[#64748b] hover:text-[#ba1a1a] transition-colors p-0.5"
                          >
                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="text"
                      placeholder="Add another talking point (e.g. 'Learned how zero-trust protects LLMs')..."
                      value={newTakeawayInput}
                      onChange={(e) => setNewTakeawayInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTakeaway();
                        }
                      }}
                      className="flex-grow bg-[#f0f3ff] text-[#111c2d] text-xs rounded-lg px-3 py-2 outline-none border border-[#cbd5e1] focus:ring-2 focus:ring-[#004e99]"
                    />
                    <button
                      type="button"
                      onClick={handleAddTakeaway}
                      className="px-3.5 py-2 bg-[#e7eeff] text-[#004e99] hover:bg-[#dee8ff] rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      Add Prompt
                    </button>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-[#f1f5f9] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[#64748b] text-[11px]">
                    <span className="material-symbols-outlined text-[#006d3c] text-[18px]">
                      verified_user
                    </span>
                    <span>Guardrails Active: Strict Spam & Anti-Phishing Filter</span>
                  </div>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSaveConfig}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0a66c2] hover:bg-[#004e99] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
                  >
                    {isSaving ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span>Save & Update Generator</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Webhook to Stage Slides */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm border border-[#e2e8f0] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#e7eeff] flex items-center justify-center text-[#004e99]">
                  <span className="material-symbols-outlined">sync</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#111c2d]">Live Webhook to Stage Slides</span>
                  <span className="text-xs text-[#64748b]">
                    Send high-performing attendee posts to AV control rooms.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#97f7b6] text-[#00210e] text-[11px] font-semibold">
                  {config.webhookEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  type="button"
                  onClick={onOpenWebhookModal}
                  className="px-3 py-1.5 bg-[#f0f3ff] hover:bg-[#dee8ff] rounded-lg text-xs font-semibold text-[#111c2d] transition-all cursor-pointer"
                >
                  Configure
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Attendee Link & Metrics */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            {/* Public Link Card */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm border border-[#e2e8f0] p-6 flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#004e99] text-[22px]">share</span>
                  <h3 className="text-base font-bold text-[#111c2d]">Attendee Public Generator Link</h3>
                </div>
                <span className="bg-[#e7eeff] text-[#004e99] text-[11px] font-bold px-2 py-0.5 rounded">
                  Quick Share
                </span>
              </div>

              <p className="text-xs text-[#64748b] leading-relaxed">
                Broadcast this customized URL in keynote intro decks, printed badges, or mobile push reminders to trigger instant LinkedIn authoring.
              </p>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-[#f0f3ff] p-2 rounded-lg border border-[#cbd5e1]">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-grow bg-transparent text-[#004e99] text-xs font-mono outline-none px-2 select-all truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-all cursor-pointer ${
                      copiedLink
                        ? 'bg-[#006d3c] text-white'
                        : 'bg-[#004e99] hover:bg-[#0a66c2] text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedLink ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={onOpenQrModal}
                    className="inline-flex items-center gap-1 text-[#004e99] hover:text-[#0a66c2] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                    <span>Display Stage Slide QR Code</span>
                  </button>
                  <span className="text-[11px] text-[#64748b]">Slug: /{formData.shareSlug}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#f0f3ff] border border-[#dee8ff] flex items-start gap-2.5 text-[#414752]">
                <span className="material-symbols-outlined text-[#004e99] text-[20px] flex-shrink-0 mt-0.5">
                  tips_and_updates
                </span>
                <p className="text-xs leading-relaxed">
                  <strong className="text-[#111c2d]">Pro tip:</strong> Screen-sharing this QR during lunch break yields a{' '}
                  <strong className="text-[#006d3c]">3.4x surge</strong> in executive engagement posts.
                </p>
              </div>
            </div>

            {/* Live Social Post Metrics */}
            <div className="bg-[#ffffff] rounded-xl shadow-sm border border-[#e2e8f0] p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#111c2d]">Live Social Post Metrics</h3>
                  <span className="text-[11px] text-[#64748b]">Updated real-time from LinkedIn API stream</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#006d3c] ring-4 ring-[#97f7b6] animate-pulse"></span>
              </div>

              {/* 4 Metric Tiles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f0f3ff] p-3.5 rounded-xl flex flex-col gap-1 border border-[#dee8ff]">
                  <div className="flex items-center justify-between text-[#64748b]">
                    <span className="text-[11px] font-medium">Posts Generated</span>
                    <span className="material-symbols-outlined text-[#004e99] text-[18px]">post_add</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[#111c2d]">{metrics.postsGenerated}</span>
                    <span className="text-xs text-[#006d3c] font-bold flex items-center">
                      <span className="material-symbols-outlined text-[13px]">trending_up</span>
                      {metrics.postsDelta}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748b]">Goal: {metrics.postsGoal} total</span>
                </div>

                <div className="bg-[#f0f3ff] p-3.5 rounded-xl flex flex-col gap-1 border border-[#dee8ff]">
                  <div className="flex items-center justify-between text-[#64748b]">
                    <span className="text-[11px] font-medium">Est. Reach & Views</span>
                    <span className="material-symbols-outlined text-[#004e99] text-[18px]">visibility</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[#111c2d]">{metrics.reach}</span>
                    <span className="text-xs text-[#006d3c] font-bold flex items-center">
                      <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
                      {metrics.reachMultiplier}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748b]">LinkedIn impressions</span>
                </div>

                <div className="bg-[#f0f3ff] p-3.5 rounded-xl flex flex-col gap-1 border border-[#dee8ff]">
                  <div className="flex items-center justify-between text-[#64748b]">
                    <span className="text-[11px] font-medium">Total Reactions</span>
                    <span className="material-symbols-outlined text-[#004e99] text-[18px]">thumb_up</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[#111c2d]">{metrics.totalReactions}</span>
                    <span className="text-[11px] text-[#64748b]">{metrics.avgReactions}</span>
                  </div>
                  <span className="text-[11px] text-[#64748b]">High virality index</span>
                </div>

                <div className="bg-[#f0f3ff] p-3.5 rounded-xl flex flex-col gap-1 border border-[#dee8ff]">
                  <div className="flex items-center justify-between text-[#64748b]">
                    <span className="text-[11px] font-medium">Booth / Link Clicks</span>
                    <span className="material-symbols-outlined text-[#004e99] text-[18px]">ads_click</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[#111c2d]">{metrics.clicks.toLocaleString()}</span>
                    <span className="text-xs text-[#004e99] font-bold">{metrics.ctr}</span>
                  </div>
                  <span className="text-[11px] text-[#64748b]">To apexcloud.io/summit</span>
                </div>
              </div>

              {/* Recent Attendee Activity Feed */}
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#111c2d]">Recent Attendee Activity Feed</h4>
                  <button
                    type="button"
                    onClick={onOpenActivityModal}
                    className="text-xs font-semibold text-[#004e99] hover:underline cursor-pointer"
                  >
                    View All {metrics.postsGenerated}
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {activities.slice(0, 3).map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-3 p-3 bg-[#f0f3ff] rounded-lg border border-[#dee8ff] transition-transform hover:-translate-y-0.5"
                    >
                      <div
                        className={`w-9 h-9 rounded-full ${act.avatarBgColor} ${act.avatarTextColor} font-bold text-xs flex items-center justify-center flex-shrink-0`}
                      >
                        {act.initials}
                      </div>

                      <div className="flex flex-col flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-[#111c2d] truncate">{act.name}</span>
                          <span className="text-[10px] text-[#64748b] flex-shrink-0">{act.timeAgo}</span>
                        </div>
                        <span className="text-[11px] text-[#64748b] truncate">
                          {act.role} @ {act.company}
                        </span>
                        <p className="text-xs text-[#111c2d] mt-1 line-clamp-2 leading-relaxed">
                          "{act.content}"
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#dee8ff]/60">
                          <span className="text-[11px] text-[#006d3c] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                            {act.reactions} Reactions
                          </span>
                          <a
                            className="inline-flex items-center gap-1 text-[11px] text-[#004e99] hover:underline"
                            href={act.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>View on LinkedIn</span>
                            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
