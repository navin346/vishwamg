import React, { useMemo, useState } from 'react';
import { billersData } from '../data';

interface ShoppingProps {
  onCancel: () => void;
}

type ShoppingTab = 'bills' | 'recharges' | 'experiences' | 'offers';

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

const tabs: Array<{ key: ShoppingTab; label: string; description: string }> = [
  {
    key: 'bills',
    label: 'Bills',
    description: 'Electricity, water, broadband and more — streamline routine payments in one place.'
  },
  {
    key: 'recharges',
    label: 'Recharges',
    description: 'Top up mobile, FASTag and data packs instantly with region-aware pricing.'
  },
  {
    key: 'experiences',
    label: 'Experiences',
    description: 'Book travel, events and subscriptions with multi-currency support and instant confirmation.'
  },
  {
    key: 'offers',
    label: 'Offers',
    description: 'Curated partner rewards and seasonal deals across local and global merchants.'
  }
];

const Shopping: React.FC<ShoppingProps> = ({ onCancel }) => {
  const [activeTab, setActiveTab] = useState<ShoppingTab>('bills');

  const billerCategories = useMemo(() => billersData.categories, []);

  return (
    <div className="fixed inset-0 bg-slate-900 z-30 flex flex-col">
      <header className="p-4 flex items-center">
        <button onClick={onCancel} className="text-white p-2" aria-label="Back">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white mx-auto pr-8">Shopping</h1>
      </header>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="flex space-x-3 overflow-x-auto pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="mt-6 space-y-6">
          <p className="text-slate-300 leading-relaxed">{tabs.find((tab) => tab.key === activeTab)?.description}</p>

          {activeTab === 'bills' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {billerCategories.map((category) => (
                <div
                  key={category.name}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-start shadow-lg"
                >
                  <span className="text-3xl mb-3">{category.icon}</span>
                  <h2 className="text-lg font-semibold text-white">{category.name}</h2>
                  <p className="text-xs text-slate-400 mt-2">
                    Upcoming integration with {category.billers.slice(0, 2).map((biller) => biller.name).join(', ')} and more.
                  </p>
                  <span className="mt-4 text-xs uppercase tracking-wide text-cyan-400">Launching soon</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recharges' && (
            <div className="grid gap-4">
              {["Mobile Plans", "FASTag", "Data Cards"].map((service) => (
                <div key={service} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-lg">
                  <h2 className="text-lg font-semibold text-white">{service}</h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Region-aware packs, auto-reminders and multi-currency settlements will appear here.
                  </p>
                  <div className="mt-4 flex items-center text-xs text-slate-500 uppercase tracking-wide">
                    <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    Prototype in progress
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'experiences' && (
            <div className="grid gap-4">
              {['Flights & Hotels', 'Streaming Bundles', 'City Events'].map((item) => (
                <div key={item} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-lg">
                  <h2 className="text-lg font-semibold text-white">{item}</h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Browse, pay and split with friends seamlessly. Content goes live alongside partner launches.
                  </p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center px-3 py-2 rounded-lg bg-slate-700 text-slate-200 text-sm"
                  >
                    Preview mocks
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="grid gap-4">
              {['Cashback Vault', 'Merchant Spotlight', 'Seasonal Drops'].map((spotlight) => (
                <div key={spotlight} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-lg">
                  <h2 className="text-lg font-semibold text-white">{spotlight}</h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Personalised deals across India and international partners will rotate weekly here.
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Stay tuned</span>
                    <span className="text-xs font-semibold text-cyan-400">Coming Soon</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Shopping;
