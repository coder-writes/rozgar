import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, BookOpen, Users, LogIn, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "./ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Rozgar</span>
          </Link>
          
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-8">
              <Link 
                to="/jobs" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/jobs') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Jobs
              </Link>
              <Link 
                to="/skills" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/skills') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Skills
              </Link>
              <Link 
                to="/community" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/community') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Users className="h-4 w-4" />
                Community
              </Link>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  
                  {/* Profile Completion Indicator */}
                  {profile && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Profile</span>
                          <span className="text-xs font-medium">{profile.profileCompletion}%</span>
                        </div>
                        <Progress value={profile.profileCompletion} className="h-1.5" />
                        {profile.profileCompletion < 100 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Complete your profile
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/jobs")}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Jobs</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/skills")}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Skills</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/community")}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Community</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?tab=signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
