import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalBody, setModalBody] = useState<string | null>(null);

  const handleOpenInfo = (title: string, body: string) => {
    setModalTitle(title);
    setModalBody(body);
  };

  return (
    <>
      <footer className="w-full bg-[#f0f3ff] py-6 mt-12 border-t border-[#dee8ff]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[#414752] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#004e99]">EventPulse</span>
            <span>© 2025 EventPulse Technologies Inc. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              type="button"
              onClick={() =>
                handleOpenInfo(
                  'Privacy Policy',
                  'EventPulse PRO is designed with enterprise data privacy standards. All attendee drafts generated remain strictly private until the user actively decides to post to LinkedIn. No personal LinkedIn tokens or credentials are stored without consent.'
                )
              }
              className="hover:text-[#111c2d] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() =>
                handleOpenInfo(
                  'Terms of Service',
                  'By using the EventPulse Amplification workspace and Attendee Post Generator, organizations and participants agree to abide by community guidelines, preventing spam, deceptive content, or unauthorized automated publication.'
                )
              }
              className="hover:text-[#111c2d] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() =>
                handleOpenInfo(
                  'LinkedIn Compliance',
                  'EventPulse complies fully with LinkedIn Developer Terms of Service and API Guidelines. Posts are reviewed and authored by attendees personally before publication through official LinkedIn sharing intents.'
                )
              }
              className="hover:text-[#111c2d] transition-colors cursor-pointer"
            >
              LinkedIn Compliance
            </button>
            <button
              type="button"
              onClick={() =>
                handleOpenInfo(
                  'Help Center',
                  'Need technical assistance setting up stage QR codes, connecting AV control rooms, or customizing brand colors? Reach out to support@eventpulse.ai or speak with your dedicated Account Executive.'
                )
              }
              className="hover:text-[#111c2d] transition-colors cursor-pointer"
            >
              Help Center
            </button>
          </div>
        </div>
      </footer>

      {modalTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#263143]/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-[#e2e8f0]">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
              <h3 className="font-bold text-base text-[#111c2d]">{modalTitle}</h3>
              <button
                onClick={() => setModalTitle(null)}
                className="p-1 rounded-lg hover:bg-[#f0f3ff] text-[#414752]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="py-4 text-xs text-[#414752] leading-relaxed">{modalBody}</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModalTitle(null)}
                className="px-4 py-2 bg-[#004e99] text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
