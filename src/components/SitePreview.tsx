import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Eye, Settings } from 'lucide-react';

const SitePreview = () => {
  const userTypes = [
    {
      type: 'guest',
      name: 'Public Visitors',
      description: 'Non-authenticated users visiting your website',
      icon: Eye,
      access: [
        'Home page with hero section and services',
        'Portfolio showcase (published projects only)',
        'About page and company information',
        'Contact form and business details',
        'Public blog posts and articles',
        'Basic site navigation'
      ],
      restrictions: [
        'Cannot access admin dashboard',
        'Cannot view CMS or edit content',
        'No client portal access',
        'Cannot see draft/private content',
        'No user management features'
      ]
    },
    {
      type: 'client',
      name: 'Authenticated Clients',
      description: 'Logged-in clients with project access',
      icon: Users,
      access: [
        'All public content (same as guests)',
        'Client portal dashboard',
        'Personal project galleries',
        'Private project files and assets',
        'Secure messaging with team',
        'Project status updates',
        'Invoice and billing information'
      ],
      restrictions: [
        'Cannot access admin dashboard',
        'Cannot edit website content',
        'Cannot manage other users',
        'Cannot access CMS features',
        'Limited to assigned projects only'
      ]
    },
    {
      type: 'cms_editor',
      name: 'Content Editors',
      description: 'Team members who can edit website content',
      icon: Settings,
      access: [
        'All client-level access',
        'CMS content management system',
        'Page editing and creation',
        'Portfolio project management',
        'Media library access',
        'SEO and metadata editing',
        'Content publishing controls'
      ],
      restrictions: [
        'Cannot access admin dashboard',
        'Cannot manage user roles',
        'Cannot access analytics',
        'Cannot modify system settings',
        'Limited user management'
      ]
    },
    {
      type: 'admin',
      name: 'System Administrators',
      description: 'Full access to all system features',
      icon: Shield,
      access: [
        'Complete website access',
        'Full CMS management',
        'Admin dashboard with analytics',
        'User role management',
        'System configuration',
        'Database and security settings',
        'Site deployment controls',
        'Full client portal oversight'
      ],
      restrictions: [
        'No restrictions - full system access'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Site Access Overview</h2>
        <p className="text-muted-foreground">
          Understanding what different user types can see and do on your website
        </p>
      </div>

      <Tabs defaultValue="guest" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {userTypes.map((userType) => {
            const Icon = userType.icon;
            return (
              <TabsTrigger key={userType.type} value={userType.type} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{userType.name.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {userTypes.map((userType) => {
          const Icon = userType.icon;
          return (
            <TabsContent key={userType.type} value={userType.type}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-seagram-green/10">
                      <Icon className="w-6 h-6 text-seagram-green" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{userType.name}</CardTitle>
                      <p className="text-muted-foreground">{userType.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-seagram-green mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        What They Can Access
                      </h4>
                      <ul className="space-y-2">
                        {userType.access.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Badge variant="secondary" className="mt-1 px-1 py-0 text-xs">✓</Badge>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Access Restrictions
                      </h4>
                      <ul className="space-y-2">
                        {userType.restrictions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-1 px-1 py-0 text-xs border-muted-foreground/20">✗</Badge>
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h5 className="font-medium mb-2">Live Site Experience</h5>
                    <p className="text-sm text-muted-foreground">
                      {userType.type === 'guest' && 
                        "When your site goes live, public visitors will see a polished website showcasing your services and portfolio. They can contact you but cannot access any private areas."
                      }
                      {userType.type === 'client' && 
                        "Clients will have secure login access to view their specific projects, communicate with your team, and track progress through a dedicated portal."
                      }
                      {userType.type === 'cms_editor' && 
                        "Content editors can efficiently update website content, manage portfolio projects, and maintain the site without accessing sensitive admin features."
                      }
                      {userType.type === 'admin' && 
                        "Administrators have complete control over the entire system, from content management to user roles and analytics, ensuring secure and efficient site operation."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default SitePreview;