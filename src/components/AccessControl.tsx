import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type AppRole } from '@/hooks/useAuth';

interface AccessControlProps {
  children: ReactNode;
  requiredRole?: AppRole | AppRole[];
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
  const { user, roles, loading, hasRole, hasAnyRole } = useAuth();
  
  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      navigate(fallbackPath);
      return;
    }

    if (requiredRole) {
      const hasRequiredRole = Array.isArray(requiredRole) 
        ? hasAnyRole(requiredRole)
        : hasRole(requiredRole);
        
      if (!hasRequiredRole) {
        navigate('/');
        return;
      }
    }
  }, [user, roles, requiredRole, requireAuth, navigate, fallbackPath, loading, hasRole, hasAnyRole]);

  if (loading) return <div className="flex items-center justify-center p-4">Loading...</div>;
  if (requireAuth && !user) return null;
  
  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? hasAnyRole(requiredRole)
      : hasRole(requiredRole);
      
    if (!hasRequiredRole) return null;
  }

  return <>{children}</>;
};

export default AccessControl;