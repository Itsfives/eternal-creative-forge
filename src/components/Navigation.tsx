
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
              Eternals Studio
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => smoothScroll(item.href)}
                  className={`text-foreground hover:text-seagram-green transition-all duration-300 px-3 py-2 text-sm font-medium relative group hover:scale-105 ${
                    scrolled ? 'animate-fade-in' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-seagram-green to-violet-purple scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-seagram-green hover:bg-seagram-green/90 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-seagram-green/25">
              Get Started
            </Button>
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
                <button
                  key={item.name}
                  onClick={() => smoothScroll(item.href)}
                  className={`text-foreground hover:text-seagram-green block px-3 py-2 text-base font-medium w-full text-left hover:bg-seagram-green/10 rounded-md transition-all duration-300 hover:scale-105 hover:translate-x-2 animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </button>
              ))}
              <Button className="w-full mt-4 bg-seagram-green hover:bg-seagram-green/90 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-seagram-green/25">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
