import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';

interface OTPScreenProps {
  onSuccess: () => void;
}

const OTPScreen: React.FC<OTPScreenProps> = ({ onSuccess }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState<string>('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    setError('');

    if (element.value !== '' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    const finalOtp = newOtp.join('');
    if (finalOtp.length === 6) {
      if (finalOtp === '123456') { // Mock OTP check
        onSuccess();
      } else {
        setError('Invalid code. Please try again.');
        setOtp(new Array(6).fill(''));
        inputsRef.current[0]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-near-black text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Enter Verification Code</h1>
        <p className="text-subtle mb-8">A 6-digit code was sent to your email.</p>

        <div className="flex justify-center gap-2 md:gap-3 mb-4" aria-label="One-time password input">
          {otp.map((data, index) => {
            return (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-surface border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                aria-label={`Digit ${index + 1} of OTP`}
              />
            );
          })}
        </div>
        
        {error && <p className="text-red-400 text-sm mt-4" role="alert">{error}</p>}
      </div>
    </div>
  );
};

export default OTPScreen;