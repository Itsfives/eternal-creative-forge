import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Minus, Edit } from 'lucide-react';
import { useProjectTeams, type ProjectTeamMember } from '@/hooks/useProjectTeams';
import ProjectRoleBadge from './ProjectRoleBadge';
import TeamMemberSelector from './TeamMemberSelector';

interface ProjectTeamManagerProps {
  projectId: string;
  projectName: string;
  onTeamUpdate?: () => void;
}

const ProjectTeamManager: React.FC<ProjectTeamManagerProps> = ({
  projectId,
  projectName,
  onTeamUpdate
}) => {
  const [teamMembers, setTeamMembers] = useState<ProjectTeamMember[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { 
    getProjectTeamMembers, 
    removeProjectMember, 
    assignProjectRole 
  } = useProjectTeams();

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const members = await getProjectTeamMembers(projectId);
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTeamMembers();
    }
  }, [projectId]);

  const handleRemoveMember = async (userId: string, role: 'owner' | 'project_manager' | 'developer') => {
    const success = await removeProjectMember(projectId, userId, role);
    if (success) {
      await fetchTeamMembers();
      onTeamUpdate?.();
    }
  };

  const handleAddMembers = async (newMembers: Array<{ user: any; role: 'owner' | 'project_manager' | 'developer' }>) => {
    for (const member of newMembers) {
      await assignProjectRole(projectId, member.user.user_id, member.role);
    }
    await fetchTeamMembers();
    onTeamUpdate?.();
    setIsOpen(false);
  };

  const getUniqueMembers = () => {
    const uniqueMembers = new Map();
    teamMembers.forEach(member => {
      const key = member.user_id;
      if (!uniqueMembers.has(key)) {
        uniqueMembers.set(key, {
          ...member,
          roles: [member.project_role]
        });
      } else {
        uniqueMembers.get(key).roles.push(member.project_role);
      }
    });
    return Array.from(uniqueMembers.values());
  };

  const getRoleStats = () => {
    const stats = {
      owner: 0,
      project_manager: 0,
      developer: 0,
      total: 0
    };

    teamMembers.forEach(member => {
      stats[member.project_role]++;
      stats.total++;
    });

    return stats;
  };

  const uniqueMembers = getUniqueMembers();
  const roleStats = getRoleStats();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Project Team
            <Badge variant="secondary" className="ml-2">
              {uniqueMembers.length} members
            </Badge>
          </CardTitle>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Manage Team
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Manage Team - {projectName}</DialogTitle>
              </DialogHeader>
              <TeamMemberSelector
                selectedMembers={[]}
                onMembersChange={handleAddMembers}
                excludeUserIds={teamMembers.map(m => m.user_id)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            Loading team members...
          </div>
        ) : uniqueMembers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No team members assigned</p>
            <p className="text-sm mb-4">Add team members to start collaborating on this project</p>
            <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Team Members
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Role Statistics */}
            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <ProjectRoleBadge role="owner" size="sm" />
                <span className="text-sm font-medium">{roleStats.owner}</span>
              </div>
              <div className="flex items-center gap-2">
                <ProjectRoleBadge role="project_manager" size="sm" />
                <span className="text-sm font-medium">{roleStats.project_manager}</span>
              </div>
              <div className="flex items-center gap-2">
                <ProjectRoleBadge role="developer" size="sm" />
                <span className="text-sm font-medium">{roleStats.developer}</span>
              </div>
            </div>

            {/* Team Members List */}
            <div className="space-y-3">
              {uniqueMembers.map((member) => (
                <div key={member.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback>
                        {(member.display_name || member.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.display_name || member.email}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                      <div className="flex gap-1 mt-1">
                        {member.roles.map((role: string) => (
                          <ProjectRoleBadge 
                            key={role} 
                            role={role as 'owner' | 'project_manager' | 'developer'} 
                            size="sm" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {member.roles.map((role: string) => (
                      <Button
                        key={role}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.user_id, role as any)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        title={`Remove ${role.replace('_', ' ')} role`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTeamManager;