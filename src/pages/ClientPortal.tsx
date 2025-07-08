import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, Download, MessageCircle, CreditCard, Calendar, AlertCircle, HelpCircle } from "lucide-react";

const ClientPortal = () => {
  const [activeProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      status: "In Progress", 
      progress: 65,
      deadline: "Dec 15, 2024",
      description: "Complete website overhaul with modern design",
      phase: "Design Review",
      nextMilestone: "Client feedback on mockups",
      teamLead: "Sarah Johnson"
    },
    {
      id: 2,
      name: "Mobile App Development",
      status: "Planning",
      progress: 25,
      deadline: "Jan 30, 2025", 
      description: "Native mobile application for iOS and Android",
      phase: "Requirements Gathering",
      nextMilestone: "Technical specification review",
      teamLead: "Mike Chen"
    }
  ]);

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

  const [messages] = useState([
    { id: 1, from: "Project Manager", message: "Latest design mockups are ready for review", time: "2 hours ago", unread: true },
    { id: 2, from: "Developer", message: "Technical questions about the contact form", time: "1 day ago", unread: false },
    { id: 3, from: "Designer", message: "Color scheme approved, moving to next phase", time: "3 days ago", unread: false }
  ]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
                Welcome Back, John!
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your projects, access files, and stay connected with our team
              </p>
            </div>
            <Button variant="outline" size="sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Need Help?
            </Button>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-seagram-green" />
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activeProjects.length}</div>
                  <p className="text-sm text-muted-foreground">Currently in progress</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-violet-purple" />
                    Available Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{recentFiles.length}</div>
                  <p className="text-sm text-muted-foreground">Ready for download</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-seagram-green" />
                    New Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{messages.filter(m => m.unread).length}</div>
                  <p className="text-sm text-muted-foreground">Unread messages</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-violet-purple" />
                    Outstanding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${invoices.filter(i => i.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0)}</div>
                  <p className="text-sm text-muted-foreground">Pending invoices</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                  <CardDescription>Your active project status and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeProjects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          </div>
                          <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                            {project.status}
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
                            Due {project.deadline}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {project.phase}
                          </div>
                        </div>
                        
                        <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                          <p className="font-medium text-blue-900">Next: {project.nextMilestone}</p>
                          <p className="text-blue-700">Team Lead: {project.teamLead}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Communications</CardTitle>
                  <CardDescription>Latest updates from your project team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {messages.slice(0, 3).map((message) => (
                      <div key={message.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${message.unread ? 'bg-seagram-green' : 'bg-muted'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{message.from}</p>
                            <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">{message.time}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{message.message}</p>
                          {message.unread && (
                            <Button size="sm" variant="outline" className="mt-2">
                              Reply
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-seagram-green hover:bg-seagram-green/90">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    View All Messages
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-6">
              {activeProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                        {project.status}
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
                          Due {project.deadline}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.phase}
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

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Communicate with your project team</CardDescription>
                  </div>
                  <Button className="bg-seagram-green hover:bg-seagram-green/90">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    New Message
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-2 ${message.unread ? 'bg-seagram-green' : 'bg-muted'}`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{message.from}</p>
                          <p className="text-sm text-muted-foreground">{message.time}</p>
                        </div>
                        <p className="text-muted-foreground mt-1">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientPortal;
