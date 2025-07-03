
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Search, Filter, FileImage, Upload } from "lucide-react";
import PageEditor from "@/components/PageEditor";

const CMS = () => {
  const [currentView, setCurrentView] = useState<'list' | 'edit'>('list');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  
  const [pages] = useState([
    { id: 1, title: "Home Page", status: "Published", lastModified: "Dec 2, 2024", author: "Admin" },
    { id: 2, title: "About Us", status: "Draft", lastModified: "Dec 1, 2024", author: "Editor" },
    { id: 3, title: "Services", status: "Published", lastModified: "Nov 30, 2024", author: "Admin" },
    { id: 4, title: "Contact", status: "Published", lastModified: "Nov 28, 2024", author: "Admin" }
  ]);

  const [posts] = useState([
    { id: 1, title: "Latest Web Design Trends", status: "Published", category: "Design", date: "Dec 1, 2024" },
    { id: 2, title: "Mobile-First Development", status: "Draft", category: "Development", date: "Nov 29, 2024" },
    { id: 3, title: "SEO Best Practices", status: "Published", category: "Marketing", date: "Nov 25, 2024" }
  ]);

  const [mediaFiles] = useState([
    { id: 1, name: "hero-image.jpg", type: "image", size: "2.4 MB", uploaded: "Dec 1, 2024" },
    { id: 2, name: "logo.png", type: "image", size: "156 KB", uploaded: "Nov 28, 2024" },
    { id: 3, name: "portfolio-1.jpg", type: "image", size: "1.8 MB", uploaded: "Nov 25, 2024" },
    { id: 4, name: "team-photo.jpg", type: "image", size: "3.2 MB", uploaded: "Nov 20, 2024" }
  ]);

  const handleEditPage = (pageId: string) => {
    setEditingPageId(pageId);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingPageId(null);
  };

  if (currentView === 'edit') {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageEditor pageId={editingPageId} onBack={handleBackToList} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
              Content Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your website content, pages, and blog posts with ease
            </p>
          </div>
          <Button className="bg-seagram-green hover:bg-seagram-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>

        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Website Pages</CardTitle>
                    <CardDescription>Edit your website pages with our visual editor</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{page.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Last modified {page.lastModified} by {page.author}
                          </p>
                        </div>
                        <Badge variant={page.status === "Published" ? "default" : "secondary"}>
                          {page.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditPage(page.id.toString())}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>Create and manage your blog content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {post.category} • {post.date}
                          </p>
                        </div>
                        <Badge variant={post.status === "Published" ? "default" : "secondary"}>
                          {post.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Media Library</CardTitle>
                    <CardDescription>Upload and manage your images and files</CardDescription>
                  </div>
                  <Button className="bg-seagram-green hover:bg-seagram-green/90">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mediaFiles.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center h-24 bg-muted rounded mb-2">
                        <FileImage className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h4 className="font-medium text-sm truncate">{file.name}</h4>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                      <p className="text-xs text-muted-foreground">{file.uploaded}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure your website settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input id="site-title" defaultValue="Eternals Studio" />
                  </div>
                  <div>
                    <Label htmlFor="site-description">Site Description</Label>
                    <Textarea id="site-description" defaultValue="Professional web development and design services" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" type="email" defaultValue="contact@eternalsstudio.com" />
                  </div>
                  <div>
                    <Label htmlFor="site-logo">Site Logo URL</Label>
                    <Input id="site-logo" defaultValue="/logo.png" />
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CMS;
