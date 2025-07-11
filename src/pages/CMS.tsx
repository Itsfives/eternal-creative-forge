
import { useState } from "react";
import { Save, Home, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CMSNavigation from "@/components/CMSNavigation";
import { useAnalytics } from "@/hooks/useAnalytics";

const CMS = () => {
  const [isDirty, setIsDirty] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const { trackInteraction, trackBusinessEvent } = useAnalytics();

  const handleSave = () => {
    trackBusinessEvent('cms_save', 'content_management');
    setIsDirty(false);
    // Add actual save logic here
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    trackInteraction('cms_navigation', `${section}_selected`);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
                Content Management System
              </h1>
              <p className="text-muted-foreground mt-2">
                Streamlined content management for your website
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button 
                className="bg-seagram-green hover:bg-seagram-green/90" 
                disabled={!isDirty}
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <CMSNavigation 
          onSelectSection={handleSectionChange}
          activeSection={activeSection}
        />
      </div>
    </div>
  );
};

export default CMS;
