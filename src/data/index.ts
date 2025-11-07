import mockDataJson from './mock-data.json';
import mockTransactionsInrJson from './mock-transactions-inr.json';
import mockTransactionsUsdJson from './mock-transactions-usd.json';
import mockBillersJson from './mock-billers.json';

export interface InternationalCardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export interface InternationalAccountData {
  balance: string;
  currency: string;
  card: InternationalCardDetails;
}

export interface LinkedAccountSummary {
  bankName: string;
  accountNumberMask: string;
}

export interface IndiaAccountData {
  linkedAccounts: LinkedAccountSummary[];
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

export const mockData = mockDataJson as MockAppData;
export const transactionsInrData = mockTransactionsInrJson as TransactionsResponse;
export const transactionsUsdData = mockTransactionsUsdJson as TransactionsResponse;
export const billersData = mockBillersJson as BillersDirectory;
