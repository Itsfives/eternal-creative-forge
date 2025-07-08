
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, User, Briefcase, Settings } from "lucide-react";

interface ClientSetupWizardProps {
  onClose: () => void;
}

const ClientSetupWizard = ({ onClose }: ClientSetupWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    projectDescription: "",
    budget: "",
    timeline: "",
    accessLevel: "client"
  });

  const steps = [
    { id: 1, title: "Basic Info", icon: User, description: "Client contact details" },
    { id: 2, title: "Project Details", icon: Briefcase, description: "Project information" },
    { id: 3, title: "Portal Setup", icon: Settings, description: "Access and permissions" }
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log("Creating client:", clientData);
    // Here you would save the client data
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">New Client Setup</CardTitle>
            <CardDescription>Step {currentStep} of 3: {steps[currentStep - 1].description}</CardDescription>
          </div>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>
        
        {/* Progress Indicators */}
        <div className="flex items-center space-x-2 mt-4">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isCompleted ? 'bg-seagram-green border-seagram-green text-white' :
                  isActive ? 'border-seagram-green text-seagram-green' :
                  'border-muted-foreground text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>
                <span className={`ml-2 text-sm ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
                {step.id < steps.length && <ArrowRight className="w-4 h-4 mx-3 text-muted-foreground" />}
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={clientData.name}
                  onChange={(e) => setClientData({...clientData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={clientData.company}
                  onChange={(e) => setClientData({...clientData, company: e.target.value})}
                  placeholder="Acme Corp"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={clientData.email}
                onChange={(e) => setClientData({...clientData, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={clientData.phone}
                onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectType">Project Type</Label>
              <Select value={clientData.projectType} onValueChange={(value) => setClientData({...clientData, projectType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website Design</SelectItem>
                  <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                  <SelectItem value="webapp">Web Application</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                  <SelectItem value="branding">Branding & Identity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={clientData.projectDescription}
                onChange={(e) => setClientData({...clientData, projectDescription: e.target.value})}
                placeholder="Describe the project goals and requirements..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={clientData.budget} onValueChange={(value) => setClientData({...clientData, budget: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-5k">Under $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="over-50k">Over $50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Select value={clientData.timeline} onValueChange={(value) => setClientData({...clientData, timeline: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="2-3-months">2-3 Months</SelectItem>
                    <SelectItem value="3-6-months">3-6 Months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="accessLevel">Portal Access Level</Label>
              <Select value={clientData.accessLevel} onValueChange={(value) => setClientData({...clientData, accessLevel: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client - Basic Access</SelectItem>
                  <SelectItem value="premium">Premium - Enhanced Features</SelectItem>
                  <SelectItem value="admin">Admin - Full Access</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                This determines what features the client can access in their portal
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Portal Features Included:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-seagram-green" />
                  <span className="text-sm">Project tracking and progress updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-seagram-green" />
                  <span className="text-sm">File sharing and downloads</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-seagram-green" />
                  <span className="text-sm">Direct messaging with team</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-seagram-green" />
                  <span className="text-sm">Invoice and billing management</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-1">Ready to Create Client Portal</h4>
              <p className="text-sm text-blue-700">
                The client will receive an email with login instructions once you complete this setup.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button 
              onClick={handleNext}
              className="bg-seagram-green hover:bg-seagram-green/90"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-seagram-green hover:bg-seagram-green/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Create Client Portal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientSetupWizard;
