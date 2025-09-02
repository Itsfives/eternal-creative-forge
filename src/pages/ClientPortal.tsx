
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, Download, MessageCircle, CreditCard, Calendar, AlertCircle, HelpCircle, Home, DollarSign, ShoppingBag, LogOut } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { DownloadCard } from "@/components/DownloadCard";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useClientProjects } from "@/hooks/useClientProjects";
import { useClientCommunications } from "@/hooks/useClientCommunications";
import CommunicationComposer from "@/components/CommunicationComposer";
import AccessControl from "@/components/AccessControl";
import ClientPortalDashboard from "@/components/ClientPortalDashboard";

const ClientPortal = () => {
  const { purchases, loading: storeLoading, incrementDownloadCount } = useStore();
  const { user } = useAuth();
  const { projects, loading: projectsLoading, getActiveProjects } = useClientProjects();
  const { communications, loading: communicationsLoading, getRecentCommunications, getUnreadCount, markAsRead, sendCommunication } = useClientCommunications();
  
  const handleSendCommunication = async (messageData: Parameters<typeof sendCommunication>[0]) => {
    await sendCommunication(messageData);
  };
  
  const activeProjects = getActiveProjects();
  const recentMessages = getRecentCommunications(3);
  const unreadCount = getUnreadCount();

  const [recentFiles] = useState([
    { name: "Project Proposal.pdf", date: "Dec 1, 2024", size: "2.4 MB", type: "document" },
    { name: "Design Mockups.zip", date: "Nov 28, 2024", size: "15.7 MB", type: "archive" },
    { name: "Requirements Document.docx", date: "Nov 25, 2024", size: "1.2 MB", type: "document" },
    { name: "Brand Guidelines.pdf", date: "Nov 20, 2024", size: "5.1 MB", type: "document" }
  ]);

  const [invoices] = useState([
    { id: "INV-001", amount: 2500, status: "Paid", date: "Nov 15, 2024", project: "Website Redesign" },
    { id: "INV-002", amount: 1200, status: "Pending", date: "Dec 1, 2024", project: "Mobile App Development" }
  ]);

  if (!user) {
    return (
      <AccessControl requireAuth={true}>
        <div className="min-h-screen bg-background pt-20">
          <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Access Required</h3>
                  <p className="text-muted-foreground mb-4">
                    Please log in to access your client portal.
                  </p>
                  <Link to="/auth">
                    <Button className="bg-seagram-green hover:bg-seagram-green/90">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AccessControl>
    );
  }

  return (
    <AccessControl requireAuth={true}>
      <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
                Welcome Back, {user?.email || 'Guest'}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your projects, access files, and stay connected with our team
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                Need Help?
              </Button>
              <Button variant="outline" size="sm" onClick={() => {/* logout logic */}}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Status Alert */}
        <div className="mb-6">
          <Card className="border-seagram-green/20 bg-seagram-green/5">
            <CardContent className="flex items-center space-x-3 p-4">
              <AlertCircle className="w-5 h-5 text-seagram-green" />
              <div>
                <p className="text-sm font-medium">Project Update Required</p>
                <p className="text-xs text-muted-foreground">Your feedback is needed on the latest design mockups</p>
              </div>
              <Button size="sm" className="ml-auto bg-seagram-green hover:bg-seagram-green/90">
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
          <ClientPortalDashboard />

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                  <CardDescription>Your active project status and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {projectsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="border rounded-lg p-4 animate-pulse">
                          <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                          <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                          <div className="h-2 bg-muted rounded mb-2" />
                          <div className="h-4 bg-muted rounded w-1/3" />
                        </div>
                      ))}
                    </div>
                  ) : activeProjects.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No active projects at the moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeProjects.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{project.name}</h4>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                            <Badge variant={project.status === "in-progress" ? "default" : "secondary"}>
                              {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} />
                          </div>
                          
                          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-1" />
                              Due {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBD'}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              {project.phase || 'Planning'}
                            </div>
                          </div>
                          
                          <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                            <p className="font-medium text-blue-900">Next: {project.next_milestone || 'To be determined'}</p>
                            <p className="text-blue-700">Team Lead: {project.team_lead || 'Assigned soon'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Communications</CardTitle>
                  <CardDescription>Latest updates from your project team</CardDescription>
                </CardHeader>
                <CardContent>
                  {communicationsLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-start space-x-3 p-3 border rounded-lg animate-pulse">
                          <div className="w-2 h-2 rounded-full mt-2 bg-muted" />
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                            <div className="h-3 bg-muted rounded w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent communications.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentMessages.map((message) => (
                        <div key={message.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${message.is_unread ? 'bg-seagram-green' : 'bg-muted'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">{message.from_name}</p>
                              <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                {new Date(message.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {message.subject && (
                              <p className="text-sm font-medium text-seagram-green">{message.subject}</p>
                            )}
                            <p className="text-sm text-muted-foreground">{message.message}</p>
                            {message.from_role && (
                              <p className="text-xs text-muted-foreground mt-1">{message.from_role}</p>
                            )}
                            {message.is_unread && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="mt-2"
                                onClick={() => markAsRead(message.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button className="w-full mt-4 bg-seagram-green hover:bg-seagram-green/90">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    View All Messages
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {projectsLoading ? (
              <div className="grid gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="h-2 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                        <div className="flex space-x-2">
                          <div className="h-9 bg-muted rounded w-24" />
                          <div className="h-9 bg-muted rounded w-32" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground">Your projects will appear here once they are created.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                        <Badge variant={project.status === "in-progress" ? "default" : "secondary"}>
                          {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            Due {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBD'}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-1" />
                            {project.phase || 'Planning'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">View Details</Button>
                          <Button size="sm" variant="outline">Download Files</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Files</CardTitle>
                <CardDescription>Access and download your project files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{file.date} • {file.size}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Your Downloads</h2>
                <p className="text-muted-foreground">Access your purchased digital products</p>
              </div>
              <Link to="/store">
                <Button className="bg-seagram-green hover:bg-seagram-green/90">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Visit Store
                </Button>
              </Link>
            </div>

            {storeLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-2 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                        <div className="h-9 bg-muted rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : purchases.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No downloads yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Visit our store to purchase digital products and templates
                  </p>
                  <Link to="/store">
                    <Button className="bg-seagram-green hover:bg-seagram-green/90">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Browse Store
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {purchases.map((purchase) => (
                  <DownloadCard
                    key={purchase.id}
                    purchase={purchase}
                    onDownload={async (purchaseData) => {
                      try {
                        await incrementDownloadCount(purchaseData.id);
                        // In a real implementation, this would trigger the actual file download
                        // For demo purposes, we'll just show a success message
                        const link = document.createElement('a');
                        link.href = purchaseData.store_products.file_url || '#';
                        link.download = purchaseData.store_products.file_name || 'download';
                        link.click();
                      } catch (error) {
                        console.error('Download failed:', error);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Communicate with your project team</CardDescription>
                  </div>
                  <CommunicationComposer
                    projects={projects.map(p => ({ id: p.id, name: p.name }))}
                    onSend={handleSendCommunication}
                    loading={communicationsLoading}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {communicationsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg animate-pulse">
                        <div className="w-3 h-3 rounded-full mt-2 bg-muted" />
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                          <div className="h-3 bg-muted rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : communications.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                    <p className="text-muted-foreground">Messages from your project team will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {communications.map((message) => (
                      <div key={message.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className={`w-3 h-3 rounded-full mt-2 ${message.is_unread ? 'bg-seagram-green' : 'bg-muted'}`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{message.from_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(message.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {message.subject && (
                            <p className="text-sm font-medium text-seagram-green mb-1">{message.subject}</p>
                          )}
                          <p className="text-muted-foreground mt-1">{message.message}</p>
                          {message.from_role && (
                            <p className="text-xs text-muted-foreground mt-2">{message.from_role}</p>
                          )}
                          {message.client_projects?.name && (
                            <p className="text-xs text-blue-600 mt-1">Project: {message.client_projects.name}</p>
                          )}
                          {message.is_unread && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => markAsRead(message.id)}
                            >
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoices & Billing</CardTitle>
                <CardDescription>View your invoices and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{invoice.id}</p>
                          <p className="text-sm text-muted-foreground">{invoice.project} • {invoice.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">${invoice.amount}</p>
                          <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>
                            {invoice.status}
                          </Badge>
                        </div>
                        {invoice.status === "Pending" && (
                          <div className="flex items-center space-x-2">
                            <Button size="sm" className="bg-seagram-green hover:bg-seagram-green/90">
                              <DollarSign className="w-4 h-4 mr-1" />
                              Pay Now
                            </Button>
                          </div>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Card className="mt-6 bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Methods</CardTitle>
                    <CardDescription>Choose your preferred payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-auto p-4 flex-col">
                        <CreditCard className="w-8 h-8 mb-2" />
                        <span className="text-sm">Credit/Debit</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex-col">
                        <DollarSign className="w-8 h-8 mb-2" />
                        <span className="text-sm">PayPal</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex-col">
                        <DollarSign className="w-8 h-8 mb-2" />
                        <span className="text-sm">Stripe</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex-col">
                        <DollarSign className="w-8 h-8 mb-2" />
                        <span className="text-sm">Venmo</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </AccessControl>
  );
};

export default ClientPortal;
