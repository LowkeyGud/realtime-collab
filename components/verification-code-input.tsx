"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface VerificationCodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  isLoading?: boolean;
  onResendCode?: () => void;
}

export function VerificationCodeInput({
  length = 6,
  onComplete,
  isLoading = false,
  onResendCode,
}: VerificationCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Handle countdown for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendCountdown, resendDisabled]);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    // Take only the last character if multiple are pasted
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if code is complete
    if (newCode.every((c) => c) && newCode.join("").length === length) {
      onComplete(newCode.join(""));
    }
  };

  // Handle key down
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted data is a valid numeric code of correct length
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < Math.min(length, pastedData.length); i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // Focus last filled input or the next empty one
    const lastFilledIndex = Math.min(length - 1, pastedData.length - 1);
    inputRefs.current[lastFilledIndex]?.focus();

    // Check if code is complete
    if (newCode.every((c) => c) && newCode.join("").length === length) {
      onComplete(newCode.join(""));
    }
  };

  // Handle resend code
  const handleResendCode = () => {
    if (onResendCode && !resendDisabled) {
      onResendCode();
      setResendDisabled(true);
      setResendCountdown(60); // 60 second cooldown

      toast.success("A new verification code has been sent to your email");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="verification-code">Verification Code</Label>
        <div className="flex justify-center gap-2">
          {Array.from({ length }).map((_, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el) as any}
              id={index === 0 ? "verification-code" : undefined}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              className="w-12 h-12 text-center text-lg"
              value={code[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isLoading}
              aria-label={`Digit ${index + 1} of verification code`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Enter the {length}-digit code sent to your email
        </p>
      </div>

      {onResendCode && (
        <div className="text-center">
          <Button
            variant="link"
            size="sm"
            onClick={handleResendCode}
            disabled={resendDisabled || isLoading}
          >
            {resendDisabled
              ? `Resend code in ${resendCountdown}s`
              : "Didn't receive a code? Resend"}
          </Button>
        </div>
      )}
    </div>
  );
}
