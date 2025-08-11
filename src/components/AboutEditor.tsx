import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  skills: string[];
}

interface AboutContent {
  heroTitle: string;
  heroDescription: string;
  missionTitle: string;
  missionContent: string[];
  stats: {
    projectsCompleted: number;
    clientSatisfaction: number;
    specializations: number;
  };
  teamMembers: TeamMember[];
}

const AboutEditor = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    heroTitle: "About Eternals Studio",
    heroDescription: "We are a GFX, VFX, Coding, and Music Production Studio dedicated to delivering excellence and top-notch quality in every project we undertake.",
    missionTitle: "Our Mission",
    missionContent: [
      "At Eternals Studio, we are dedicated to delivering excellence and top-notch quality in every project we undertake. We believe that graphics serve as the forefront for organizations and businesses, playing a crucial role in shaping their identity and presence in the market.",
      "Intricate and well-crafted designs are essential for effectively pushing products and attracting consumer interest. Our team understands that compelling graphics are not just decorative; they create an imprint of a brand that resonates with the target audience.",
      "By prioritizing quality and creativity in our designs, we strive to help our clients stand out and make a lasting impact in their respective industries. At Eternals Studio, we recognize that exceptional graphics are the key to success in today's competitive landscape."
    ],
    stats: {
      projectsCompleted: 15,
      clientSatisfaction: 100,
      specializations: 6
    },
    teamMembers: [
      {
        id: "1",
        name: "Alex Johnson",
        role: "Creative Director",
        description: "Leading the creative vision with over 8 years of experience in graphic design and branding.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        skills: ["Graphic Design", "Branding", "Creative Direction"]
      },
      {
        id: "2", 
        name: "Sarah Chen",
        role: "3D Artist",
        description: "Specializing in 3D modeling and texturing with expertise in game asset creation.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b45628c1?w=400&h=400&fit=crop&crop=face",
        skills: ["3D Modeling", "Texturing", "Game Assets"]
      }
    ]
  });

  const handleSave = () => {
    toast({
      title: "Success",
      description: "About page content updated successfully",
    });
    setIsEditing(false);
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "New Team Member",
      role: "Role",
      description: "Description",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
      skills: []
    };
    setAboutContent(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newMember]
    }));
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setAboutContent(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === id ? { ...member, ...updates } : member
      )
    }));
  };

  const removeTeamMember = (id: string) => {
    setAboutContent(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }));
  };

  if (!isEditing) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>About Page Management</CardTitle>
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Content
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage your About page content, team members, and statistics. Click "Edit Content" to make changes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit About Page</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hero Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hero Section</h3>
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Title</Label>
              <Input
                id="heroTitle"
                value={aboutContent.heroTitle}
                onChange={(e) => setAboutContent(prev => ({ ...prev, heroTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroDescription">Description</Label>
              <Textarea
                id="heroDescription"
                value={aboutContent.heroDescription}
                onChange={(e) => setAboutContent(prev => ({ ...prev, heroDescription: e.target.value }))}
              />
            </div>
          </div>

          {/* Mission Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mission Section</h3>
            <div className="space-y-2">
              <Label htmlFor="missionTitle">Mission Title</Label>
              <Input
                id="missionTitle"
                value={aboutContent.missionTitle}
                onChange={(e) => setAboutContent(prev => ({ ...prev, missionTitle: e.target.value }))}
              />
            </div>
            {aboutContent.missionContent.map((paragraph, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`mission-${index}`}>Paragraph {index + 1}</Label>
                <Textarea
                  id={`mission-${index}`}
                  value={paragraph}
                  onChange={(e) => {
                    const newContent = [...aboutContent.missionContent];
                    newContent[index] = e.target.value;
                    setAboutContent(prev => ({ ...prev, missionContent: newContent }));
                  }}
                />
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Statistics</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectsCompleted">Projects Completed</Label>
                <Input
                  id="projectsCompleted"
                  type="number"
                  value={aboutContent.stats.projectsCompleted}
                  onChange={(e) => setAboutContent(prev => ({
                    ...prev,
                    stats: { ...prev.stats, projectsCompleted: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSatisfaction">Client Satisfaction (%)</Label>
                <Input
                  id="clientSatisfaction"
                  type="number"
                  value={aboutContent.stats.clientSatisfaction}
                  onChange={(e) => setAboutContent(prev => ({
                    ...prev,
                    stats: { ...prev.stats, clientSatisfaction: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specializations">Specializations</Label>
                <Input
                  id="specializations"
                  type="number"
                  value={aboutContent.stats.specializations}
                  onChange={(e) => setAboutContent(prev => ({
                    ...prev,
                    stats: { ...prev.stats, specializations: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <Button onClick={addTeamMember} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
            <div className="space-y-4">
              {aboutContent.teamMembers.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={member.role}
                        onChange={(e) => updateTeamMember(member.id, { role: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Avatar URL</Label>
                      <Input
                        value={member.avatar}
                        onChange={(e) => updateTeamMember(member.id, { avatar: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Skills (comma separated)</Label>
                      <Input
                        value={member.skills.join(", ")}
                        onChange={(e) => updateTeamMember(member.id, { 
                          skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                        })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={member.description}
                        onChange={(e) => updateTeamMember(member.id, { description: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTeamMember(member.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove Member
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutEditor;