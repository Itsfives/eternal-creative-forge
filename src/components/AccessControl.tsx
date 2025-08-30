import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AccessControlProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'cms_editor' | 'client';
  requireAuth?: boolean;
  fallbackPath?: string;
}

const AccessControl = ({ 
  children, 
  requiredRole, 
  requireAuth = false, 
  fallbackPath = '/auth' 
}: AccessControlProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const userRoles = user?.email?.includes("admin") ? ["admin", "cms_editor"] : ["client"];

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      navigate(fallbackPath);
      return;
    }

    if (requiredRole && !userRoles.includes(requiredRole)) {
      navigate('/');
      return;
    }
  }, [user, userRoles, requiredRole, requireAuth, navigate, fallbackPath, loading]);

  if (loading) return <div>Loading...</div>;
  if (requireAuth && !user) return null;
  if (requiredRole && !userRoles.includes(requiredRole)) return null;

  return <>{children}</>;
};

export default AccessControl;