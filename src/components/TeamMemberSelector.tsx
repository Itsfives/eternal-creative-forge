import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Search, Plus } from 'lucide-react';
import { useProjectTeams, type UserProfile } from '@/hooks/useProjectTeams';
import ProjectRoleBadge from './ProjectRoleBadge';

interface TeamMember {
  user: UserProfile;
  role: 'owner' | 'project_manager' | 'developer';
}

interface TeamMemberSelectorProps {
  selectedMembers: TeamMember[];
  onMembersChange: (members: TeamMember[]) => void;
  excludeUserIds?: string[];
}

const TeamMemberSelector: React.FC<TeamMemberSelectorProps> = ({
  selectedMembers,
  onMembersChange,
  excludeUserIds = []
}) => {
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'owner' | 'project_manager' | 'developer'>('developer');
  const { getAllUsers, loading } = useProjectTeams();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setAvailableUsers(users);
    };
    fetchUsers();
  }, [getAllUsers]);

  const filteredUsers = availableUsers.filter(user => {
    const isAlreadySelected = selectedMembers.some(member => member.user.user_id === user.user_id);
    const isExcluded = excludeUserIds.includes(user.user_id);
    const matchesSearch = !searchTerm || 
      (user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return !isAlreadySelected && !isExcluded && matchesSearch;
  });

  const handleAddMember = () => {
    if (!selectedUserId) return;

    const user = availableUsers.find(u => u.user_id === selectedUserId);
    if (!user) return;

    // Check if role is already taken for unique roles
    if (['owner', 'project_manager'].includes(selectedRole)) {
      const roleExists = selectedMembers.some(member => member.role === selectedRole);
      if (roleExists) {
        // Remove existing member with this role
        const updatedMembers = selectedMembers.filter(member => member.role !== selectedRole);
        onMembersChange([...updatedMembers, { user, role: selectedRole }]);
      } else {
        onMembersChange([...selectedMembers, { user, role: selectedRole }]);
      }
    } else {
      onMembersChange([...selectedMembers, { user, role: selectedRole }]);
    }

    setSelectedUserId('');
    setSelectedRole('developer');
  };

  const handleRemoveMember = (userId: string) => {
    onMembersChange(selectedMembers.filter(member => member.user.user_id !== userId));
  };

  const getRoleCount = (role: 'owner' | 'project_manager' | 'developer') => {
    return selectedMembers.filter(member => member.role === role).length;
  };

  return (
    <div className="space-y-6">
      {/* Add Team Member Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Team Member
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-users">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-users"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="select-user">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="select-user">
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-md max-h-48 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {(user.display_name || user.email).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.display_name || user.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="select-role">Project Role</Label>
              <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                <SelectTrigger id="select-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-md">
                  <SelectItem value="owner">
                    <div className="flex items-center gap-2">
                      <ProjectRoleBadge role="owner" size="sm" />
                      {getRoleCount('owner') > 0 && <Badge variant="outline" className="text-xs">Will Replace</Badge>}
                    </div>
                  </SelectItem>
                  <SelectItem value="project_manager">
                    <div className="flex items-center gap-2">
                      <ProjectRoleBadge role="project_manager" size="sm" />
                      {getRoleCount('project_manager') > 0 && <Badge variant="outline" className="text-xs">Will Replace</Badge>}
                    </div>
                  </SelectItem>
                  <SelectItem value="developer">
                    <div className="flex items-center gap-2">
                      <ProjectRoleBadge role="developer" size="sm" />
                      {getRoleCount('developer') > 0 && <Badge variant="outline" className="text-xs">{getRoleCount('developer')} assigned</Badge>}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleAddMember} 
            disabled={!selectedUserId || loading}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </CardContent>
      </Card>

      {/* Selected Team Members */}
      {selectedMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Members ({selectedMembers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {selectedMembers.map((member) => (
                <div 
                  key={`${member.user.user_id}-${member.role}`}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.user.avatar_url} />
                      <AvatarFallback>
                        {(member.user.display_name || member.user.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.user.display_name || member.user.email}</div>
                      <div className="text-sm text-muted-foreground">{member.user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ProjectRoleBadge role={member.role} size="sm" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.user.user_id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
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

export default TeamMemberSelector;