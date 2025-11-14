import React, { useState, useRef } from 'react';

interface OTPScreenProps {
  onSuccess: () => void;
}

const OTPScreen: React.FC<OTPScreenProps> = ({ onSuccess }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length === 6) {
        // In a real app, you'd verify the code. Here we just succeed.
        onSuccess();
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold mb-2">Enter OTP</h1>
        <p className="text-neutral-400 mb-8">A 6-digit code was sent to your email.</p>

        <div className="flex justify-center gap-2 mb-8">
          {otp.map((data, index) => (
            <input
              // FIX: The ref callback function should not return a value.
              // The original implicit return of the assignment was causing a type error.
              // Wrapping the statement in curly braces fixes this by ensuring a void return.
              ref={(el) => { inputRefs.current[index] = el; }}
              key={index}
              type="text"
              maxLength={1}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-input"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default OTPScreen;