
import Navigation from "../components/Navigation";
import TeamSection from "../components/TeamSection";
import AboutEditor from "../components/AboutEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, Award, Heart, Settings } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useState } from "react";

const About = () => {
  const [showEditor, setShowEditor] = useState(false);
  const { portfolios } = usePortfolio();
  const projectsCompleted = portfolios.filter(p => p.status === 'published').length;

  const services = [
    {
      icon: Target,
      title: "Graphic Design",
      description: "Creating stunning visual identities that capture your brand's essence and resonate with your audience."
    },
    {
      icon: Users,
      title: "Model Texturing",
      description: "Expert 3D texturing and material design for gaming and visualization projects."
    },
    {
      icon: Award,
      title: "Model Creation",
      description: "Professional 3D modeling services for various industries and applications."
    },
    {
      icon: Heart,
      title: "Videography & Photography",
      description: "Capturing compelling visual content that tells your story and engages your audience."
    }
  ];

  if (showEditor) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 p-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowEditor(false)}
              className="mb-4"
            >
              ← Back to About Page
            </Button>
          </div>
          <AboutEditor />
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Button 
                onClick={() => setShowEditor(true)}
                variant="outline"
                size="sm"
                className="hover:bg-seagram-green hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit About Page
              </Button>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent mb-6">
              About Eternals Studio
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We are a GFX, VFX, Coding, and Music Production Studio dedicated to delivering excellence and top-notch quality in every project we undertake.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  At Eternals Studio, we are dedicated to delivering excellence and top-notch quality in every project we undertake. We believe that graphics serve as the forefront for organizations and businesses, playing a crucial role in shaping their identity and presence in the market.
                </p>
                <p className="text-muted-foreground mb-4">
                  Intricate and well-crafted designs are essential for effectively pushing products and attracting consumer interest. Our team understands that compelling graphics are not just decorative; they create an imprint of a brand that resonates with the target audience.
                </p>
                <p className="text-muted-foreground">
                  By prioritizing quality and creativity in our designs, we strive to help our clients stand out and make a lasting impact in their respective industries. At Eternals Studio, we recognize that exceptional graphics are the key to success in today's competitive landscape.
                </p>
              </div>
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-2xl font-bold text-seagram-green mb-2">{projectsCompleted}+</h3>
                  <p className="text-muted-foreground">Projects Completed</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-2xl font-bold text-violet-purple mb-2">100%</h3>
                  <p className="text-muted-foreground">Client Satisfaction</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-2xl font-bold text-seagram-green mb-2">6</h3>
                  <p className="text-muted-foreground">Specializations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Expertise</h2>
              <p className="text-muted-foreground">Discover our expertise in graphic designing, model texturing, model creating, videography, and photography</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <service.icon className="w-12 h-12 mx-auto text-seagram-green mb-4" />
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <TeamSection />
      </div>
    </div>
  );
};

export default About;
