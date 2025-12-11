
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
            // For SPEND, WITHDRAWAL, REMITTANCE, BILL_PAY, amount implies a debit if passed as positive?
            // Usually, inputs for debits are negative or handled by logic. 
            // Let's assume the 'amount' passed here is the absolute value and the type determines the sign.
            
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
    }
};
