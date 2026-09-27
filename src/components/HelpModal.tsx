import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#263143]/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-[#e2e8f0]">
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004e99] text-[24px]">help</span>
            <h3 className="font-bold text-base text-[#111c2d]">EventPulse PRO Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#f0f3ff] text-[#414752]"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-[#414752] leading-relaxed">
          <div className="p-3 bg-[#f0f3ff] rounded-xl border border-[#dee8ff]">
            <strong className="text-sm text-[#004e99] block mb-1">1. Organizer Workspace</strong>
            Configure campaign tags, official speaker handles, and preset takeaway prompts. All updates sync instantly to the public Attendee Generator link.
          </div>

          <div className="p-3 bg-[#f0f3ff] rounded-xl border border-[#dee8ff]">
            <strong className="text-sm text-[#004e99] block mb-1">2. Attendee Generator Link</strong>
            Display the QR code on stage slides during breaks. Attendees scan to access their personalized post creation studio with 1-click photo attachment and AI post drafting.
          </div>

          <div className="p-3 bg-[#f0f3ff] rounded-xl border border-[#dee8ff]">
            <strong className="text-sm text-[#004e99] block mb-1">3. Live Webhook to AV Stage Screens</strong>
            Stream high-performing attendee posts (80+ reactions) to the stage projector during networking breaks to fuel excitement and organic virality.
          </div>
        </div>

        <div className="pt-3 border-t border-[#f1f5f9] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#004e99] hover:bg-[#0a66c2] text-white rounded-xl text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
