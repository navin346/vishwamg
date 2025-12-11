
import { LedgerService, TransactionType } from '../ledger';

export interface FxQuote {
    id: string;
    fromCurrency: 'USD';
    toCurrency: 'INR';
    rate: number;
    fees: number;
    amountIn: number;
    amountOut: number;
    expiresAt: number;
    deliveryEstimate: string;
}

export interface Beneficiary {
    id?: string;
    name: string;
    accountNumber: string;
    ifsc: string;
    isSelf: boolean;
}

export const RemittanceService = {
    /**
     * Get a live FX quote.
     * In a real app, this calls Zynk/Wise API.
     */
    getFxQuote: async (amountUSD: number): Promise<FxQuote> => {
        // Mock API latency
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const rate = 84.50; // Mock Rate
        const fees = amountUSD * 0.01; // 1% Fee
        const amountOut = (amountUSD - fees) * rate;

        return {
            id: `qt_${Date.now()}`,
            fromCurrency: 'USD',
            toCurrency: 'INR',
            rate,
            fees,
            amountIn: amountUSD,
            amountOut: parseFloat(amountOut.toFixed(2)),
            expiresAt: Date.now() + 60000 * 5, // 5 mins validity
            deliveryEstimate: 'Instant'
        };
    },

    /**
     * Execute the remittance.
     * Debits USD and (simulated) Credits INR.
     */
    executeTransfer: async (userId: string, quote: FxQuote, beneficiary: Beneficiary) => {
        
        await LedgerService.recordCrossBorderTransaction({
            userId,
            fromCurrency: 'USD',
            toCurrency: 'INR',
            amountIn: quote.amountIn, // USD Debit amount (includes fees implicitly in balance check, but usually fees are deducted from send amount or added on top. Here we debit total amountIn)
            amountOut: quote.amountOut, // INR Credit amount
            rate: quote.rate,
            fees: quote.fees,
            description: `Remit to ${beneficiary.name}`,
            beneficiaryMetadata: beneficiary
        });
        
        return { success: true, txId: `tx_${Date.now()}` };
    }
};
