import { useState } from 'react';
import { ActivityFeedModal } from './components/ActivityFeedModal';
import { AttendeeGenerator } from './components/AttendeeGenerator';
import { Footer } from './components/Footer';
import { HelpModal } from './components/HelpModal';
import { Navbar } from './components/Navbar';
import { OrganizerWorkspace } from './components/OrganizerWorkspace';
import { QrModal } from './components/QrModal';
import { Toast } from './components/Toast';
import { WebhookModal } from './components/WebhookModal';
import {
  INITIAL_ACTIVITIES,
  INITIAL_EVENT_CONFIG,
  INITIAL_METRICS,
} from './data/mockData';
import { AttendeeActivity, EventConfig, MetricSummary, ViewMode } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('organizer-dashboard');
  const [eventConfig, setEventConfig] = useState<EventConfig>(INITIAL_EVENT_CONFIG);
  const [metrics, setMetrics] = useState<MetricSummary>(INITIAL_METRICS);
  const [activities, setActivities] = useState<AttendeeActivity[]>(INITIAL_ACTIVITIES);

  // Modals state
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  const handleUpdateConfig = (newConfig: EventConfig) => {
    setEventConfig(newConfig);
  };

  const handleToggleStageApproval = (id: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const newVal = !act.approvedForStage;
          showToast(
            newVal
              ? `"${act.name}" approved and broadcasted to Stage Projection AV!`
              : `"${act.name}" removed from stage queue.`
          );
          return { ...act, approvedForStage: newVal };
        }
        return act;
      })
    );
  };

  const handleSaveWebhook = (url: string, enabled: boolean) => {
    setEventConfig((prev) => ({
      ...prev,
      webhookUrl: url,
      webhookEnabled: enabled,
    }));
    showToast(enabled ? 'Stage Webhook enabled & updated.' : 'Stage Webhook disabled.');
  };

  const handleIncrementMetrics = () => {
    setMetrics((prev) => ({
      ...prev,
      postsGenerated: prev.postsGenerated + 1,
    }));
  };

  const handleDownloadQrPng = () => {
    // Generate a simple download link for demo
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#ffffff"/>
      <path d="M0,0 h30 v30 h-30 z M6,6 v18 h18 v-18 z M10,10 h10 v10 h-10 z" fill="#111c2d"/>
      <path d="M70,0 h30 v30 h-30 z M76,6 v18 h18 v-18 z M80,10 h10 v10 h-10 z" fill="#111c2d"/>
      <path d="M0,70 h30 v30 h-30 z M6,76 v18 h18 v-18 z M10,80 h10 v10 h-10 z" fill="#111c2d"/>
      <rect x="36" y="8" width="6" height="6" fill="#111c2d"/>
      <rect x="46" y="14" width="6" height="12" fill="#111c2d"/>
      <rect x="56" y="8" width="8" height="6" fill="#111c2d"/>
      <rect x="36" y="36" width="12" height="12" fill="#111c2d"/>
      <rect x="52" y="36" width="6" height="6" fill="#111c2d"/>
      <rect x="62" y="42" width="10" height="10" fill="#111c2d"/>
      <rect x="76" y="36" width="18" height="8" fill="#111c2d"/>
      <rect x="84" y="48" width="10" height="10" fill="#111c2d"/>
      <rect x="36" y="52" width="8" height="16" fill="#111c2d"/>
      <rect x="48" y="58" width="10" height="8" fill="#111c2d"/>
      <rect x="62" y="60" width="8" height="12" fill="#111c2d"/>
      <rect x="36" y="72" width="6" height="22" fill="#111c2d"/>
      <rect x="46" y="78" width="16" height="6" fill="#111c2d"/>
      <rect x="66" y="76" width="12" height="8" fill="#111c2d"/>
      <rect x="82" y="72" width="12" height="12" fill="#111c2d"/>
      <rect x="80" y="88" width="14" height="6" fill="#111c2d"/>
    </svg>`;
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TechConnect2025_Stage_Slide_QR.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Downloaded Keynote Stage Slide QR asset.');
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#111c2d] flex flex-col font-sans">
      {/* Fixed Navigation Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeEventName={eventConfig.name}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main View Container with top spacing for fixed 64px header */}
      <main className="w-full pt-16 flex-grow">
        {currentView === 'organizer-dashboard' ? (
          <OrganizerWorkspace
            config={eventConfig}
            onUpdateConfig={handleUpdateConfig}
            metrics={metrics}
            activities={activities}
            onPreviewAttendeeFlow={() => {
              setCurrentView('attendee-generator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              showToast('Switched to live Attendee Generator simulation.');
            }}
            onOpenQrModal={() => setIsQrOpen(true)}
            onOpenWebhookModal={() => setIsWebhookOpen(true)}
            onOpenActivityModal={() => setIsActivityOpen(true)}
            onShowToast={showToast}
          />
        ) : (
          <AttendeeGenerator
            config={eventConfig}
            onShowToast={showToast}
            onIncrementMetrics={handleIncrementMetrics}
          />
        )}
      </main>

      {/* Shared Platform Footer */}
      <Footer />

      {/* Modals */}
      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        slug={eventConfig.shareSlug}
        onDownload={handleDownloadQrPng}
      />

      <WebhookModal
        isOpen={isWebhookOpen}
        onClose={() => setIsWebhookOpen(false)}
        webhookUrl={eventConfig.webhookUrl}
        enabled={eventConfig.webhookEnabled}
        onSave={handleSaveWebhook}
      />

      <ActivityFeedModal
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        activities={activities}
        onToggleStageApproval={handleToggleStageApproval}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
