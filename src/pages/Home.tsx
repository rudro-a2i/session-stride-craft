import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Calendar, Activity, Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Article {
  title: string;
  body: string;
  date: string;
  time: string;
  posted_by: string;
}

const Home = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [newArticle, setNewArticle] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Fetch articles when user is loaded
  useEffect(() => {
    if (user && user.token) {
      fetchArticles();
    }
  }, [user]);

  const fetchArticles = async () => {
    if (!user?.token) return;
    
    try {
      const response = await fetch(`http://localhost/articles/getArticles?token=${user.token}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setArticles(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      });
    } finally {
      setArticlesLoading(false);
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token || !newArticle.title.trim() || !newArticle.body.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost/articles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newArticle.title,
          body: newArticle.body,
          token: user.token,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Article created successfully!",
        });
        setNewArticle({ title: '', body: '' });
        fetchArticles(); // Refresh articles
      } else {
        throw new Error('Failed to create article');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* Create New Article */}
        <Card className="border-0 shadow-medium bg-gradient-to-br from-card to-primary/5 mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Plus className="w-5 h-5 mr-2 text-primary" />
              Create New Article
            </CardTitle>
            <CardDescription>
              Share your thoughts and ideas with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter article title..."
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Content</Label>
                <Textarea
                  id="body"
                  placeholder="Write your article content here..."
                  value={newArticle.body}
                  onChange={(e) => setNewArticle({ ...newArticle, body: e.target.value })}
                  className="min-h-[120px]"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !newArticle.title.trim() || !newArticle.body.trim()}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Create Article
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Articles Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Articles</h2>
            <Button
              onClick={fetchArticles}
              variant="outline"
              size="sm"
              disabled={articlesLoading}
            >
              {articlesLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              ) : (
                <Activity className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-0 shadow-card">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 bg-muted/60 rounded animate-pulse w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted/40 rounded animate-pulse"></div>
                      <div className="h-3 bg-muted/40 rounded animate-pulse w-4/5"></div>
                      <div className="h-3 bg-muted/40 rounded animate-pulse w-3/5"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <Card className="border-0 shadow-card bg-gradient-to-br from-card to-muted/10">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
                <p className="text-muted-foreground text-center">
                  Be the first to share an article with the community!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <Card key={index} className="border-0 shadow-card bg-gradient-to-br from-card to-secondary/5 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      <User className="w-3 h-3 mr-1" />
                      {article.posted_by}
                      {article.date && (
                        <>
                          <Calendar className="w-3 h-3 ml-3 mr-1" />
                          {article.date} {article.time}
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {article.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;