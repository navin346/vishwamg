
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
