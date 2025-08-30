import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { AppRole } from '@/hooks/useAuth';

interface UserWithRoles {
  id: string;
  email: string;
  display_name?: string;
  roles: AppRole[];
}

const RoleManager = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsersWithRoles = async () => {
    try {
      // Get all users from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name');

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get auth users (this will only work if you have admin access)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        // Fallback: just use profiles data
        const usersData = profiles?.map(profile => {
          const userRolesList = userRoles?.filter(ur => ur.user_id === profile.user_id).map(ur => ur.role) || [];
          return {
            id: profile.user_id,
            email: 'Hidden', // Can't access email without admin
            display_name: profile.display_name,
            roles: userRolesList as AppRole[]
          };
        }) || [];
        
        setUsers(usersData);
        return;
      }

      // Combine all data
      const usersData = authUsers.users.map(user => {
        const profile = profiles?.find(p => p.user_id === user.id);
        const userRolesList = userRoles?.filter(ur => ur.user_id === user.id).map(ur => ur.role) || [];
        
        return {
          id: user.id,
          email: user.email || 'No email',
          display_name: profile?.display_name,
          roles: userRolesList as AppRole[]
        };
      });

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast.success(`Role ${role} assigned successfully`);
      fetchUsersWithRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast.success(`Role ${role} removed successfully`);
      fetchUsersWithRoles();
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    }
  };

  useEffect(() => {
    fetchUsersWithRoles();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{user.display_name || 'No name'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    {user.roles.map(role => (
                      <Badge 
                        key={role} 
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeRole(user.id, role)}
                      >
                        {role} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select onValueChange={(role: AppRole) => assignRole(user.id, role)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Add role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="cms_editor">CMS Editor</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManager;