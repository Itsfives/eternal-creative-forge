import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Calendar, AlertTriangle } from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type StorePurchase = Database['public']['Tables']['store_purchases']['Row'];
type StoreProduct = Database['public']['Tables']['store_products']['Row'];

interface PurchaseWithProduct extends StorePurchase {
  store_products: StoreProduct;
}

interface DownloadCardProps {
  purchase: PurchaseWithProduct;
  onDownload: (purchase: PurchaseWithProduct) => void;
  isLoading?: boolean;
}

export const DownloadCard = ({ purchase, onDownload, isLoading = false }: DownloadCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const downloadProgress = purchase.download_limit 
    ? ((purchase.download_count || 0) / purchase.download_limit) * 100 
    : 0;

  const isExpired = purchase.expires_at && new Date(purchase.expires_at) < new Date();
  const canDownload = !isExpired && (purchase.download_count || 0) < (purchase.download_limit || 5);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{purchase.store_products.name}</CardTitle>
            <CardDescription>
              Purchased on {formatDate(purchase.created_at)}
            </CardDescription>
          </div>
          <Badge variant={canDownload ? "default" : "secondary"}>
            {purchase.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Download progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Downloads Used</span>
              <span>{purchase.download_count || 0} / {purchase.download_limit || 5}</span>
            </div>
            <Progress value={downloadProgress} className="h-2" />
          </div>

          {/* File info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>File: {purchase.store_products.file_name}</span>
            {purchase.store_products.file_size && (
              <span>{formatFileSize(purchase.store_products.file_size)}</span>
            )}
          </div>

          {/* Expiration warning */}
          {purchase.expires_at && (
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className={isExpired ? 'text-destructive' : 'text-muted-foreground'}>
                {isExpired ? 'Expired' : 'Expires'} on {formatDate(purchase.expires_at)}
              </span>
            </div>
          )}

          {/* Download limits warning */}
          {(purchase.download_count || 0) >= (purchase.download_limit || 5) && (
            <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-2 rounded">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Download limit reached
            </div>
          )}

          {/* Download button */}
          <Button 
            onClick={() => onDownload(purchase)}
            disabled={!canDownload || isLoading}
            className="w-full"
            variant={canDownload ? "default" : "secondary"}
          >
            <Download className="w-4 h-4 mr-2" />
            {isLoading ? 'Preparing Download...' : canDownload ? 'Download' : 'Unavailable'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};