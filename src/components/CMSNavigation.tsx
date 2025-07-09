import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Settings, 
  Users, 
  BarChart3, 
  Image, 
  Palette, 
  Globe,
  Plus,
  Edit,
  Eye,
  Trash2,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import PageEditor from "./PageEditor";

interface CMSNavigationProps {
  onSelectSection: (section: string) => void;
  activeSection: string;
}

const CMSNavigation = ({ onSelectSection, activeSection }: CMSNavigationProps) => {
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const pages = [
    { id: "home", title: "Home Page", status: "Published", lastModified: "2 hours ago" },
    { id: "about", title: "About Us", status: "Draft", lastModified: "1 day ago" },
    { id: "services", title: "Services", status: "Published", lastModified: "3 days ago" },
    { id: "portfolio", title: "Portfolio", status: "Published", lastModified: "1 week ago" },
    { id: "contact", title: "Contact", status: "Published", lastModified: "2 weeks ago" },
    { id: "blog", title: "Blog", status: "Draft", lastModified: "3 weeks ago" }
  ];

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditPage = (pageId: string) => {
    setSelectedPageId(pageId);
    setShowPageEditor(true);
  };

  if (showPageEditor) {
    return (
      <PageEditor 
        pageId={selectedPageId} 
        onBack={() => setShowPageEditor(false)} 
      />
    );
  }

  const sections = [
    {
      id: "pages",
      title: "Pages",
      icon: FileText,
      description: "Manage website pages and content",
      count: pages.length
    },
    {
      id: "media",
      title: "Media Library",
      icon: Image,
      description: "Upload and manage images, videos, and files",
      count: 0
    },
    {
      id: "design",
      title: "Design System",
      icon: Palette,
      description: "Customize colors, fonts, and styling",
      count: 0
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      description: "View site performance and user analytics",
      count: 0
    },
    {
      id: "settings",
      title: "Site Settings",
      icon: Settings,
      description: "Configure site-wide settings and SEO",
      count: 0
    },
    {
      id: "users",
      title: "Users & Permissions",
      icon: Users,
      description: "Manage user accounts and access levels",
      count: 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">Manage your website content and settings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleEditPage("new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
          <Button variant="outline">
            <Globe className="w-4 h-4 mr-2" />
            Preview Site
          </Button>
        </div>
      </div>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Card 
              key={section.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isActive ? 'ring-2 ring-seagram-green bg-seagram-green/5' : ''
              }`}
              onClick={() => onSelectSection(section.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`w-8 h-8 ${isActive ? 'text-seagram-green' : 'text-muted-foreground'}`} />
                  {section.count > 0 && (
                    <Badge variant="secondary">{section.count}</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription className="text-sm">
                  {section.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Pages Quick View */}
      {activeSection === "pages" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Pages</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search pages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPages.map((page) => (
                <div 
                  key={page.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{page.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Last modified {page.lastModified}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={page.status === "Published" ? "default" : "secondary"}
                      className={page.status === "Published" ? "bg-seagram-green hover:bg-seagram-green/90" : ""}
                    >
                      {page.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditPage(page.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CMSNavigation;