import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
  
  // Mock user data - replace with actual auth when implemented
  const user = null; // Will be replaced with actual auth
  const userRoles: string[] = []; // Will be replaced with actual roles

  useEffect(() => {
    if (requireAuth && !user) {
      navigate(fallbackPath);
      return;
    }

    if (requiredRole && !userRoles.includes(requiredRole)) {
      navigate('/');
      return;
    }
  }, [user, userRoles, requiredRole, requireAuth, navigate, fallbackPath]);

  // Show loading or redirect if access denied
  if (requireAuth && !user) return null;
  if (requiredRole && !userRoles.includes(requiredRole)) return null;

  return <>{children}</>;
};

export default AccessControl;