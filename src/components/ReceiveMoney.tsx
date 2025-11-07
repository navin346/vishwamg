import React, { useState } from 'react';

interface ReceiveMoneyProps {
  onCancel: () => void;
  currency: string;
  accountLabel: string;
  accountValue: string;
}

type ReceiveView = 'my-qr' | 'scan';

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const QrPlaceholder: React.FC = () => (
  <div className="w-56 h-56 rounded-3xl bg-white text-slate-900 flex items-center justify-center font-semibold text-lg">
    QR Preview
  </div>
);

const ReceiveMoney: React.FC<ReceiveMoneyProps> = ({ onCancel, currency, accountLabel, accountValue }) => {
  const [view, setView] = useState<ReceiveView>('my-qr');

  return (
    <div className="fixed inset-0 bg-slate-900 z-30 flex flex-col">
      <header className="p-4 flex items-center">
        {view === 'my-qr' ? (
          <button onClick={onCancel} className="text-white p-2" aria-label="Back">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={() => setView('my-qr')} className="text-white p-2" aria-label="Back to QR">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold text-white mx-auto pr-8">Receive Money</h1>
      </header>

      <main className="flex-grow p-6 flex flex-col items-center text-center space-y-8">
        <div className="inline-flex bg-slate-800 rounded-full p-1">
          <button
            onClick={() => setView('my-qr')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              view === 'my-qr' ? 'bg-cyan-500 text-white' : 'text-slate-300'
            }`}
          >
            My QR
          </button>
          <button
            onClick={() => setView('scan')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              view === 'scan' ? 'bg-cyan-500 text-white' : 'text-slate-300'
            }`}
          >
            Scan &amp; Pay
          </button>
        </div>

        {view === 'my-qr' ? (
          <>
            <QrPlaceholder />
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wide text-slate-400">{accountLabel}</p>
              <p className="text-2xl font-semibold text-white">{accountValue}</p>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Share this code with the sender. They can complete the transfer instantly in {currency} supported apps.
            </p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm">
                Save Image
              </button>
              <button className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm">
                Share Link
              </button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-md">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-left space-y-4">
              <h2 className="text-lg font-semibold text-white">Camera Coming Soon</h2>
              <p className="text-sm text-slate-400">
                Secure on-device scanning with automatic detection is being finalised. Until then, try the Send flow to add
                contacts manually.
              </p>
              <div className="flex items-center space-x-3 text-sm text-slate-500">
                <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Beta roll-out scheduled for the next release.</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReceiveMoney;
