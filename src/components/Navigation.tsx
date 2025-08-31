
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Shield, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, hasRole, logout, user } = useAuth();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Store", href: "/store" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const getPortalItems = () => {
    const items = [];
    if (isAuthenticated) {
      items.push({ name: "Client Portal", href: "/client-portal", icon: User });
    }
    if (hasRole("cms_editor")) {
      items.push({ name: "CMS", href: "/cms", icon: Settings });
    }
    if (hasRole("admin")) {
      items.push({ name: "Admin", href: "/admin", icon: Shield });
    }
    return items;
  };

  const portalItems = getPortalItems();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      // Handle hash navigation for same-page sections
      if (location.pathname !== '/') {
        window.location.href = href;
      } else {
        const element = document.querySelector(href.substring(1));
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full backdrop-blur-lg border-b border-border z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-background/90 shadow-lg shadow-background/10' 
        : 'bg-background/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with enhanced animation */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div 
                className="h-12 w-12 bg-gradient-to-r from-seagram-green to-violet-purple hover:scale-105 transition-all duration-300"
                style={{
                  mask: 'url(/lovable-uploads/2fa6123b-b4cf-4f40-ab0b-a089850b5ad8.png) no-repeat center/contain',
                  WebkitMask: 'url(/lovable-uploads/2fa6123b-b4cf-4f40-ab0b-a089850b5ad8.png) no-repeat center/contain'
                }}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                Eternals Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                item.href.startsWith('/#') ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-foreground hover:text-seagram-green transition-all duration-300 px-3 py-2 text-sm font-medium relative group hover:scale-105 ${
                      scrolled ? 'animate-fade-in' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.name}
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-seagram-green to-violet-purple scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-foreground hover:text-seagram-green transition-all duration-300 px-3 py-2 text-sm font-medium relative group hover:scale-105 ${
                      scrolled ? 'animate-fade-in' : ''
                    } ${location.pathname === item.href ? 'text-seagram-green' : ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.name}
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-seagram-green to-violet-purple scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Link>
                )
              ))}
              
              {/* Portal Links */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border">
                {portalItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`p-2 rounded-md hover:bg-seagram-green/10 transition-all duration-300 ${
                      location.pathname === item.href ? 'bg-seagram-green/20 text-seagram-green' : 'text-muted-foreground hover:text-seagram-green'
                    }`}
                    title={item.name}
                  >
                    <item.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <Button 
                onClick={logout}
                variant="outline"
                className="hover:scale-105 transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button className="bg-seagram-green hover:bg-seagram-green/90 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-seagram-green/25">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:scale-110 transition-transform duration-200"
            >
              {isMenuOpen ? 
                <X size={24} className="rotate-90 transition-transform duration-300" /> : 
                <Menu size={24} className="hover:rotate-12 transition-transform duration-300" />
              }
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 backdrop-blur-lg border-t border-border">
              {navItems.map((item, index) => (
                item.href.startsWith('/#') ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-foreground hover:text-seagram-green block px-3 py-2 text-base font-medium w-full text-left hover:bg-seagram-green/10 rounded-md transition-all duration-300 hover:scale-105 hover:translate-x-2 animate-fade-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-foreground hover:text-seagram-green block px-3 py-2 text-base font-medium w-full text-left hover:bg-seagram-green/10 rounded-md transition-all duration-300 hover:scale-105 hover:translate-x-2 animate-fade-in ${
                      location.pathname === item.href ? 'text-seagram-green bg-seagram-green/10' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              {/* Mobile Portal Links */}
              <div className="border-t border-border pt-3 mt-3">
                {portalItems.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-foreground hover:text-seagram-green flex items-center px-3 py-2 text-base font-medium w-full text-left hover:bg-seagram-green/10 rounded-md transition-all duration-300 hover:scale-105 hover:translate-x-2 animate-fade-in ${
                      location.pathname === item.href ? 'text-seagram-green bg-seagram-green/10' : ''
                    }`}
                    style={{ animationDelay: `${(navItems.length + index) * 50}ms` }}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {isAuthenticated ? (
                <Button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full mt-4 hover:scale-105 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full mt-4 bg-seagram-green hover:bg-seagram-green/90 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-seagram-green/25">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
