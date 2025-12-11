
// This service simulates the interaction with a GIFT City IBU's Core Banking System (CBS)
// It replaces the previous lightweight Adapter pattern with a Bank-Grade service.

export interface BankAccountDetails {
    accountId: string;
    accountName: string;
    bankName: string;
    branchName: string;
    accountNumber: string;
    ifscCode: string; // GIFT City IBUs have IFSC codes
    swiftCode: string;
    currency: string;
    balance: number;
    status: 'ACTIVE' | 'FROZEN' | 'KYC_PENDING';
    routingNumber?: string; // For US correspondence
}

export const CoreBankingService = {
    /**
     * Creates a Foreign Currency Account (FCA) for the user in GIFT City.
     * In production, this hits the Bank's API to generate a real account.
     */
    createForeignCurrencyAccount: async (userId: string, currency: 'USD' | 'GBP' | 'EUR' = 'USD'): Promise<BankAccountDetails> => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            accountId: `act_${userId.substring(0, 8)}_${Date.now()}`,
            accountName: "Vishwam User Name", // In real app, fetch from KYC profile
            bankName: "HDFC Bank IBU", // Example Partner Bank
            branchName: "GIFT City IFSC Branch",
            accountNumber: "409000" + Math.floor(100000 + Math.random() * 900000), // Mock IBU account format
            ifscCode: "HDFC0000GFT", // Real IFSC format for GIFT City
            swiftCode: "HDFCINBBGFT",
            currency: currency,
            balance: 0.00,
            status: 'ACTIVE'
        };
    },

    /**
     * Fetches the current details of the user's GIFT City account.
     */
    getAccountDetails: async (userId: string): Promise<BankAccountDetails> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mocking a real bank account response
        return {
            accountId: `act_${userId.substring(0, 8)}`,
            accountName: "Vishwam FBO / J. Doe",
            bankName: "HDFC Bank IBU",
            branchName: "GIFT City IFSC Branch, Zone 1",
            accountNumber: "409000882190",
            ifscCode: "HDFC0000GFT",
            swiftCode: "HDFCINBBGFT",
            routingNumber: "026009593", // Chase NY (Correspondent)
            currency: "USD",
            balance: 1000.00, 
            status: 'ACTIVE'
        };
    }
};
