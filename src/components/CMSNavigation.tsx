import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Image, 
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Monitor,
  Palette,
  Globe,
  BarChart
} from "lucide-react";
import PageEditor from "@/components/PageEditor";
import PortfolioEditor from "@/components/PortfolioEditor";
import MediaLibrary from "@/components/MediaLibrary";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePages } from "@/hooks/usePages";
import { useMedia } from "@/hooks/useMedia";
import StoreManager from "@/components/StoreManager";
import OrderManager from "@/components/OrderManager";
import { format } from "date-fns";

interface CMSNavigationProps {
  onSelectSection: (section: string) => void;
  activeSection: string;
}

const CMSNavigation = ({ onSelectSection, activeSection }: CMSNavigationProps) => {
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [showPortfolioEditor, setShowPortfolioEditor] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { portfolios, loading: portfoliosLoading, deletePortfolio } = usePortfolio();
  const { pages, loading: pagesLoading, deletePage, publishPage, unpublishPage } = usePages();
  const { media, loading: mediaLoading, deleteFile } = useMedia();

  // Show editors when needed
  if (showPageEditor) {
    return (
      <PageEditor 
        pageId={selectedItemId} 
        onBack={() => {
          setShowPageEditor(false);
          setSelectedItemId(undefined);
        }} 
      />
    );
  }

  if (showPortfolioEditor) {
    return (
      <PortfolioEditor 
        projectId={selectedItemId} 
        onBack={() => {
          setShowPortfolioEditor(false);
          setSelectedItemId(undefined);
        }} 
      />
    );
  }

  const handleCreateNew = () => {
    if (activeSection === "portfolio") {
      setSelectedItemId("new");
      setShowPortfolioEditor(true);
    } else {
      setSelectedItemId("new");
      setShowPageEditor(true);
    }
  };

  const sections = [
    {
      id: "pages",
      title: "Pages",
      icon: FileText,
      description: "Manage website pages and content",
      count: pages.length
    },
    {
      id: "portfolio",
      title: "Portfolio",
      icon: Monitor,
      description: "Showcase projects and work",
      count: portfolios.length
    },
    {
      id: "media",
      title: "Media Library",
      icon: Image,
      description: "Upload and manage images and files",
      count: media.length
    },
    {
      id: "store",
      title: "Store Products",
      icon: Monitor,
      description: "Manage store products and inventory",
      count: 0
    },
    {
      id: "orders",
      title: "Orders",
      icon: Users,
      description: "Manage customer orders and purchases",
      count: 0
    },
    {
      id: "users",
      title: "Users",
      icon: Users,
      description: "Manage user accounts and permissions",
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
      id: "settings",
      title: "Site Settings",
      icon: Settings,
      description: "Configure site-wide options",
      count: 0
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart,
      description: "View site performance and metrics",
      count: 0
    },
    {
      id: "preview",
      title: "Preview Site",
      icon: Globe,
      description: "Preview your site before publishing",
      count: 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
            Content Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your website content, media, and settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateNew} className="bg-seagram-green hover:bg-seagram-green/90">
            <Plus className="w-4 h-4 mr-2" />
            {activeSection === "portfolio" ? "New Project" : "New Page"}
          </Button>
          <Button variant="outline">
            <Globe className="w-4 h-4 mr-2" />
            Preview Site
          </Button>
        </div>
      </div>

      {/* Navigation Grid */}
      {!activeSection || activeSection === "overview" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            
            return (
              <Card 
                key={section.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                onClick={() => onSelectSection(section.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className="w-8 h-8 text-seagram-green" />
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
      ) : (
        <div className="space-y-6">
          {/* Back to Overview */}
          <Button 
            variant="ghost" 
            onClick={() => onSelectSection("overview")}
            className="mb-4"
          >
            ← Back to Overview
          </Button>

          {/* Section Content */}
          <div className="min-h-[400px]">
            {activeSection === "pages" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search pages..." 
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {pagesLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading pages...</div>
                ) : (
                  <div className="grid gap-4">
                    {pages
                      .filter(page => page.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((page) => (
                      <Card key={page.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{page.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Updated {format(new Date(page.updated_at), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={page.status === "published" ? "default" : "secondary"}>
                                {page.status}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedItemId(page.id);
                                  setShowPageEditor(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => page.status === "published" 
                                  ? unpublishPage(page.id) 
                                  : publishPage(page.id)
                                }
                              >
                                {page.status === "published" ? "Unpublish" : "Publish"}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deletePage(page.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "portfolio" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search portfolio..." 
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {portfoliosLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading portfolios...</div>
                ) : (
                  <div className="grid gap-4">
                    {portfolios
                      .filter(portfolio => portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((portfolio) => (
                      <Card key={portfolio.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{portfolio.title}</h3>
                              <p className="text-sm text-muted-foreground">{portfolio.category}</p>
                              <p className="text-sm text-muted-foreground">
                                Updated {format(new Date(portfolio.updated_at), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={portfolio.status === "published" ? "default" : "secondary"}>
                                {portfolio.status}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedItemId(portfolio.id);
                                  setShowPortfolioEditor(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deletePortfolio(portfolio.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "media" && <MediaLibrary />}
            
            {activeSection === "store" && <StoreManager />}
            
            {activeSection === "orders" && <OrderManager />}

            {activeSection === "preview" && (
              <div className="text-center py-16">
                <Globe className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Site Preview</h3>
                <p className="text-muted-foreground mb-6">Preview how your site looks to visitors</p>
                <Button className="bg-seagram-green hover:bg-seagram-green/90">
                  Open Preview
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSNavigation;