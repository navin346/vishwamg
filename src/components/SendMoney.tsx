import React, { useMemo, useState } from 'react';
import { contactsDirectory, type ContactEntry } from '../data';

interface SendMoneyProps {
  onCancel: () => void;
}

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const SendMoney: React.FC<SendMoneyProps> = ({ onCancel }) => {
  const contacts = useMemo(() => contactsDirectory.india, []);
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactEntry | null>(null);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query) ||
      (contact.upiId?.toLowerCase().includes(query) ?? false)
    );
  }, [contacts, searchQuery]);

  const handleContactSelect = (contact: ContactEntry) => {
    setSelectedContact(contact);
    setUpiId(contact.upiId ?? contact.phone);
  };

  const handlePay = () => {
    // Basic validation
    if (!upiId || !amount) {
      alert('Please fill in UPI ID and Amount.');
      return;
    }

    const payeeName = "Vishwam Demo"; // Payee name for the transaction
    
    // Construct the UPI deep link
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&tn=${encodeURIComponent(note)}&cu=INR`;

    // Create an anchor element and click it to trigger the UPI app
    const a = document.createElement('a');
    a.href = upiUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-30 flex flex-col">
      {/* Top bar */}
      <header className="p-4 flex items-center">
            <button onClick={onCancel} className="text-white p-2" aria-label="Back">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white mx-auto">Send Money</h1>
      </header>
      
      <main className="flex-grow flex flex-col p-6 space-y-6 overflow-y-auto">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Select a contact</h2>
            <span className="text-xs text-slate-400 uppercase tracking-wide">Phonebook Sync</span>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone or UPI ID"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                    ? 'border-cyan-400 bg-slate-800'
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
                  <p className="text-xs text-slate-400">{contact.upiId ?? contact.phone}</p>
                </span>
              </button>
            ))}
            {filteredContacts.length === 0 && (
              <p className="col-span-2 text-sm text-slate-500 text-center py-6 border border-dashed border-slate-700 rounded-2xl">
                No contacts matched “{searchQuery}”.
              </p>
            )}
          </div>
        </section>

        <form className="space-y-6 flex flex-col flex-grow" onSubmit={(e) => e.preventDefault()}>
          {selectedContact && (
            <div className="flex items-center justify-between bg-slate-800 border border-cyan-400/40 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <span
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: selectedContact.avatarColor }}
                >
                  {selectedContact.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{selectedContact.name}</p>
                  <p className="text-xs text-slate-400">{selectedContact.phone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedContact(null);
                  setUpiId('');
                }}
                className="text-xs text-slate-400 underline"
              >
                Clear
              </button>
            </div>
          )}

          <div>
            <label htmlFor="upiId" className="block text-sm font-medium text-slate-400 mb-1">
              Recipient's UPI ID
            </label>
            <input
              id="upiId"
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="ceo@okbank"
              required
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">
              Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">₹</span>
              <input
                id="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-slate-400 mb-1">
              Note (Optional)
            </label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Demo"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex-grow"></div>

          <div className="pb-4">
            <button
              type="button"
              onClick={handlePay}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={!upiId || !amount || parseFloat(amount) <= 0}
            >
                Pay via UPI App
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SendMoney;