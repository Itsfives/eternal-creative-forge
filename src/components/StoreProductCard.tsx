import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ShoppingCart, CheckCircle } from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type StoreProduct = Database['public']['Tables']['store_products']['Row'];

interface StoreProductCardProps {
  product: StoreProduct;
  onPurchase: (product: StoreProduct) => void;
  isPurchased?: boolean;
  isLoading?: boolean;
}

export const StoreProductCard = ({ 
  product, 
  onPurchase, 
  isPurchased = false, 
  isLoading = false 
}: StoreProductCardProps) => {
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 card-interactive">
      <CardHeader>
        {product.preview_image_url && (
          <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
            <img 
              src={product.preview_image_url} 
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                // Fallback to gradient background if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
            <CardDescription className="text-sm mb-3">
              {product.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">What's included:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-2 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* File info */}
          {product.file_size && (
            <div className="text-xs text-muted-foreground">
              File size: {formatFileSize(product.file_size)}
            </div>
          )}

          {/* Price and action */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-2xl font-bold text-primary">
              ${formatPrice(product.price)}
            </div>
            
            {isPurchased ? (
              <Badge variant="default" className="bg-primary">
                <CheckCircle className="w-4 h-4 mr-1" />
                Purchased
              </Badge>
            ) : (
              <Button 
                onClick={() => onPurchase(product)}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isLoading ? 'Processing...' : 'Buy Now'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};