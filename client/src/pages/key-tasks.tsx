import { useState } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  StarIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  CalendarIcon, 
  ThumbsUpIcon,
  ExternalLinkIcon,
  ClockIcon,
  StarsIcon,
  BookmarkIcon,
  Share2Icon,
  PenIcon,
  StarHalfIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import review platforms logos
import { SiGlassdoor, SiGoogle, SiIndeed, SiLinkedin } from "react-icons/si";

export default function KeyTasks() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  
  const platforms = [
    { 
      id: "glassdoor", 
      name: "Glassdoor", 
      icon: <SiGlassdoor className="h-5 w-5" />, 
      url: "https://www.glassdoor.co.in/",
      color: "text-teal-600",
      description: "Share insights about your work experience, salary and company culture"
    },
    { 
      id: "google", 
      name: "Google", 
      icon: <SiGoogle className="h-5 w-5" />, 
      url: "https://www.google.com/business/",
      color: "text-blue-600",
      description: "Review Wugweb on Google to help others find our business"
    },
    { 
      id: "indeed", 
      name: "Indeed", 
      icon: <SiIndeed className="h-5 w-5" />, 
      url: "https://www.indeed.co.in/",
      color: "text-blue-500",
      description: "Share your workplace experience to help job seekers"
    },
    { 
      id: "linkedin", 
      name: "LinkedIn", 
      icon: <SiLinkedin className="h-5 w-5" />, 
      url: "https://www.linkedin.com/",
      color: "text-blue-700",
      description: "Recommend Wugweb on your professional network"
    },
    { 
      id: "ambitionbox", 
      name: "AmbitionBox", 
      icon: <BookmarkIcon className="h-5 w-5" />, 
      url: "https://www.ambitionbox.com/",
      color: "text-purple-600",
      description: "Post an anonymous review about your job and company"
    }
  ];
  
  const pendingTasks = [
    {
      id: 1,
      title: "Review Wugweb on Glassdoor",
      description: "Share your experience working at Wugweb to help potential candidates",
      platform: "glassdoor",
      deadline: "2023-05-15",
      priority: "high",
      status: "pending"
    },
    {
      id: 2,
      title: "Rate our company on Google",
      description: "Help improve our online presence by providing a review on Google",
      platform: "google",
      deadline: "2023-05-20",
      priority: "medium",
      status: "pending"
    },
    {
      id: 3,
      title: "Recommend Wugweb on LinkedIn",
      description: "Share your professional experience with your network",
      platform: "linkedin",
      deadline: "2023-05-30",
      priority: "medium",
      status: "pending"
    }
  ];
  
  const completedTasks = [
    {
      id: 4,
      title: "Share your experience on Indeed",
      description: "Help job seekers make informed decisions",
      platform: "indeed",
      completedDate: "2023-04-10",
      rating: 4,
      status: "completed"
    },
    {
      id: 5,
      title: "Review on AmbitionBox",
      description: "Provide feedback about company culture and work environment",
      platform: "ambitionbox",
      completedDate: "2023-03-25",
      rating: 5,
      status: "completed"
    }
  ];
  
  const handleStartReview = (platform: string) => {
    setSelectedPlatform(platform);
    setShowTaskForm(true);
  };
  
  const handleCancelReview = () => {
    setShowTaskForm(false);
    setSelectedPlatform(null);
    setReviewText("");
    setRating(0);
  };
  
  const handleSubmitReview = () => {
    // In a real app, this would submit the review to backend
    alert("Thank you for your review! It has been submitted successfully.");
    handleCancelReview();
  };
  
  const renderStarRating = (count: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon 
            key={star}
            className={`h-5 w-5 ${star <= count ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };
  
  const getPlatformById = (platformId: string) => {
    return platforms.find(p => p.id === platformId) || platforms[0];
  };
  
  const renderTaskStatusBadge = (priority: string) => {
    switch(priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium Priority</Badge>;
      case "low":
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Layout title="Key Tasks">
      <div className="container mx-auto p-6">
        {!showTaskForm ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-primary" />
                    Pending Review Tasks
                  </CardTitle>
                  <CardDescription>
                    Help us improve by completing these important review tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircleIcon className="h-12 w-12 mx-auto text-green-500 mb-3" />
                      <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                      <p className="text-neutral-medium">You've completed all your review tasks</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingTasks.map(task => {
                        const platform = getPlatformById(task.platform);
                        return (
                          <Card key={task.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center">
                              <div className="md:flex-1 p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${platform.color.replace('text-', 'bg-').replace('-600', '-100').replace('-700', '-100')}`}>
                                      {platform.icon}
                                    </div>
                                    <div>
                                      <h3 className="font-medium">{task.title}</h3>
                                      <p className="text-sm text-neutral-medium">{task.description}</p>
                                    </div>
                                  </div>
                                  <div className="hidden md:block">
                                    {renderTaskStatusBadge(task.priority)}
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center justify-between mt-4">
                                  <div className="flex items-center text-sm text-neutral-medium">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    <span>Due by: {new Date(task.deadline).toLocaleDateString()}</span>
                                  </div>
                                  
                                  <div className="md:hidden mt-2 md:mt-0">
                                    {renderTaskStatusBadge(task.priority)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex bg-gray-50 p-4 border-t md:border-t-0 md:border-l">
                                <Button 
                                  className="flex-1"
                                  onClick={() => handleStartReview(task.platform)}
                                >
                                  Start Review
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ThumbsUpIcon className="h-5 w-5 mr-2 text-primary" />
                    Review Stats
                  </CardTitle>
                  <CardDescription>
                    Your contribution to company reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Completion Rate</span>
                        <span className="text-sm font-medium">
                          {Math.round((completedTasks.length / (completedTasks.length + pendingTasks.length)) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.round((completedTasks.length / (completedTasks.length + pendingTasks.length)) * 100)} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {completedTasks.length}
                          </div>
                          <p className="text-sm text-neutral-medium">Reviews Completed</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {pendingTasks.length}
                          </div>
                          <p className="text-sm text-neutral-medium">Pending Reviews</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Average Rating Given</h3>
                      <div className="flex items-center">
                        {renderStarRating(
                          completedTasks.reduce((sum, task) => sum + task.rating, 0) / 
                          (completedTasks.length || 1)
                        )}
                        <span className="ml-2 text-neutral-medium">
                          {(completedTasks.reduce((sum, task) => sum + task.rating, 0) / 
                            (completedTasks.length || 1)).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Review Platforms Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(completedTasks.map(task => task.platform))).map(platformId => {
                          const platform = getPlatformById(platformId);
                          return (
                            <Badge key={platformId} variant="secondary" className="flex items-center">
                              <span className={`mr-1 ${platform.color}`}>{platform.icon}</span>
                              {platform.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <StarsIcon className="h-5 w-5 mr-2 text-primary" />
                  Review Platforms
                </CardTitle>
                <CardDescription>
                  Choose a platform to share your experience at Wugweb
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {platforms.map((platform) => (
                    <Card key={platform.id} className="overflow-hidden">
                      <CardHeader className={`pb-2 ${platform.color.replace('text-', 'bg-').replace('-600', '-50').replace('-700', '-50')}`}>
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center ${platform.color}`}>
                            {platform.icon}
                            <span className="ml-2 font-medium">{platform.name}</span>
                          </div>
                          <a 
                            href={platform.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-neutral-medium hover:text-neutral-dark"
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </a>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 text-sm text-neutral-medium">
                        <p>{platform.description}</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => handleStartReview(platform.id)}
                        >
                          Write a Review
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {completedTasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2 text-primary" />
                    Completed Reviews
                  </CardTitle>
                  <CardDescription>
                    Thank you for sharing your feedback about Wugweb
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedTasks.map(task => {
                      const platform = getPlatformById(task.platform);
                      return (
                        <Card key={task.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row md:items-center">
                            <div className="md:flex-1 p-4">
                              <div className="flex items-start">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${platform.color.replace('text-', 'bg-').replace('-600', '-100').replace('-700', '-100')}`}>
                                  {platform.icon}
                                </div>
                                <div>
                                  <h3 className="font-medium">{task.title}</h3>
                                  <p className="text-sm text-neutral-medium">{task.description}</p>
                                  <div className="flex items-center mt-1">
                                    {renderStarRating(task.rating)}
                                    <span className="ml-2 text-sm text-neutral-medium">
                                      {new Date(task.completedDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenIcon className="h-5 w-5 mr-2 text-primary" />
                Write a Review
              </CardTitle>
              <CardDescription>
                Share your experience working at Wugweb on {getPlatformById(selectedPlatform || "").name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          star <= rating 
                            ? "bg-yellow-100 hover:bg-yellow-200" 
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={() => setRating(star)}
                      >
                        <StarIcon 
                          className={`h-6 w-6 ${
                            star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-lg font-medium">
                      {rating > 0 ? rating + "/5" : "Select a rating"}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <Textarea
                    placeholder="Share details of your experience at Wugweb..."
                    className="min-h-[150px]"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <p className="text-xs text-neutral-medium mt-2">
                    Your review will be posted on {getPlatformById(selectedPlatform || "").name} and may be visible to job seekers, clients, and other team members.
                  </p>
                </div>
                
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <AlertTitle className="text-blue-800 flex items-center">
                    <AlertCircleIcon className="h-4 w-4 mr-2" />
                    Review Guidelines
                  </AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                      <li>Be honest and constructive in your feedback</li>
                      <li>Focus on your personal experience and observations</li>
                      <li>Respect confidentiality and avoid sharing sensitive information</li>
                      <li>Provide balanced feedback highlighting both positives and areas for improvement</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCancelReview}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} disabled={rating === 0 || !reviewText.trim()}>
                Submit Review
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
}