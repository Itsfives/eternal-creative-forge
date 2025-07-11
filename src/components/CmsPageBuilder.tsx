import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Eye, Settings, Layout, Type, Image, Video } from 'lucide-react';

interface PageData {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  status: 'draft' | 'published';
  template: 'default' | 'portfolio' | 'service' | 'contact';
}

const CmsPageBuilder = () => {
  const [pageData, setPageData] = useState<PageData>({
    title: '',
    slug: '',
    content: '',
    metaDescription: '',
    status: 'draft',
    template: 'default'
  });

  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    console.log('Saving page:', pageData);
    setIsDirty(false);
  };

  const handleInputChange = (field: keyof PageData, value: string) => {
    setPageData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Page Builder</h2>
          <p className="text-muted-foreground">Create and edit website pages</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={pageData.status === 'published' ? 'default' : 'secondary'}>
            {pageData.status}
          </Badge>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isDirty}
            className="bg-seagram-green hover:bg-seagram-green/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Page
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">
            <Type className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="w-4 h-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="media">
            <Image className="w-4 h-4 mr-2" />
            Media
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={pageData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter page title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={pageData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="page-url-slug"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Page Content</Label>
                <Textarea
                  id="content"
                  value={pageData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Enter page content..."
                  className="min-h-[300px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template">Page Template</Label>
                <Select value={pageData.template} onValueChange={(value) => handleInputChange('template', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Page</SelectItem>
                    <SelectItem value="portfolio">Portfolio Page</SelectItem>
                    <SelectItem value="service">Service Page</SelectItem>
                    <SelectItem value="contact">Contact Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="text-center p-4 bg-muted rounded cursor-pointer hover:bg-muted/80">
                  <Layout className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Header Section</p>
                </div>
                <div className="text-center p-4 bg-muted rounded cursor-pointer hover:bg-muted/80">
                  <Type className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Content Block</p>
                </div>
                <div className="text-center p-4 bg-muted rounded cursor-pointer hover:bg-muted/80">
                  <Image className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Image Gallery</p>
                </div>
                <div className="text-center p-4 bg-muted rounded cursor-pointer hover:bg-muted/80">
                  <Video className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Video Section</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-dashed border-2 border-muted-foreground/25 rounded-lg p-8 text-center">
                <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">Drag and drop images here</p>
                <Button variant="outline">Browse Files</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Publication Status</Label>
                <Select value={pageData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={pageData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  placeholder="Enter meta description for SEO..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CmsPageBuilder;