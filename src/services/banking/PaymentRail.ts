
// Interface for Domestic Payment Rails (UPI, IMPS, NEFT) via partners like Setu/Razorpay

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: 'INR';
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    upiLink?: string;
}

export interface PaymentRail {
    createPaymentIntent(amount: number, description: string): Promise<PaymentIntent>;
    verifyPayment(intentId: string): Promise<boolean>;
}

export const MockPaymentRail: PaymentRail = {
    createPaymentIntent: async (amount: number, description: string) => {
        return {
            id: `pay_${Date.now()}`,
            amount,
            currency: 'INR',
            status: 'PENDING',
            upiLink: `upi://pay?pa=vishwam@bank&pn=Vishwam&am=${amount}&tn=${encodeURIComponent(description)}`
        };
    },
    verifyPayment: async (intentId: string) => {
        return true;
    }
};
