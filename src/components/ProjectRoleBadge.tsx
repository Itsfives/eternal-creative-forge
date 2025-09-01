import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Settings, Code } from 'lucide-react';

interface ProjectRoleBadgeProps {
  role: 'owner' | 'project_manager' | 'developer';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const ProjectRoleBadge: React.FC<ProjectRoleBadgeProps> = ({ 
  role, 
  size = 'md', 
  showIcon = true 
}) => {
  const roleConfig = {
    owner: {
      label: 'Owner',
      icon: Crown,
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
    },
    project_manager: {
      label: 'Project Manager',
      icon: Settings,
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
    },
    developer: {
      label: 'Developer',
      icon: Code,
      className: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      variant="secondary" 
      className={`${config.className} ${sizeClasses[size]} inline-flex items-center gap-1.5 font-medium border-0`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  );
};

export default ProjectRoleBadge;