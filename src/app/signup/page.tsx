// src/app/signup/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center py-12 min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center">
            <UserPlus className="mr-2 h-6 w-6 text-primary" /> Create Your SwiftBid Account
          </CardTitle>
          <CardDescription>Join SwiftBid to connect with homeowners or contractors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label>I am a...</Label>
            <RadioGroup defaultValue="client" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="role-client" />
                <Label htmlFor="role-client" className="font-normal">Homeowner (Client)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contractor" id="role-contractor" />
                <Label htmlFor="role-contractor" className="font-normal">Contractor</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit">
            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
