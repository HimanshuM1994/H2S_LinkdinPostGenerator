import React, { useState } from 'react';
import { AttendeeActivity } from '../types';

interface ActivityFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: AttendeeActivity[];
  onToggleStageApproval: (id: string) => void;
}

export const ActivityFeedModal: React.FC<ActivityFeedModalProps> = ({
  isOpen,
  onClose,
  activities,
  onToggleStageApproval,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApproved, setFilterApproved] = useState(false);

  if (!isOpen) return null;

  const filtered = activities.filter((act) => {
    const matchesSearch =
      act.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterApproved ? act.approvedForStage : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#263143]/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-[#e2e8f0] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-[#111c2d]">Live Attendee Social Post Stream</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#d6e3ff] text-[#004e99] text-[11px] font-bold">
                486 posts total
              </span>
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">
              Real-time syndicated LinkedIn posts tagged with #TechConnect2025
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f0f3ff] text-[#414752]"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#64748b] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by attendee, company, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white pl-9 pr-3 py-2 rounded-lg text-xs border border-[#cbd5e1] focus:ring-2 focus:ring-[#004e99] outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterApproved(!filterApproved)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                filterApproved
                  ? 'bg-[#006d3c] text-white'
                  : 'bg-white border border-[#cbd5e1] text-[#414752] hover:bg-[#f0f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {filterApproved ? 'check_circle' : 'filter_list'}
              </span>
              <span>Stage Approved Only</span>
            </button>
          </div>
        </div>

        {/* List of posts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#64748b] text-xs">
              No matching attendee posts found.
            </div>
          ) : (
            filtered.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-[#f0f3ff]/70 border border-[#dee8ff] hover:bg-[#f0f3ff] transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full ${act.avatarBgColor} ${act.avatarTextColor} font-bold text-xs flex items-center justify-center`}
                    >
                      {act.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#111c2d]">{act.name}</span>
                        <span className="text-[10px] text-[#64748b]">• {act.timeAgo}</span>
                      </div>
                      <span className="text-[11px] text-[#414752]">
                        {act.role} @ {act.company}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleStageApproval(act.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                        act.approvedForStage
                          ? 'bg-[#97f7b6] text-[#00210e]'
                          : 'bg-white border border-[#cbd5e1] text-[#414752] hover:bg-[#e7eeff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {act.approvedForStage ? 'tv' : 'add_to_queue'}
                      </span>
                      <span>{act.approvedForStage ? 'On Stage Screen' : 'Push to Stage'}</span>
                    </button>
                    <a
                      href={act.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-[#004e99] hover:bg-[#dee8ff] rounded-md transition-colors"
                      title="View on LinkedIn"
                    >
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                <p className="text-xs text-[#111c2d] bg-white p-2.5 rounded-lg border border-[#e2e8f0]/60 leading-relaxed">
                  "{act.content}"
                </p>

                <div className="flex items-center gap-4 text-[11px] text-[#64748b]">
                  <span className="flex items-center gap-1 text-[#006d3c] font-semibold">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    {act.reactions} Reactions
                  </span>
                  <span>💬 {act.comments} Comments</span>
                  <span>🔁 {act.reposts} Reposts</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#004e99] hover:bg-[#0a66c2] text-white rounded-xl text-xs font-semibold"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};
