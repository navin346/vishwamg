
// Interface for International Banking Unit (GIFT City) interactions

export interface VirtualAccountDetails {
    accountName: string;
    bankName: string;
    branch: string;
    accountNumber: string;
    swiftCode: string;
    iban: string;
    routingNumber?: string;
    address: string;
}

export interface IBUAdapter {
    createVirtualAccount(userId: string, kycLevel: string): Promise<VirtualAccountDetails>;
    getVirtualAccount(userId: string): Promise<VirtualAccountDetails>;
}

// Mock Implementation simulating a partner bank like JPMorgan or Yes Bank in GIFT City
export const MockIBUAdapter: IBUAdapter = {
    createVirtualAccount: async (userId: string) => {
        // In a real app, this calls the banking API
        return {
            accountName: `Vishwam FBO - ${userId.substring(0, 6)}`,
            bankName: "GIFT City Global Bank",
            branch: "IFSC Banking Unit, Zone 1",
            accountNumber: "8900 1234 5678",
            swiftCode: "GIFTINBBXXX",
            iban: "IN89 GIFT 0000 1234 5678",
            address: "Unit 404, GIFT City, Gandhinagar, Gujarat, India 382355"
        };
    },
    getVirtualAccount: async (userId: string) => {
        // Simulate fetch delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            accountName: "Vishwam FBO / John Doe",
            bankName: "GIFT City Global Bank",
            branch: "IFSC Banking Unit",
            accountNumber: "8900 4421 9988",
            swiftCode: "GIFTINBBXXX",
            iban: "IN89 GIFT 0000 4421 9988",
            address: "Unit 404, GIFT City, Gandhinagar, Gujarat, India"
        };
    }
};
