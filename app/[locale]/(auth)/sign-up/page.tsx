"use client";

import { IconEye, IconEyeOff, IconLoader } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/onboarding",
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully");
          router.push("/verify-email?signup=true");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to create account");
          setIsLoading(false);
        },
      }
    );
  };



  return (
    <Card className="border-0 shadow-2xl bg-white">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold text-[#221E68]">
          Create an account
        </CardTitle>
        <CardDescription className="text-[#221E68]/70">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#221E68] font-medium">
              Name
            </Label>
            <Input
              autoComplete="name"
              className="h-11 bg-gray-50 border-gray-200 focus:border-[#F16529] focus:ring-[#F16529]/20 text-[#221E68]"
              disabled={isLoading}
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              type="text"
              value={name}
            />
          </div>
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
            <Label htmlFor="password" className="text-[#221E68] font-medium">
              Password
            </Label>
            <InputGroup>
              <InputGroupInput
                autoComplete="new-password"
                className="h-11 bg-gray-50 border-gray-200 focus:border-[#F16529] focus:ring-[#F16529]/20 text-[#221E68]"
                disabled={isLoading}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
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
                Creating account...
              </>
            ) : (
              <>
                Create account
                <IconArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-[#221E68]/70">
          Already have an account?{" "}
          <Link
            className="underline underline-offset-4 hover:opacity-80 font-medium text-[#F16529]"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
