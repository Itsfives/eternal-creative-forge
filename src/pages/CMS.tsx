
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Save, Eye, Settings, FileText, Image, Palette, Users, Home, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import RichTextEditor from "@/components/RichTextEditor";

const CMS = () => {
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("pages");

  const [siteTitle, setSiteTitle] = useState("Eternals Studio");
  const [siteDescription, setSiteDescription] = useState("Your go-to web design agency");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#007BFF");
  const [secondaryColor, setSecondaryColor] = useState("#6C757D");
  const [homePageContent, setHomePageContent] = useState("");
  const [aboutUsContent, setAboutUsContent] = useState("");
  const [contactPageContent, setContactPageContent] = useState("");
  const [isHomePagePublished, setIsHomePagePublished] = useState(true);
  const [isAboutUsPublished, setIsAboutUsPublished] = useState(false);
  const [isContactPagePublished, setIsContactPagePublished] = useState(true);

  const handleSiteTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteTitle(e.target.value);
    setIsDirty(true);
  };

  const handleSiteDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSiteDescription(e.target.value);
    setIsDirty(true);
  };

  const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoUrl(e.target.value);
    setIsDirty(true);
  };

  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
    setIsDirty(true);
  };

  const handleSecondaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondaryColor(e.target.value);
    setIsDirty(true);
  };

  const handleHomePageContentChange = (content: string) => {
    setHomePageContent(content);
    setIsDirty(true);
  };

  const handleAboutUsContentChange = (content: string) => {
    setAboutUsContent(content);
    setIsDirty(true);
  };

  const handleContactPageContentChange = (content: string) => {
    setContactPageContent(content);
    setIsDirty(true);
  };

  const handleHomePagePublishToggle = () => {
    setIsHomePagePublished(!isHomePagePublished);
    setIsDirty(true);
  };

  const handleAboutUsPublishToggle = () => {
    setIsAboutUsPublished(!isAboutUsPublished);
    setIsDirty(true);
  };

  const handleContactPagePublishToggle = () => {
    setIsContactPagePublished(!isContactPagePublished);
    setIsDirty(true);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
                Content Management System
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your website content, pages, and settings
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
                <Globe className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button 
                className="bg-seagram-green hover:bg-seagram-green/90" 
                disabled={!isDirty}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pages" onClick={() => setActiveTab("pages")}>Pages</TabsTrigger>
            <TabsTrigger value="settings" onClick={() => setActiveTab("settings")}>Settings</TabsTrigger>
            <TabsTrigger value="users" onClick={() => setActiveTab("users")}>Users</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Home Page</CardTitle>
                  <CardDescription>Manage your home page content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RichTextEditor content={homePageContent} onChange={handleHomePageContentChange} />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="home-page-publish">Published</Label>
                    <Switch
                      id="home-page-publish"
                      checked={isHomePagePublished}
                      onCheckedChange={handleHomePagePublishToggle}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About Us Page</CardTitle>
                  <CardDescription>Manage your about us page content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RichTextEditor content={aboutUsContent} onChange={handleAboutUsContentChange} />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="about-us-publish">Published</Label>
                    <Switch
                      id="about-us-publish"
                      checked={isAboutUsPublished}
                      onCheckedChange={handleAboutUsPublishToggle}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Page</CardTitle>
                  <CardDescription>Manage your contact page content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RichTextEditor content={contactPageContent} onChange={handleContactPageContentChange} />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contact-page-publish">Published</Label>
                    <Switch
                      id="contact-page-publish"
                      checked={isContactPagePublished}
                      onCheckedChange={handleContactPagePublishToggle}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure your website settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input
                    type="text"
                    id="site-title"
                    value={siteTitle}
                    onChange={handleSiteTitleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea
                    id="site-description"
                    value={siteDescription}
                    onChange={handleSiteDescriptionChange}
                  />
                </div>
                <div>
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    type="text"
                    id="logo-url"
                    value={logoUrl}
                    onChange={handleLogoUrlChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <Input
                      type="color"
                      id="primary-color"
                      value={primaryColor}
                      onChange={handlePrimaryColorChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <Input
                      type="color"
                      id="secondary-color"
                      value={secondaryColor}
                      onChange={handleSecondaryColorChange}
                    />
                  </div>
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
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p>User management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CMS;
