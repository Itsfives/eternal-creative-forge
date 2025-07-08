
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight, Users, FileText, Settings } from "lucide-react";
import { useState } from "react";

const QuickStartGuide = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: "Set up your first client",
      description: "Add a new client to the system and create their portal access",
      icon: Users,
      action: "Go to Users Tab"
    },
    {
      id: 2,
      title: "Create website content",
      description: "Update your homepage and create essential pages using our visual editor",
      icon: FileText,
      action: "Open CMS"
    },
    {
      id: 3,
      title: "Configure site settings",
      description: "Set your site title, contact information, and branding preferences",
      icon: Settings,
      action: "Site Settings"
    }
  ];

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRight className="w-5 h-5 mr-2 text-seagram-green" />
          Quick Start Guide
        </CardTitle>
        <CardDescription>
          Get your admin dashboard set up in 3 easy steps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const StepIcon = step.icon;
          
          return (
            <div key={step.id} className="flex items-start space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <button
                onClick={() => toggleStep(step.id)}
                className="mt-1 flex-shrink-0"
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-seagram-green" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-1">
                  <StepIcon className="w-4 h-4 text-violet-purple" />
                  <h4 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {step.title}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                <Button size="sm" variant="outline" className="text-xs">
                  {step.action}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickStartGuide;
