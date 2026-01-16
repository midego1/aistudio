"use client";

import { IconEye, IconEyeOff, IconLoader } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { IconArrowRight } from "@tabler/icons-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          toast.success("Signed in successfully");
          router.push(redirectTo);
        },
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            // Email not verified - verification email was resent automatically
            toast.error(
              "Please verify your email. We've sent a new verification link."
            );
            router.push("/verify-email");
          } else {
            toast.error(ctx.error.message || "Invalid email or password");
          }
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Card className="border-0 shadow-2xl bg-white">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold text-[#221E68]">
          Welcome back
        </CardTitle>
        <CardDescription className="text-[#221E68]/70">
          Enter your credentials to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#221E68] font-medium">
              Email
            </Label>
            <Input
              autoComplete="email"
              className="h-11 bg-gray-50 border-gray-200 focus:border-[#F16529] focus:ring-[#F16529]/20 text-[#221E68]"
              disabled={isLoading}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[#221E68] font-medium">
                Password
              </Label>
              <Link
                className="text-sm underline-offset-4 hover:underline text-[#221E68]/70 hover:text-[#221E68]"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <InputGroup>
              <InputGroupInput
                autoComplete="current-password"
                className="h-11 bg-gray-50 border-gray-200 focus:border-[#F16529] focus:ring-[#F16529]/20 text-[#221E68]"
                disabled={isLoading}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => setShowPassword(!showPassword)}
                  size="icon-xs"
                  className="text-[#221E68]/60 hover:text-[#221E68]"
                  type="button"
                >
                  {showPassword ? (
                    <IconEyeOff className="size-4" />
                  ) : (
                    <IconEye className="size-4" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <Button
            className="w-full h-11 text-base font-bold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-[#221E68] hover:bg-[#221E68]/90 text-white shadow-lg shadow-[#221E68]/20"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <IconLoader className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <IconArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-[#221E68]/70">
          Don&apos;t have an account?{" "}
          <Link
            className="underline underline-offset-4 hover:opacity-80 font-medium text-[#F16529]"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
