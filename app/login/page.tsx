"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border p-6">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>

          <p className="text-sm text-muted-foreground">
            Sign in to your Adminova account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="mt-6 border-t pt-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              Demo accounts
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-auto flex-col items-start p-3"
                onClick={() => {
                  setEmail("admin@adminova.demo");
                  setPassword("adminova");
                }}
              >
                <span className="text-xs font-medium">Demo Admin</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Full access
                </span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-auto flex-col items-start p-3"
                onClick={() => {
                  setEmail("viewer@adminova.demo");
                  setPassword("adminova");
                }}
              >
                <span className="text-xs font-medium">Demo Viewer</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Read only
                </span>
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
