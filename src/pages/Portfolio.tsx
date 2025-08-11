import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Loader2, Filter } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { usePortfolio } from "@/hooks/usePortfolio";
import Navigation from "../components/Navigation";

const Portfolio = () => {
  const [filter, setFilter] = useState("all");
  const { portfolios, loading } = usePortfolio();

  const filteredProjects = portfolios.filter(project => 
    project.status === 'published' && (filter === "all" || project.category === filter)
  );

  const categories = ["all", ...Array.from(new Set(portfolios.map(p => p.category)))];
  const categoryLabels: Record<string, string> = {
    "all": "All Projects",
    "web-development": "Web Development", 
    "gaming-platform": "Gaming Platform",
    "game-development": "Game Development",
    "film-production": "Film Production",
    "dashboard": "Dashboard",
    "social-network": "Social Network"
  };

  const featuredProjects = portfolios.filter(project => project.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover our latest projects and see how we've helped businesses transform their digital presence.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-seagram-green rounded-full"></div>
                <span>{portfolios.length} Total Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-purple rounded-full"></div>
                <span>{featuredProjects.length} Featured</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Filter by category:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "default" : "outline"}
                  onClick={() => setFilter(category)}
                  className={`hover:scale-105 transition-all duration-300 ${
                    filter === category 
                      ? "bg-seagram-green hover:bg-seagram-green/90 shadow-lg shadow-seagram-green/25" 
                      : "hover:border-seagram-green hover:text-seagram-green"
                  }`}
                >
                  {categoryLabels[category] || category}
                  {category !== "all" && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {portfolios.filter(p => p.category === category).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-seagram-green" />
                <span className="ml-2 text-muted-foreground">Loading portfolio...</span>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <Card 
                    key={project.id}
                    className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm"
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={project.images?.[0] || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          {project.live_url && (
                            <Button size="sm" variant="secondary" asChild>
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Live
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="secondary" asChild>
                            <Link to={`/portfolio/${project.slug}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                      {project.featured && (
                        <Badge className="absolute top-4 right-4 bg-seagram-green hover:bg-seagram-green/90">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{categoryLabels[project.category] || project.category}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-seagram-green transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies?.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies && project.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold mb-4">No projects found</h3>
                <p className="text-muted-foreground">Try adjusting your filter or check back later for new projects.</p>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover-lift">
                <div className="text-3xl font-bold text-seagram-green mb-2">{portfolios.length}+</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </Card>
              <Card className="text-center p-6 hover-lift">
                <div className="text-3xl font-bold text-violet-purple mb-2">{categories.length - 1}</div>
                <div className="text-muted-foreground">Industries Served</div>
              </Card>
              <Card className="text-center p-6 hover-lift">
                <div className="text-3xl font-bold text-seagram-green mb-2">100%</div>
                <div className="text-muted-foreground">Client Satisfaction</div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how we can help bring your vision to life with our expertise and passion for excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-seagram-green hover:bg-seagram-green/90 text-white px-8 py-3 hover:scale-105 transition-all duration-300">
                Start Your Project
              </Button>
              <Button variant="outline" className="px-8 py-3 hover:border-seagram-green hover:text-seagram-green hover:scale-105 transition-all duration-300">
                View More Work
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;