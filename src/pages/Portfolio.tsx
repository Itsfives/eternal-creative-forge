import Navigation from "../components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";

const Portfolio = () => {
  const { portfolios } = usePortfolio();
  const projectsCompleted = portfolios.filter(p => p.status === 'published').length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent mb-6">
              Our Projects
            </h1>
          </div>
        </section>

        {/* 2024 Projects */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">2024 Projects</h2>
            <p className="text-muted-foreground mb-8">This is all of our 2024 projects that was completed and delivered.</p>
            
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm mb-8">
              <div className="relative overflow-hidden">
                <img
                  src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=700,h=384,fit=crop/YNqO7k0WyEUyB3w6/2024-projects-min-A1awEBeOwPClago6.jpg"
                  alt="2024 Projects"
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <Button size="sm" variant="secondary" asChild>
                    <a href="https://www.eternals.studio/2024-projects" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View 2024 Projects
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 2025 Projects */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">2025 Projects</h2>
            <p className="text-muted-foreground mb-8">This is all of our 2025 projects that was completed and delivered.</p>
            
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm mb-8">
              <div className="relative overflow-hidden">
                <img
                  src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=700,h=384,fit=crop/YNqO7k0WyEUyB3w6/2025-projects-mnlqWD8MxQSqxe1b.jpg"
                  alt="2025 Projects"
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <Button size="sm" variant="secondary" asChild>
                    <a href="https://www.eternals.studio/2025-projects" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View 2025 Projects
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Stats Section with Live Counter */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover-lift">
                <div className="text-3xl font-bold text-seagram-green mb-2">{projectsCompleted}+</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </Card>
              <Card className="text-center p-6 hover-lift">
                <div className="text-3xl font-bold text-violet-purple mb-2">100%</div>
                <div className="text-muted-foreground">Client Satisfaction</div>
              </Card>
              <Card className="text-center p-6 hover-lift">
                <div className="text-3xl font-bold text-seagram-green mb-2">6</div>
                <div className="text-muted-foreground">Specializations</div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;