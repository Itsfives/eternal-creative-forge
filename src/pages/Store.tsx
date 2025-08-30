import { useState, useEffect } from "react";
import { useStore } from "@/hooks/useStore";
import { StoreProductCard } from "@/components/StoreProductCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ShoppingBag, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import type { Database } from '@/integrations/supabase/types';

type StoreProduct = Database['public']['Tables']['store_products']['Row'];

const Store = () => {
  const { products, purchases, loading, createPurchase } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [purchasingProduct, setPurchasingProduct] = useState<string | null>(null);

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const purchasedProductIds = new Set(purchases.map(p => p.product_id));

  const handlePurchase = async (product: StoreProduct) => {
    try {
      setPurchasingProduct(product.id);
      // Create a pending purchase record
      await createPurchase(product.id, product.price);
      
      // In a real implementation, you would integrate with Stripe here
      // For demo purposes, we'll simulate a successful purchase
      setTimeout(() => {
        // This would normally be handled by a webhook or payment confirmation
        console.log(`Purchase ${product.name} for $${(product.price / 100).toFixed(2)}`);
        setPurchasingProduct(null);
      }, 2000);
      
    } catch (error) {
      console.error('Purchase failed:', error);
      setPurchasingProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent mb-4">
                  Digital Store
                </h1>
                <p className="text-muted-foreground text-lg">
                  Premium digital products and templates to accelerate your projects
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link to="/client-portal">
                  <Button variant="outline" size="sm">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    My Downloads
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <div className="flex gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Grid */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="w-full h-48 bg-muted rounded-lg mb-4" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-muted rounded w-16" />
                      <div className="h-9 bg-muted rounded w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <StoreProductCard
                  key={product.id}
                  product={product}
                  onPurchase={handlePurchase}
                  isPurchased={purchasedProductIds.has(product.id)}
                  isLoading={purchasingProduct === product.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;