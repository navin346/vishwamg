import mockDataJson from './mock-data.json';
import mockTransactionsInrJson from './mock-transactions-inr.json';
import mockTransactionsUsdJson from './mock-transactions-usd.json';
import mockBillersJson from './mock-billers.json';
import mockContactsJson from './mock-contacts.json';

export interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export interface InternationalAccountData {
  balance: string;
  currency: string;
  card: CardDetails;
  walletAddress: string;
}

export interface LinkedAccountSummary {
  bankName: string;
  accountNumberMask: string;
}

export interface IndiaAccountData {
  balance: string;
  currency: string;
  card: CardDetails;
  linkedAccounts: LinkedAccountSummary[];
  upiHandle: string;
}

export interface MockAppData {
  international: InternationalAccountData;
  india: IndiaAccountData;
}

export interface TransactionSummary {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
}

export interface TransactionsResponse {
  transactions: TransactionSummary[];
}

export interface BillerDetails {
  name: string;
  logo: string;
}

export interface BillerCategory {
  name: string;
  icon: string;
  billers: BillerDetails[];
}

export interface BillersDirectory {
  categories: BillerCategory[];
}

export interface ContactEntry {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  upiId?: string;
  email?: string;
  walletAddress?: string;
}

export interface ContactsDirectory {
  india: ContactEntry[];
  international: ContactEntry[];
}

export const mockData = mockDataJson as MockAppData;
export const transactionsInrData = mockTransactionsInrJson as TransactionsResponse;
export const transactionsUsdData = mockTransactionsUsdJson as TransactionsResponse;
export const billersData = mockBillersJson as BillersDirectory;
export const contactsDirectory = mockContactsJson as ContactsDirectory;
