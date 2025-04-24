"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerificationCodeInput } from "@/components/verification-code-input";

import { useClerk } from "@clerk/nextjs";
import { ArrowLeft, Eye, EyeOff, Layers } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { client: clerk, setActive } = useClerk(); // Access Clerk client

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    setIsLoading(true);
    try {
      // Step 1: Create a sign-up attempt
      console.log("Creating sign-up attempt...", {
        email,
        password,
        firstName,
        lastName,
      });

      const signUpAttempt = await clerk.signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      setIsSubmitted(true);

      // Step 2: Prepare email verification
      await signUpAttempt.prepareEmailAddressVerification({
        strategy: "email_code", // Use email code for verification
      });

      toast.success("Please check your email for a verification code.");

      // Note: Sign-in is deferred until verification is complete
      // The user must submit the verification code on /verify-email
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        (error as any).errors?.[0]?.longMessage ||
        "Failed to create account. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await clerk.signUp.attemptEmailAddressVerification({
        code,
      });

      console.log("Verification attempt result:", code);

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        // Set the session as active
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const isVerifying = false; // Replace with actual verification state

  const handleResendCode = () => {
    console.log("Resend verification code");
    // Add logic to resend the verification code
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Layers className="h-6 w-6" />
          <span>RealTime Collab</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        {isSubmitted ? (
          // if verification code is sent show this
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Verify your email</CardTitle>
              <CardDescription>
                {`Enter the verification code sent to ${email || "your email"}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VerificationCodeInput
                length={6}
                onComplete={handleVerifyCode}
                isLoading={isVerifying}
                onResendCode={handleResendCode}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          //  before submitting the email for verification
          <div className="mx-auto grid w-full max-w-md gap-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Create an account</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your information to get started
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="John"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long and include
                  uppercase, lowercase, numbers, and special characters.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
