"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music } from "lucide-react";

export function LoginForm() {
  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <Music className="h-12 w-12 text-green-500" />
        </div>
        <CardTitle className="text-2xl font-bold">Spotify Dashboard</CardTitle>
        <CardDescription className="text-zinc-400">
          Connect your Spotify account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="space-y-2 text-center text-sm text-zinc-400">
          <p>
            This app requires access to your Spotify account to display your
            music data.
          </p>
          <p>
            We only read your data and don't modify anything in your account.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
          onClick={() => signIn("spotify", { callbackUrl: "/" })}
        >
          Connect with Spotify
        </Button>
      </CardFooter>
    </Card>
  );
}
