import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/lib/api";
import { Briefcase, Mail, Lock, User, Loader2 } from "lucide-react";
import axios from "axios";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "signin";
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/jobs");
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        API_ENDPOINTS.AUTH_LOGIN,
        {
          email,
          password,
        },
        {
          withCredentials: true
        }
      );

      const data = response.data;

      if (!response.status || !data.success) {
        throw new Error(data.message || "Failed to sign in");
      }

      // Check if email is verified
      if (!data.user.isVerified) {
        toast({
          title: "Email not verified",
          description: "Please verify your email before signing in.",
          variant: "destructive",
        });

        // Send OTP for verification
        const otpResponse = await axios.post(
          API_ENDPOINTS.AUTH_SEND_VERIFY_OTP,
          {},  // Empty body, auth via cookie
          {
            withCredentials: true
          }
        );

        if (otpResponse.status === 200) {
          navigate("/verify-otp", {
            state: {
              email,
              tempToken: data.tempToken,
            },
            replace: true,
          });
        }
        return;
      }

      // Store authentication token and user data
      if (data.token) {
        localStorage.setItem("rozgar_token", data.token);
      }
      if (data.user) {
        localStorage.setItem("rozgar_user", JSON.stringify(data.user));
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Update auth context
      await login(email, password);
      navigate("/jobs");
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Register user
      const registerResponse = await axios.post(
        API_ENDPOINTS.AUTH_REGISTER,
        {
          name,
          email,
          password,
          role,
        },
        {
          withCredentials: true
        }
      );

      const registerData = registerResponse.data;
      
      if (!registerResponse.status || !registerData.success) {
        throw new Error(registerData.message || "Failed to create account");
      }
      
      console.log("Registration successful:", registerData);
      
      // Step 2: Send OTP for verification (cookie is already set from registration)
      const otpResponse = await axios.post(
        API_ENDPOINTS.AUTH_SEND_VERIFY_OTP,
        {},  // Empty body, auth is via cookie
        {
          withCredentials: true  // Important: sends cookie with request
        }
      );
      
      const otpData = otpResponse.data;
      console.log("OTP response:", otpData);

      if (!otpResponse.status || !otpData.success) {
        throw new Error(otpData.message || "Failed to send verification code");
      }

      toast({
        title: "Account created!",
        description: "Please check your email for the verification code.",
      });

      // Navigate to OTP verification page
      navigate("/verify-otp", {
        state: {
          email,
          tempToken: registerData.tempToken,
        },
        replace: true,
      });
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Briefcase className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-foreground">Rozgar</span>
          </Link>
          <p className="text-muted-foreground">Connect with opportunities in your community</p>
        </div>

        <Card className="p-6 shadow-lg">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>I am a</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={role === "seeker" ? "default" : "outline"}
                      onClick={() => setRole("seeker")}
                      className="w-full"
                    >
                      Job Seeker
                    </Button>
                    <Button
                      type="button"
                      variant={role === "recruiter" ? "default" : "outline"}
                      onClick={() => setRole("recruiter")}
                      className="w-full"
                    >
                      Recruiter
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
