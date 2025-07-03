
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, ArrowLeft, Settings } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

interface PageEditorProps {
  pageId?: string;
  onBack: () => void;
}

const PageEditor = ({ pageId, onBack }: PageEditorProps) => {
  const [pageData, setPageData] = useState({
    title: "Home Page",
    slug: "home",
    status: "Published",
    metaTitle: "Welcome to Eternals Studio",
    metaDescription: "Professional web development and design services",
    content: "Welcome to **Eternals Studio**! We create amazing websites and digital experiences.",
    heroTitle: "Welcome to Eternals Studio",
    heroSubtitle: "Professional web development and design services",
    heroButtonText: "Get Started",
    heroButtonLink: "/contact"
  });

  const handleSave = () => {
    console.log("Saving page:", pageData);
    // Here you would typically save to your backend
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pages
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{pageData.title}</h1>
            <p className="text-muted-foreground">Edit your page content and settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={pageData.status === "Published" ? "default" : "secondary"}>
            {pageData.status}
          </Badge>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>Edit the main content of your page</CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={pageData.content}
                onChange={(content) => setPageData({ ...pageData, content })}
                placeholder="Write your page content here..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Customize the hero section of your page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Hero Title</Label>
                <Input
                  id="hero-title"
                  value={pageData.heroTitle}
                  onChange={(e) => setPageData({ ...pageData, heroTitle: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                <Input
                  id="hero-subtitle"
                  value={pageData.heroSubtitle}
                  onChange={(e) => setPageData({ ...pageData, heroSubtitle: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hero-button-text">Button Text</Label>
                  <Input
                    id="hero-button-text"
                    value={pageData.heroButtonText}
                    onChange={(e) => setPageData({ ...pageData, heroButtonText: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="hero-button-link">Button Link</Label>
                  <Input
                    id="hero-button-link"
                    value={pageData.heroButtonLink}
                    onChange={(e) => setPageData({ ...pageData, heroButtonLink: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize your page for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={pageData.metaTitle}
                  onChange={(e) => setPageData({ ...pageData, metaTitle: e.target.value })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {pageData.metaTitle.length}/60 characters
                </p>
              </div>
              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <Input
                  id="meta-description"
                  value={pageData.metaDescription}
                  onChange={(e) => setPageData({ ...pageData, metaDescription: e.target.value })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {pageData.metaDescription.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
              <CardDescription>Configure page properties and visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="page-title">Page Title</Label>
                <Input
                  id="page-title"
                  value={pageData.title}
                  onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="page-slug">Page URL (Slug)</Label>
                <Input
                  id="page-slug"
                  value={pageData.slug}
                  onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your page will be available at: /pages/{pageData.slug}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageEditor;
