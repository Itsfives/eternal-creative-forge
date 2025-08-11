import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePortfolio } from "@/hooks/usePortfolio";
import Navigation from "../components/Navigation";
import type { Database } from "@/integrations/supabase/types";

type Portfolio = Database['public']['Tables']['portfolios']['Row'];

const ProjectDetail = () => {
  const { slug } = useParams();
  const { getPortfolioBySlug } = usePortfolio();
  const [project, setProject] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      
      setLoading(true);
      const data = await getPortfolioBySlug(slug);
      setProject(data);
      setLoading(false);
    };

    fetchProject();
  }, [slug, getPortfolioBySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-seagram-green" />
              <span className="ml-2 text-muted-foreground">Loading project...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Project not found</h1>
              <p className="text-muted-foreground mt-2">The project you're looking for doesn't exist.</p>
              <Link to="/portfolio">
                <Button className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    "web-development": "Web Development", 
    "gaming-platform": "Gaming Platform",
    "game-development": "Game Development",
    "film-production": "Film Production",
    "dashboard": "Dashboard",
    "social-network": "Social Network"
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link to="/portfolio">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>

          {/* Project Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="outline" className="border-seagram-green text-seagram-green">
                {categoryLabels[project.category] || project.category}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {project.completed_date ? new Date(project.completed_date).toLocaleDateString() : 'Ongoing'}
                </div>
                {project.client && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {project.client}
                  </div>
                )}
                {project.featured && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Featured
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
              {project.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {project.description}
            </p>

            <div className="flex gap-3">
              {project.live_url && (
                <Button asChild>
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Site
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Project Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {project.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Technologies Used */}
          {project.technologies && project.technologies.length > 0 && (
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Details */}
          {(project.challenges || project.solutions) && (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {project.challenges && (
                <Card>
                  <CardHeader>
                    <CardTitle>Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.challenges}
                    </p>
                  </CardContent>
                </Card>
              )}

              {project.solutions && (
                <Card>
                  <CardHeader>
                    <CardTitle>Solutions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.solutions}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Results */}
          {project.results && (
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Results & Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {project.results}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Testimonial */}
          {project.testimonial && (
            <Card className="bg-seagram-green/5 border-seagram-green/20">
              <CardContent className="pt-6">
                <blockquote className="text-lg italic mb-4">
                  "{project.testimonial}"
                </blockquote>
                {project.testimonial_author && (
                  <cite className="text-muted-foreground">
                    — {project.testimonial_author}
                  </cite>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;