
import Navigation from "../components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Mission Driven",
      description: "We're committed to delivering exceptional digital solutions that drive real business results."
    },
    {
      icon: Users,
      title: "Client Focused",
      description: "Your success is our success. We build lasting partnerships with every client we serve."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from code quality to customer service."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We love what we do, and it shows in the quality and creativity of our work."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Creative Director",
      expertise: ["UI/UX Design", "Brand Strategy", "Creative Direction"]
    },
    {
      name: "Mike Chen",
      role: "Lead Developer",
      expertise: ["Full-Stack Development", "Cloud Architecture", "DevOps"]
    },
    {
      name: "Emily Rodriguez",
      role: "Project Manager",
      expertise: ["Agile Methodology", "Client Relations", "Strategic Planning"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent mb-6">
              About Eternals Studio
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We're a passionate team of digital creators, developers, and strategists dedicated to bringing your vision to life through innovative web solutions.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2020, Eternals Studio emerged from a simple belief: that every business deserves a digital presence that truly represents their unique value proposition.
                </p>
                <p className="text-muted-foreground mb-4">
                  What started as a small team of passionate developers has grown into a full-service digital agency, but we've never lost sight of our core mission - creating meaningful connections between brands and their audiences through exceptional web experiences.
                </p>
                <p className="text-muted-foreground">
                  Today, we're proud to have helped over 200+ businesses establish their digital footprint and achieve their online goals.
                </p>
              </div>
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-2xl font-bold text-seagram-green mb-2">200+</h3>
                  <p className="text-muted-foreground">Projects Completed</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-2xl font-bold text-violet-purple mb-2">50+</h3>
                  <p className="text-muted-foreground">Happy Clients</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-2xl font-bold text-seagram-green mb-2">4</h3>
                  <p className="text-muted-foreground">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground">The principles that guide everything we do</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <value.icon className="w-12 h-12 mx-auto text-seagram-green mb-4" />
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground">The talented individuals behind Eternals Studio</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-24 h-24 bg-gradient-to-r from-seagram-green to-violet-purple rounded-full mx-auto mb-4"></div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-seagram-green font-medium">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
