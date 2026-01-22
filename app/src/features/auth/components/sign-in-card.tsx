"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Loader2, TriangleAlert, ArrowLeft, Mail, Lock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card";

export const SignInCard = () => {
  const [loading, setLoading] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const params = useSearchParams();
  const error = params.get("error");

  const onCredentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setLoadingLogin(true);

    signIn("credentials", {
      email: email,
      password: password,
      callbackUrl: "/dashboard",
    }).finally(() => {
      setLoading(false);
      setLoadingLogin(false);
    });
  };

  const onProviderSignIn = (provider: "github" | "google") => {
    setLoading(true);
    setLoadingGithub(provider === "github");
    setLoadingGoogle(provider === "google");

    signIn(provider, { callbackUrl: "/dashboard" }).finally(() => {
      setLoading(false);
      setLoadingGithub(false);
      setLoadingGoogle(false);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <Card className="w-full h-full p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-md dark:bg-black/90 dark:border-white/10">
        <div className="mb-6 flex flex-col items-center">
          <div className="bg-gradient-to-tr from-sky-400 to-blue-600 p-3 rounded-2xl shadow-lg mb-4">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} className="invert brightness-0" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Enter your credentials to access your account
          </p>
        </div>

        <CardContent className="space-y-6 px-0 pb-0">
          {!!error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/15 p-3 rounded-lg flex items-center gap-x-2 text-sm text-destructive"
            >
              <TriangleAlert className="size-4" />
              <p>Invalid email or password</p>
            </motion.div>
          )}

          <form onSubmit={onCredentialSignIn} className="space-y-4">
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  type="email"
                  disabled={loading}
                  required
                  className="pl-10 h-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-sky-500 transition-all hover:bg-background/80"
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  disabled={loading}
                  required
                  className="pl-10 h-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-sky-500 transition-all hover:bg-background/80"
                />
              </div>
            </div>
            <Button
              className="w-full h-10 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02]"
              type="submit"
              disabled={loading}
            >
              {loadingLogin ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground uppercase">Or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => onProviderSignIn("google")}
              variant="outline"
              className="w-full h-10 border-muted-foreground/20 hover:bg-muted/50 transition-all hover:scale-[1.02]"
              disabled={loading}
            >
              {loadingGoogle ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FcGoogle className="size-5" />
              )}
            </Button>
            <Button
              onClick={() => onProviderSignIn("github")}
              variant="outline"
              disabled={loading}
              className="w-full h-10 border-muted-foreground/20 hover:bg-muted/50 transition-all hover:scale-[1.02]"
            >
              {loadingGithub ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FaGithub className="size-5" />
              )}
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" onClick={() => setLoading(true)}>
                <span className="text-sky-600 font-medium hover:underline hover:text-sky-700 transition-colors">Create one now</span>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-all hover:-translate-x-1"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
};
