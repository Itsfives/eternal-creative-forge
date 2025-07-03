
import Navigation from "../components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "hello@eternalsstudio.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 5pm"
    },
    {
      icon: MapPin,
      title: "Office",
      content: "123 Creative Street, Design City, DC 12345",
      description: "Come say hello at our office"
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Monday - Friday: 8:00 AM - 5:00 PM",
      description: "We're here to help during business hours"
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
              Get In Touch
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Ready to start your next project? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter your first name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter your last name" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input id="company" placeholder="Enter your company name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What's this about?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us about your project or question..." 
                        rows={6}
                      />
                    </div>
                    <Button className="w-full bg-seagram-green hover:bg-seagram-green/90 text-white">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                  <p className="text-muted-foreground mb-8">
                    Have questions? We're here to help. Reach out to us through any of the following methods.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-seagram-green/10 rounded-lg">
                          <info.icon className="w-6 h-6 text-seagram-green" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                          <p className="text-foreground mb-1">{info.content}</p>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Map Placeholder */}
                <Card className="p-6">
                  <div className="bg-muted/50 h-64 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Quick answers to common questions</p>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">How long does a typical project take?</h3>
                <p className="text-muted-foreground">Project timelines vary depending on complexity, but most websites take 4-8 weeks from start to finish.</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Do you provide ongoing support?</h3>
                <p className="text-muted-foreground">Yes! We offer various maintenance and support packages to keep your website running smoothly.</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">What's included in your web development service?</h3>
                <p className="text-muted-foreground">Our service includes design, development, testing, deployment, and basic SEO optimization.</p>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
