
import { db } from '@/src/firebase';
import { doc, runTransaction, collection, Timestamp } from 'firebase/firestore';

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    REMITTANCE = 'REMITTANCE',
    BILL_PAY = 'BILL_PAY',
    FX_CONVERSION = 'FX_CONVERSION',
    SPEND = 'SPEND',
    INCOME = 'INCOME' 
}

export interface LedgerTransactionInput {
    userId: string;
    amount: number;
    currency: 'USD' | 'INR';
    type: TransactionType;
    description: string;
    metadata?: Record<string, any>;
}

export interface CrossBorderTransactionInput {
    userId: string;
    fromCurrency: 'USD' | 'INR';
    toCurrency: 'USD' | 'INR';
    amountIn: number; // Amount deducted from Source
    amountOut: number; // Amount added to Destination
    rate: number;
    fees: number;
    description: string;
    beneficiaryMetadata: any;
}

export const LedgerService = {
    /**
     * Records a transaction with double-entry principles (conceptually).
     * In a full backend, this would update a central ledger and a user wallet.
     * Here, it securely updates the Firestore user balance and transactions subcollection.
     */
    recordTransaction: async (input: LedgerTransactionInput) => {
        const { userId, amount, currency, type, description, metadata } = input;
        
        if (amount <= 0) throw new Error("Transaction amount must be positive.");

        const userDocRef = doc(db, 'users', userId);
        const balanceField = currency === 'USD' ? 'usd_balance' : 'inr_balance';

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw new Error("User does not exist.");
            }

            const userData = userDoc.data();
            const currentBalanceStr = userData[balanceField] || '0.00';
            const currentBalance = parseFloat(currentBalanceStr.replace(/,/g, ''));
            
            // Calculate new balance
            let finalAmount = amount;
            if ([TransactionType.WITHDRAWAL, TransactionType.SPEND, TransactionType.BILL_PAY, TransactionType.REMITTANCE].includes(type)) {
                finalAmount = -amount;
            }

            const newBalance = currentBalance + finalAmount;
            
            if (newBalance < 0) {
                 throw new Error("Insufficient funds.");
            }

            const formattedBalance = newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            // 1. Update Balance
            transaction.update(userDocRef, { [balanceField]: formattedBalance });

            // 2. Create Transaction Record
            const transactionRef = doc(collection(db, 'users', userId, 'transactions'));
            transaction.set(transactionRef, {
                amount: finalAmount, // Store signed amount for history
                currency,
                type,
                category: type === TransactionType.DEPOSIT ? 'Income' : (metadata?.category || 'General'),
                merchant: description,
                timestamp: Timestamp.now(),
                method: metadata?.method || 'System',
                metadata: metadata || {}
            });
        });
    },

    /**
     * Executes an atomic cross-border transfer.
     * Debits Source Currency Wallet -> Credits Destination Currency Wallet (Simulating instant remit)
     */
    recordCrossBorderTransaction: async (input: CrossBorderTransactionInput) => {
        const { userId, fromCurrency, toCurrency, amountIn, amountOut, rate, fees, description, beneficiaryMetadata } = input;

        const userDocRef = doc(db, 'users', userId);
        const sourceBalanceField = fromCurrency === 'USD' ? 'usd_balance' : 'inr_balance';
        const destBalanceField = toCurrency === 'USD' ? 'usd_balance' : 'inr_balance';

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) throw new Error("User not found");

            const userData = userDoc.data();

            // 1. Check Source Balance
            const sourceStr = userData[sourceBalanceField] || '0.00';
            const sourceBalance = parseFloat(sourceStr.replace(/,/g, ''));
            if (sourceBalance < amountIn) throw new Error("Insufficient funds for remittance");

            // 2. Calculate New Balances
            const newSourceBalance = sourceBalance - amountIn;
            
            // For the demo, if beneficiary is Self (or just generally for the super-app feel),
            // we credit the destination wallet immediately so the user sees it when they toggle mode.
            const destStr = userData[destBalanceField] || '0.00';
            const destBalance = parseFloat(destStr.replace(/,/g, ''));
            const newDestBalance = destBalance + amountOut;

            // 3. Update User Doc
            transaction.update(userDocRef, {
                [sourceBalanceField]: newSourceBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                [destBalanceField]: newDestBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            });

            // 4. Record Debit Transaction (Source)
            const debitRef = doc(collection(db, 'users', userId, 'transactions'));
            transaction.set(debitRef, {
                amount: -amountIn,
                currency: fromCurrency,
                type: TransactionType.REMITTANCE,
                category: 'Transfer',
                merchant: `Remit to ${toCurrency}`,
                timestamp: Timestamp.now(),
                method: 'GIFT Wallet',
                metadata: { rate, fees, ...beneficiaryMetadata }
            });

            // 5. Record Credit Transaction (Destination)
            const creditRef = doc(collection(db, 'users', userId, 'transactions'));
            transaction.set(creditRef, {
                amount: amountOut,
                currency: toCurrency,
                type: TransactionType.DEPOSIT,
                category: 'Income',
                merchant: `Remittance from ${fromCurrency}`,
                timestamp: Timestamp.now(),
                method: 'System Transfer',
                metadata: { rate, fees, sender: 'Self' }
            });
        });
    }
};
