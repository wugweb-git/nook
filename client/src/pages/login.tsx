import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Mail, 
  UserCog, 
  User,
  LogIn,
  Lock,
  ArrowRight,
  MailCheck
} from "lucide-react";
import wugwebLogo from "../assets/nook.png";

// Import Modern UI Components
import { 
  ModernButton,
  ModernCard,
  IconContainer,
  Text,
  Section,
  PageTransition,
  StaggeredFadeIn,
  FadeIn
} from "@/components/ui/design-system";
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "@/components/ui/animated-tabs";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, register, isLoggingIn, isRegistering, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const { toast } = useToast();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  // Extended schema for login with remember me
  const extendedLoginSchema = loginSchema.extend({
    rememberMe: z.boolean().optional(),
  });

  // Registration schema
  const registerSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: "You must accept the terms and conditions",
    })
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const loginForm = useForm<z.infer<typeof extendedLoginSchema>>({
    resolver: zodResolver(extendedLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // Form for forgot password
  const forgotPasswordForm = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      })
    ),
    defaultValues: {
      email: "",
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof extendedLoginSchema>) => {
    setError(null);
    try {
      if (!values.email || !values.password) {
        throw new Error("Please enter both email and password");
      }
      await login({
        email: values.email,
        password: values.password,
      });
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setError(null);
    try {
      // Ensure passwords match (already validated by Zod, but double-check)
      if (values.password !== values.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Generate a username automatically from firstName and lastName
      const firstName = values.firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const lastName = values.lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const generatedUsername = `${firstName}.${lastName}.${randomDigits}`;

      // Call the register API with our userData including the auto-generated username
      await register({
        username: generatedUsername,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: "employee", // Default role for self-registration
      });
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleForgotPassword = async (values: { email: string }) => {
    // In a real application, this would trigger a password reset email
    toast({
      title: "Password Reset Email Sent",
      description: `If an account exists for ${values.email}, we've sent password reset instructions.`,
    });
    setIsForgotPasswordOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column - Dark Background with Brand Message */}
      <div className="md:w-1/2 bg-black text-white flex flex-col items-center justify-center p-8 md:p-16">
        <div className="max-w-md">
          <div className="mb-8">
            <img src={wugwebLogo} alt="NOCK - Powered by Wugweb" className="h-24 mb-12" />
            <h1 className="text-5xl font-bold mb-4">Design with us</h1>
            <p className="text-lg text-zinc-400 mb-12">
              Access to thousands of HR tools and templates
            </p>
          </div>

          {/* Modern Geometric Pattern */}
          <div className="relative h-64 w-full">
            <div className="absolute top-0 left-8 w-16 h-16 rounded-full border-2 border-yellow-500 animate-pulse"></div>
            <div className="absolute top-4 left-4 h-48 w-48">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path
                  d="M10,100 L100,10 L190,100 L100,190 Z"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  className="animate-draw"
                  strokeDasharray="600"
                  strokeDashoffset="600"
                  style={{
                    animation: "checkmark 3s ease-in-out forwards infinite"
                  }}
                />
                <path
                  d="M10,100 L190,100"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="180"
                  strokeDashoffset="180"
                  style={{
                    animation: "checkmark 3s ease-in-out forwards infinite 0.3s"
                  }}
                />
                <path
                  d="M100,10 L100,190"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="180"
                  strokeDashoffset="180"
                  style={{
                    animation: "checkmark 3s ease-in-out forwards infinite 0.6s"
                  }}
                />
              </svg>
            </div>
            <div className="absolute bottom-0 right-8 w-16 h-16 rounded-full border-2 border-yellow-500 animate-pulse"></div>
          </div>

          {/* Indicator Dots */}
          <div className="flex mt-12 space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Sign up now</h2>
          </div>

          <Tabs defaultValue="register" className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-lg mb-6">
              <TabsTrigger value="login" className="rounded-lg py-2">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg py-2">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="m-0">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-5" />
                            <Input placeholder="Your email address" {...field} className="pl-10 py-6 rounded-md" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-5" />
                            <Input type="password" placeholder="Password" {...field} className="pl-10 py-6 rounded-md" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rememberMe" 
                        checked={rememberMe} 
                        onCheckedChange={(checked) => {
                          setRememberMe(checked as boolean);
                          loginForm.setValue('rememberMe', checked as boolean);
                        }} 
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>

                    <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="h-auto p-0 text-sm">
                          Forgot password?
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reset Your Password</DialogTitle>
                          <DialogDescription>
                            Enter your email address and we'll send you a link to reset your password.
                          </DialogDescription>
                        </DialogHeader>

                        <Form {...forgotPasswordForm}>
                          <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                            <FormField
                              control={forgotPasswordForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="name@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <DialogFooter className="mt-4">
                              <Button variant="outline" type="button" onClick={() => setIsForgotPasswordOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Reset Link
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <ModernButton 
                    type="submit" 
                    className="w-full"
                    disabled={isLoggingIn}
                    variant="black"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    {isLoggingIn ? "Signing in..." : "Sign In"}
                  </ModernButton>

                  <div className="pt-4 text-center">
                    <p className="text-sm text-neutral-6">
                      Already have an account? <Link href="/auth" className="font-medium text-primary underline">Log in</Link>
                    </p>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register" className="m-0">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} className="py-6 rounded-md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} className="py-6 rounded-md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-5" />
                            <Input type="email" placeholder="Email address" {...field} className="pl-10 py-6 rounded-md" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Username is now auto-generated */}
                  <div className="mb-2 px-1">
                    <p className="text-sm text-neutral-500">
                      Your username will be automatically generated from your name
                    </p>
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-5" />
                            <Input type="password" placeholder="Create a password" {...field} className="pl-10 py-6 rounded-md" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} className="py-6 rounded-md" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            By creating an account, I agree to our <Link href="#" className="text-primary underline">Terms of use</Link> and <Link href="#" className="text-primary underline">Privacy Policy</Link>
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Marketing consent - removed as it's not required and was causing duplicate field issues */}
                  <div className="flex flex-row items-start space-x-3 space-y-0 py-2">
                    <Checkbox id="marketingConsent" />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="marketingConsent" className="text-sm font-normal">
                        By creating an account, I am also consenting to receive SMS messages and emails, including product news, feature updates, events, and marketing promotions.
                      </label>
                    </div>
                  </div>

                  <ModernButton 
                    type="submit" 
                    className="w-full"
                    disabled={isRegistering}
                    variant="black"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-white text-neutral-9 flex items-center justify-center font-bold">
                        {isRegistering ? <span className="animate-spin">↻</span> : "?"}
                      </div>
                      {isRegistering ? "Creating account..." : "Complete"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </ModernButton>

                  <div className="pt-4 text-center">
                    <p className="text-sm text-neutral-6">
                      Already have an account? <Link href="/auth" className="font-medium text-primary underline">Log in</Link>
                    </p>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}