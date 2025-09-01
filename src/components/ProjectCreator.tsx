import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Plus, Users, FolderPlus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import TeamMemberSelector from './TeamMemberSelector';
import { useProjectTeams, type UserProfile } from '@/hooks/useProjectTeams';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  user: UserProfile;
  role: 'owner' | 'project_manager' | 'developer';
}

interface ProjectData {
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: Date;
  budget?: number;
  phase?: string;
  next_milestone?: string;
  team_lead?: string;
  client_company?: string;
}

interface ProjectCreatorProps {
  onProjectCreated?: (projectId: string) => void;
  children?: React.ReactNode;
}

const ProjectCreator: React.FC<ProjectCreatorProps> = ({ 
  onProjectCreated, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    deadline: undefined,
    budget: undefined,
    phase: '',
    next_milestone: '',
    team_lead: '',
    client_company: ''
  });

  const { assignProjectRole } = useProjectTeams();
  const { toast } = useToast();

  const handleInputChange = (field: keyof ProjectData, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateProjectData = (): boolean => {
    if (!projectData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleCreateProject = async () => {
    if (!validateProjectData()) return;

    setIsSubmitting(true);
    try {
      // Create the project first
      const { data: project, error: projectError } = await supabase
        .from('client_projects')
        .insert({
          name: projectData.name,
          description: projectData.description || null,
          status: projectData.status,
          priority: projectData.priority,
          deadline: projectData.deadline?.toISOString().split('T')[0] || null,
          budget: projectData.budget || null,
          phase: projectData.phase || null,
          next_milestone: projectData.next_milestone || null,
          team_lead: projectData.team_lead || null,
          client_company: projectData.client_company || null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Assign team members to the project
      if (teamMembers.length > 0) {
        const assignmentPromises = teamMembers.map(member =>
          assignProjectRole(project.id, member.user.user_id, member.role)
        );
        
        await Promise.all(assignmentPromises);
      }

      toast({
        title: "Project Created",
        description: `Project "${projectData.name}" has been created successfully with ${teamMembers.length} team members.`,
      });

      // Reset form
      setProjectData({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        deadline: undefined,
        budget: undefined,
        phase: '',
        next_milestone: '',
        team_lead: '',
        client_company: ''
      });
      setTeamMembers([]);
      setActiveTab('details');
      setIsOpen(false);

      onProjectCreated?.(project.id);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error creating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToTeam = () => {
    return projectData.name.trim() !== '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4" />
            Create Project
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderPlus className="h-5 w-5" />
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FolderPlus className="h-4 w-4" />
              Project Details
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              disabled={!canProceedToTeam()}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Team Assignment
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              disabled={!canProceedToTeam()}
              className="flex items-center gap-2"
            >
              Review & Create
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name *</Label>
                    <Input
                      id="name"
                      value={projectData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter project name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client_company">Client Company</Label>
                    <Input
                      id="client_company"
                      value={projectData.client_company}
                      onChange={(e) => handleInputChange('client_company', e.target.value)}
                      placeholder="Client company name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={projectData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the project goals and requirements"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={projectData.status} 
                      onValueChange={(value: any) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-md">
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={projectData.priority} 
                      onValueChange={(value: any) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-md">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !projectData.deadline && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {projectData.deadline ? format(projectData.deadline, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background border shadow-md">
                        <Calendar
                          mode="single"
                          selected={projectData.deadline}
                          onSelect={(date) => handleInputChange('deadline', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={projectData.budget || ''}
                      onChange={(e) => handleInputChange('budget', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Project budget"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team_lead">Team Lead</Label>
                    <Input
                      id="team_lead"
                      value={projectData.team_lead}
                      onChange={(e) => handleInputChange('team_lead', e.target.value)}
                      placeholder="Team lead name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phase">Current Phase</Label>
                    <Input
                      id="phase"
                      value={projectData.phase}
                      onChange={(e) => handleInputChange('phase', e.target.value)}
                      placeholder="e.g., Discovery, Development, Testing"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="next_milestone">Next Milestone</Label>
                    <Input
                      id="next_milestone"
                      value={projectData.next_milestone}
                      onChange={(e) => handleInputChange('next_milestone', e.target.value)}
                      placeholder="Next major milestone"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setActiveTab('team')}
                    disabled={!canProceedToTeam()}
                  >
                    Continue to Team Assignment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <TeamMemberSelector
              selectedMembers={teamMembers}
              onMembersChange={setTeamMembers}
            />
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setActiveTab('details')}>
                Back to Details
              </Button>
              <Button onClick={() => setActiveTab('review')}>
                Review Project
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="review" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {projectData.name}</div>
                      <div><strong>Status:</strong> {projectData.status}</div>
                      <div><strong>Priority:</strong> {projectData.priority}</div>
                      {projectData.client_company && <div><strong>Client:</strong> {projectData.client_company}</div>}
                      {projectData.deadline && <div><strong>Deadline:</strong> {format(projectData.deadline, "PPP")}</div>}
                      {projectData.budget && <div><strong>Budget:</strong> ${projectData.budget.toLocaleString()}</div>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Team Members ({teamMembers.length})</h4>
                    <div className="space-y-2">
                      {teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span>{member.user.display_name || member.user.email}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="capitalize">{member.role.replace('_', ' ')}</span>
                        </div>
                      ))}
                      {teamMembers.length === 0 && (
                        <div className="text-muted-foreground text-sm">No team members assigned</div>
                      )}
                    </div>
                  </div>
                </div>

                {projectData.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{projectData.description}</p>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setActiveTab('team')}>
                    Back to Team
                  </Button>
                  <Button 
                    onClick={handleCreateProject}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Project'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreator;