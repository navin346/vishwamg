
export const RazorpayService = {
  loadScript: () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  openPayment: async (
    amount: number, 
    description: string, 
    user: any, 
    onSuccess: (paymentId: string) => void, 
    onFailure: (error: any) => void
  ) => {
    const res = await RazorpayService.loadScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      onFailure('SDK Load Failed');
      return;
    }

    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Public Test Key for Demo
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      name: 'Vishwam Financial',
      description: description,
      image: 'https://cdn-icons-png.flaticon.com/512/2175/2175193.png',
      handler: function (response: any) {
        onSuccess(response.razorpay_payment_id);
      },
      prefill: {
        name: user?.displayName || 'Vishwam User',
        email: user?.email || 'user@vishwam.app',
        contact: user?.phoneNumber || ''
      },
      theme: {
        color: '#7c3aed' // Violet-600
      },
      modal: {
        ondismiss: function() {
            onFailure('Payment Cancelled');
        }
      }
    };

    try {
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
            onFailure(response.error);
        });
        paymentObject.open();
    } catch (e) {
        console.error("Razorpay Error:", e);
        onFailure(e);
    }
  }
};
