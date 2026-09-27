import React from 'react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  onDownload: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, slug, onDownload }) => {
  if (!isOpen) return null;

  const url = `https://eventpulse.ai/share/${slug}?ref=attendee`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#263143]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#ffffff] rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-auto flex flex-col items-center gap-4 text-center border border-[#e2e8f0]">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004e99] text-[22px]">qr_code_2</span>
            <h3 className="text-lg font-bold text-[#111c2d]">Keynote Stage Slide QR</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#f0f3ff] text-[#414752] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-xs text-[#414752] leading-relaxed text-left">
          Display on the main auditorium projector or break slides. Directs audience smartphones straight to the Attendee LinkedIn Post Generator with pre-populated event tags.
        </p>

        {/* QR Display Card */}
        <div className="p-6 bg-[#f0f3ff] rounded-2xl flex flex-col items-center justify-center shadow-inner w-full border border-[#dee8ff]">
          <div className="w-56 h-56 bg-white p-3 rounded-xl shadow-md flex items-center justify-center">
            <svg className="w-full h-full text-[#111c2d] fill-current" viewBox="0 0 100 100">
              <path d="M0,0 h30 v30 h-30 z M6,6 v18 h18 v-18 z M10,10 h10 v10 h-10 z" />
              <path d="M70,0 h30 v30 h-30 z M76,6 v18 h18 v-18 z M80,10 h10 v10 h-10 z" />
              <path d="M0,70 h30 v30 h-30 z M6,76 v18 h18 v-18 z M10,80 h10 v10 h-10 z" />
              <rect height="6" width="6" x="36" y="8" />
              <rect height="12" width="6" x="46" y="14" />
              <rect height="6" width="8" x="56" y="8" />
              <rect height="12" width="12" x="36" y="36" />
              <rect height="6" width="6" x="52" y="36" />
              <rect height="10" width="10" x="62" y="42" />
              <rect height="8" width="18" x="76" y="36" />
              <rect height="10" width="10" x="84" y="48" />
              <rect height="16" width="8" x="36" y="52" />
              <rect height="8" width="10" x="48" y="58" />
              <rect height="12" width="8" x="62" y="60" />
              <rect height="22" width="6" x="36" y="72" />
              <rect height="6" width="16" x="46" y="78" />
              <rect height="8" width="12" x="66" y="76" />
              <rect height="12" width="12" x="82" y="72" />
              <rect height="6" width="14" x="80" y="88" />
            </svg>
          </div>
          <span className="text-xs text-[#004e99] font-mono mt-3 font-semibold break-all select-all">
            {url}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full mt-2">
          <button
            type="button"
            onClick={onDownload}
            className="flex-1 py-2.5 bg-[#004e99] hover:bg-[#0a66c2] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Download 4K PNG</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
