
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Shield, BarChart3, Plus, UserPlus, HelpCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";
import AdminStats from "@/components/AdminStats";
import QuickStartGuide from "@/components/QuickStartGuide";
import ClientSetupWizard from "@/components/ClientSetupWizard";

const Admin = () => {
  const [showClientWizard, setShowClientWizard] = useState(false);
  
  const [users] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Client", status: "Active", joined: "Nov 15, 2024" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active", joined: "Oct 22, 2024" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Client", status: "Inactive", joined: "Sep 10, 2024" }
  ]);

  const [activities] = useState([
    { action: "User login", user: "John Doe", time: "2 minutes ago", type: "info" },
    { action: "Page published", user: "Jane Smith", time: "1 hour ago", type: "success" },
    { action: "Failed login attempt", user: "Unknown", time: "3 hours ago", type: "warning" },
    { action: "New user registered", user: "Mike Johnson", time: "1 day ago", type: "info" }
  ]);

  if (showClientWizard) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ClientSetupWizard onClose={() => setShowClientWizard(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitor your website performance and manage system operations
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
                Help Guide
              </Button>
              <Button 
                onClick={() => setShowClientWizard(true)}
                className="bg-seagram-green hover:bg-seagram-green/90"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                New Client Setup
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <AdminStats />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <QuickStartGuide />
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.slice(0, 4).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">by {activity.user}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Common administrative tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Button 
                    className="h-auto p-4 bg-seagram-green hover:bg-seagram-green/90 flex-col"
                    onClick={() => setShowClientWizard(true)}
                  >
                    <UserPlus className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Add New Client</span>
                    <span className="text-xs opacity-80">Set up client portal</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col">
                    <Settings className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Site Settings</span>
                    <span className="text-xs text-muted-foreground">Configure website</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">View Reports</span>
                    <span className="text-xs text-muted-foreground">Analytics & metrics</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col">
                    <Shield className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Security</span>
                    <span className="text-xs text-muted-foreground">Manage permissions</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <Button 
                    className="bg-seagram-green hover:bg-seagram-green/90"
                    onClick={() => setShowClientWizard(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="outline">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Activity Log</CardTitle>
                <CardDescription>Monitor all system and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">by {activity.user}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>Generate detailed analytics and performance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Track user engagement and behavior</p>
                      <Button variant="outline" className="w-full">Generate Report</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Monitor website performance metrics</p>
                      <Button variant="outline" className="w-full">View Metrics</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Security audit and threat reports</p>
                      <Button variant="outline" className="w-full">Security Report</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure system-wide settings and maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Configure authentication and security policies</p>
                      <Button variant="outline" className="w-full">Configure Security</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        General Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Manage general system preferences</p>
                      <Button variant="outline" className="w-full">System Settings</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
