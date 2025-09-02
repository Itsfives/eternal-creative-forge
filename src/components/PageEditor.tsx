import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Save } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { usePages } from "@/hooks/usePages";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Page = Database['public']['Tables']['pages']['Row'];

interface PageEditorProps {
  pageId?: string;
  onBack: () => void;
}

const PageEditor = ({ pageId, onBack }: PageEditorProps) => {
  const [pageData, setPageData] = useState<Partial<Page>>({
    title: "",
    slug: "",
    content: "",
    meta_description: "",
    status: "draft",
    template: "default"
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!pageId && pageId !== "new");
  
  const { createPage, updatePage, pages } = usePages();
  const { toast } = useToast();

  // Load existing page data if editing
  useEffect(() => {
    if (pageId && pageId !== "new" && pages.length > 0) {
      const existingPage = pages.find(p => p.id === pageId);
      if (existingPage) {
        setPageData(existingPage);
      }
    }
  }, [pageId, pages]);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (!pageData.title || !pageData.slug) {
        toast({
          title: "Error",
          description: "Title and slug are required",
          variant: "destructive",
        });
        return;
      }

      if (isEditing && pageId && pageId !== "new") {
        await updatePage(pageId, {
          title: pageData.title,
          slug: pageData.slug,
          content: pageData.content || "",
          meta_description: pageData.meta_description,
          status: pageData.status,
          template: pageData.template,
        });
      } else {
        await createPage({
          title: pageData.title,
          slug: pageData.slug,
          content: pageData.content || "",
          meta_description: pageData.meta_description,
          status: pageData.status || "draft",
          template: pageData.template || "default",
        });
      }
      
      onBack();
    } catch (error) {
      console.error("Error saving page:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setPageData(prev => ({ 
      ...prev, 
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pages
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? `Edit ${pageData.title || "Page"}` : "Create New Page"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? "Update your page content and settings" : "Create a new page for your website"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={pageData.status === "published" ? "default" : "secondary"}>
              {pageData.status === "published" ? "Published" : "Draft"}
            </Badge>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="bg-seagram-green hover:bg-seagram-green/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : (isEditing ? "Update Page" : "Save Page")}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO Settings</TabsTrigger>
            <TabsTrigger value="settings">Page Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Page Content</h3>
                <p className="text-muted-foreground">Edit the main content of your page</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Title</label>
                  <Input
                    placeholder="Enter page title"
                    value={pageData.title || ""}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    placeholder="page-url-slug"
                    value={pageData.slug || ""}
                    onChange={(e) => setPageData(prev => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <RichTextEditor
                    content={pageData.content || ""}
                    onChange={(content) => setPageData(prev => ({ ...prev, content }))}
                    placeholder="Start writing your page content..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">SEO Settings</h3>
                <p className="text-muted-foreground">Optimize your page for search engines</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Description</label>
                  <Textarea
                    placeholder="Brief description for search engines (160 characters max)"
                    value={pageData.meta_description || ""}
                    onChange={(e) => setPageData(prev => ({ ...prev, meta_description: e.target.value }))}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(pageData.meta_description || "").length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Page Settings</h3>
                <p className="text-muted-foreground">Configure page properties</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={pageData.status || "draft"} onValueChange={(value) => setPageData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template</label>
                  <Select value={pageData.template || "default"} onValueChange={(value) => setPageData(prev => ({ ...prev, template: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="landing">Landing Page</SelectItem>
                      <SelectItem value="blog">Blog Post</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PageEditor;