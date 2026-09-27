import React, { useState } from 'react';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhookUrl: string;
  enabled: boolean;
  onSave: (url: string, enabled: boolean) => void;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({
  isOpen,
  onClose,
  webhookUrl: initialUrl,
  enabled: initialEnabled,
  onSave,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [minReactions, setMinReactions] = useState(50);
  const [tested, setTested] = useState(false);

  if (!isOpen) return null;

  const handleTest = () => {
    setTested(true);
    setTimeout(() => setTested(false), 3000);
  };

  const handleSave = () => {
    onSave(url, enabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#263143]/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full border border-[#e2e8f0]">
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e7eeff] text-[#004e99] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">sync</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#111c2d]">Live Webhook to Stage Slides</h3>
              <p className="text-xs text-[#64748b]">Broadcast high-performing attendee posts directly to auditorium AV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#f0f3ff] text-[#414752]"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 py-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0f3ff] border border-[#dee8ff]">
            <div>
              <span className="font-semibold text-sm text-[#111c2d] block">Automated Stage Stream</span>
              <span className="text-[#64748b]">Forward posts when virality threshold is met</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006d3c]"></div>
            </label>
          </div>

          <div>
            <label className="font-semibold text-[#111c2d] block mb-1">AV Control Room Webhook Endpoint</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://av-stage.apexcloud.io/webhooks/social-wall/feed-live"
              className="w-full bg-[#f0f3ff] text-[#111c2d] font-mono text-xs rounded-lg px-3 py-2 border border-[#cbd5e1] focus:ring-2 focus:ring-[#004e99] outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-[#111c2d] block mb-1">Minimum Reaction Threshold (Auto-Push)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={minReactions}
                onChange={(e) => setMinReactions(Number(e.target.value))}
                className="flex-1 accent-[#004e99]"
              />
              <span className="font-bold text-[#004e99] bg-[#e7eeff] px-2.5 py-1 rounded-md min-w-[50px] text-center">
                {minReactions}+
              </span>
            </div>
            <span className="text-[11px] text-[#64748b] mt-1 block">
              Posts exceeding this count will be formatted into 16:9 projection cards.
            </span>
          </div>

          {tested && (
            <div className="p-2.5 rounded-lg bg-[#97f7b6]/30 border border-[#006d3c]/40 text-[#00210e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006d3c] text-[18px]">check_circle</span>
              <span>Test payload delivered successfully! HTTP 200 OK</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
          <button
            type="button"
            onClick={handleTest}
            className="px-3 py-2 bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#004e99] rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Send Test Ping</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-[#414752] hover:bg-[#f0f3ff] rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-[#004e99] hover:bg-[#0a66c2] text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
