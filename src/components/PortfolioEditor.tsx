import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Eye, Plus, X, Upload } from "lucide-react";

interface PortfolioEditorProps {
  projectId?: string;
  onBack: () => void;
}

const PortfolioEditor = ({ projectId, onBack }: PortfolioEditorProps) => {
  const [projectData, setProjectData] = useState({
    title: projectId === "new" ? "" : "Sample Project",
    slug: projectId === "new" ? "" : "sample-project",
    category: "web-development",
    status: "draft",
    featured: false,
    client: "",
    completedDate: new Date().toISOString().split('T')[0],
    description: "",
    technologies: [] as string[],
    images: [] as string[],
    liveUrl: "",
    githubUrl: "",
    testimonial: "",
    testimonialAuthor: "",
    challenges: "",
    solutions: "",
    results: ""
  });

  const [newTechnology, setNewTechnology] = useState("");
  const [newImage, setNewImage] = useState("");

  const categories = [
    { value: "web-development", label: "Web Development" },
    { value: "mobile-app", label: "Mobile App" },
    { value: "ui-ux-design", label: "UI/UX Design" },
    { value: "branding", label: "Branding" },
    { value: "e-commerce", label: "E-commerce" },
    { value: "consulting", label: "Consulting" }
  ];

  const addTechnology = () => {
    if (newTechnology.trim() && !projectData.technologies.includes(newTechnology.trim())) {
      setProjectData({
        ...projectData,
        technologies: [...projectData.technologies, newTechnology.trim()]
      });
      setNewTechnology("");
    }
  };

  const removeTechnology = (tech: string) => {
    setProjectData({
      ...projectData,
      technologies: projectData.technologies.filter(t => t !== tech)
    });
  };

  const addImage = () => {
    if (newImage.trim() && !projectData.images.includes(newImage.trim())) {
      setProjectData({
        ...projectData,
        images: [...projectData.images, newImage.trim()]
      });
      setNewImage("");
    }
  };

  const removeImage = (imageUrl: string) => {
    setProjectData({
      ...projectData,
      images: projectData.images.filter(img => img !== imageUrl)
    });
  };

  const handleSave = () => {
    console.log("Saving portfolio project:", projectData);
    // Add actual save logic here
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {projectId === "new" ? "Create New Portfolio Project" : "Edit Project"}
            </h1>
            <Badge variant={projectData.status === "published" ? "default" : "secondary"}>
              {projectData.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} className="bg-seagram-green hover:bg-seagram-green/90">
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="testimonial">Testimonial</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={projectData.title}
                    onChange={(e) => setProjectData({...projectData, title: e.target.value})}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={projectData.slug}
                    onChange={(e) => setProjectData({...projectData, slug: e.target.value})}
                    placeholder="project-url-slug"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={projectData.category} 
                    onValueChange={(value) => setProjectData({...projectData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    value={projectData.client}
                    onChange={(e) => setProjectData({...projectData, client: e.target.value})}
                    placeholder="Client or company name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                  placeholder="Brief description of the project"
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input
                    id="liveUrl"
                    value={projectData.liveUrl}
                    onChange={(e) => setProjectData({...projectData, liveUrl: e.target.value})}
                    placeholder="https://project-live-url.com"
                  />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={projectData.githubUrl}
                    onChange={(e) => setProjectData({...projectData, githubUrl: e.target.value})}
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
                <Button onClick={addImage}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {projectData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Project image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(image)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {projectData.images.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No images added yet. Add some project images to showcase your work.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technologies Used</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add technology (e.g., React, Node.js)"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                />
                <Button onClick={addTechnology}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {projectData.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-auto p-0 w-4 h-4"
                      onClick={() => removeTechnology(tech)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="challenges">Challenges</Label>
                <Textarea
                  id="challenges"
                  value={projectData.challenges}
                  onChange={(e) => setProjectData({...projectData, challenges: e.target.value})}
                  placeholder="What challenges did you face during this project?"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="solutions">Solutions</Label>
                <Textarea
                  id="solutions"
                  value={projectData.solutions}
                  onChange={(e) => setProjectData({...projectData, solutions: e.target.value})}
                  placeholder="How did you solve the challenges?"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="results">Results & Impact</Label>
                <Textarea
                  id="results"
                  value={projectData.results}
                  onChange={(e) => setProjectData({...projectData, results: e.target.value})}
                  placeholder="What was the outcome and impact of the project?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Testimonial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testimonial">Testimonial</Label>
                <Textarea
                  id="testimonial"
                  value={projectData.testimonial}
                  onChange={(e) => setProjectData({...projectData, testimonial: e.target.value})}
                  placeholder="What did the client say about your work?"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="testimonialAuthor">Testimonial Author</Label>
                <Input
                  id="testimonialAuthor"
                  value={projectData.testimonialAuthor}
                  onChange={(e) => setProjectData({...projectData, testimonialAuthor: e.target.value})}
                  placeholder="Client name and title (e.g., John Doe, CEO at Company)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Project Status</Label>
                <Select 
                  value={projectData.status} 
                  onValueChange={(value) => setProjectData({...projectData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="completedDate">Completion Date</Label>
                <Input
                  id="completedDate"
                  type="date"
                  value={projectData.completedDate}
                  onChange={(e) => setProjectData({...projectData, completedDate: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={projectData.featured}
                  onCheckedChange={(checked) => setProjectData({...projectData, featured: checked})}
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioEditor;