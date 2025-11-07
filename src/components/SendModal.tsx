import React, { useMemo, useState, useEffect } from 'react';
import { contactsDirectory, type ContactEntry } from '../data';

// Re-using the CheckmarkIcon for success animation
const CheckmarkIcon: React.FC = () => (
    <svg className="w-24 h-24 text-green-400" viewBox="0 0 52 52">
        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        <style>{`
        .checkmark__circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke-miterlimit: 10;
            stroke: #7ac142;
            fill: none;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark__check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
            100% {
                stroke-dashoffset: 0;
            }
        }
        `}</style>
    </svg>
);


interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSuccess: (amount: number) => void;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, onSendSuccess }) => {
  const contacts = useMemo(() => contactsDirectory.international, []);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactEntry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query) ||
      (contact.email?.toLowerCase().includes(query) ?? false)
    );
  }, [contacts, searchQuery]);

  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setRecipient('');
      setAmount('');
      setSearchQuery('');
      setSelectedContact(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleContactSelect = (contact: ContactEntry) => {
    setSelectedContact(contact);
    setRecipient(contact.email ?? contact.walletAddress ?? contact.phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sendAmount = parseFloat(amount);
    if (sendAmount > 0 && recipient) {
      setIsProcessing(true);
      setTimeout(() => {
        onSendSuccess(sendAmount);
      }, 2000); // 2-second success animation
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center p-8 h-80">
             <CheckmarkIcon />
             <p className="text-xl font-bold text-white mt-4">Success!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Send Funds</h2>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close send modal">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Recent Contacts</p>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Synced</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search email, wallet or phone"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => handleContactSelect(contact)}
                        className={`flex items-center space-x-3 rounded-2xl border p-3 text-left transition-colors ${
                          selectedContact?.id === contact.id
                            ? 'border-cyan-400 bg-slate-900'
                            : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                        }`}
                      >
                        <span
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: contact.avatarColor }}
                        >
                          {contact.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        <span>
                          <p className="text-sm font-semibold text-white">{contact.name}</p>
                          <p className="text-xs text-slate-400">{contact.email ?? contact.walletAddress ?? contact.phone}</p>
                        </span>
                      </button>
                    ))}
                    {filteredContacts.length === 0 && (
                      <p className="col-span-2 text-xs text-slate-500 text-center py-4 border border-dashed border-slate-700 rounded-2xl">
                        No contacts matched “{searchQuery}”.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-slate-400 mb-1">Phone Number or Email</label>
                  <input
                    id="recipient"
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                {selectedContact && (
                  <div className="flex items-center justify-between bg-slate-900 border border-cyan-400/30 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{selectedContact.name}</p>
                      <p className="text-xs text-slate-400">{selectedContact.email ?? selectedContact.walletAddress ?? selectedContact.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedContact(null);
                        setRecipient('');
                      }}
                      className="text-xs text-slate-400 underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">USD Amount</label>
                  <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">$</span>
                      <input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="10.00"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-b-xl">
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                disabled={!recipient || !amount || parseFloat(amount) <= 0}
              >
                Send
              </button>
              <p className="text-xs text-slate-500 text-center mt-4">
                First-time transfers are limited to $10. KYC is required for higher limits.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendModal;