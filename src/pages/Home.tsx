import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Calendar, Activity } from 'lucide-react';

const Home = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back</p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-border/50 hover:bg-secondary/80"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Hello, {user.name}! 👋
          </h2>
          <p className="text-muted-foreground text-lg">
            You're successfully logged in and ready to go.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-card bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Session Status
                </CardTitle>
                <Activity className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">Active</div>
              <p className="text-sm text-muted-foreground mt-1">
                Your session is secure
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-to-br from-card to-accent/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Account
                </CardTitle>
                <User className="w-4 h-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">Verified</div>
              <p className="text-sm text-muted-foreground mt-1">
                {user.id}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-to-br from-card to-secondary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last Login
                </CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="border-0 shadow-medium bg-gradient-to-br from-card to-muted/10">
          <CardHeader>
            <CardTitle className="text-xl">Getting Started</CardTitle>
            <CardDescription>
              Your authentication system is working perfectly! Here are some next steps:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h3 className="font-semibold text-primary mb-2">🔐 Secure Session</h3>
                <p className="text-sm text-muted-foreground">
                  Your session token is safely stored and will persist across browser sessions.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                <h3 className="font-semibold text-accent mb-2">🚀 API Connected</h3>
                <p className="text-sm text-muted-foreground">
                  Your frontend is successfully communicating with your PHP backend.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-secondary/20 border border-border/20">
                <h3 className="font-semibold mb-2">🎨 Modern Design</h3>
                <p className="text-sm text-muted-foreground">
                  Clean, matte-finished UI with responsive design and smooth animations.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-secondary/20 border border-border/20">
                <h3 className="font-semibold mb-2">📱 Responsive</h3>
                <p className="text-sm text-muted-foreground">
                  Works beautifully on desktop, tablet, and mobile devices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Home;