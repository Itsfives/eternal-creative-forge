import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Package,
  DollarSign,
  Image as ImageIcon,
  FileText
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
  file_url: string;
  file_name: string;
  preview_image_url: string;
  features: string[];
}

const StoreManager = () => {
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category: 'digital',
    status: 'active',
    file_url: '',
    file_name: '',
    preview_image_url: '',
    features: []
  });
  const [newFeature, setNewFeature] = useState('');

  const { products, loading } = useStore();
  const { toast } = useToast();

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      category: 'digital',
      status: 'active',
      file_url: '',
      file_name: '',
      preview_image_url: '',
      features: []
    });
    setNewFeature('');
    setEditingProduct(null);
  };

  const handleSaveProduct = async () => {
    try {
      // Here you would normally call a create/update function
      console.log('Saving product:', productForm);
      
      toast({
        title: editingProduct ? "Product Updated" : "Product Created",
        description: `${productForm.name} has been ${editingProduct ? 'updated' : 'created'} successfully.`,
      });

      setShowProductDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditProduct = (product: any) => {
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      status: product.status,
      file_url: product.file_url || '',
      file_name: product.file_name || '',
      preview_image_url: product.preview_image_url || '',
      features: product.features || []
    });
    setEditingProduct(product.id);
    setShowProductDialog(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Here you would normally call a delete function
      console.log('Deleting product:', productId);
      
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setProductForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
            Store Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your digital products and store inventory
          </p>
        </div>
        
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogTrigger asChild>
            <Button 
              className="bg-seagram-green hover:bg-seagram-green/90"
              onClick={() => resetForm()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct 
                  ? 'Update the product details below.'
                  : 'Create a new product for your store.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (cents)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    placeholder="9999"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your product..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={productForm.category} 
                    onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="ebook">E-book</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={productForm.status} 
                    onValueChange={(value: 'active' | 'inactive') => setProductForm(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="file_url">Download File URL</Label>
                  <Input
                    id="file_url"
                    value={productForm.file_url}
                    onChange={(e) => setProductForm(prev => ({ ...prev, file_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="file_name">File Name</Label>
                  <Input
                    id="file_name"
                    value={productForm.file_name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, file_name: e.target.value }))}
                    placeholder="product-file.zip"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="preview_image">Preview Image URL</Label>
                <Input
                  id="preview_image"
                  value={productForm.preview_image_url}
                  onChange={(e) => setProductForm(prev => ({ ...prev, preview_image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Features</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature..."
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <Button 
                      type="button" 
                      onClick={addFeature}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {productForm.features.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="cursor-pointer"
                        onClick={() => removeFeature(index)}
                      >
                        {feature} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSaveProduct}
                  className="bg-seagram-green hover:bg-seagram-green/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowProductDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading products...</div>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">${(product.price / 100).toFixed(2)}</span>
                      </div>
                      
                      {product.file_size && (
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>{Math.round(product.file_size / 1024 / 1024)}MB</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>Created {format(new Date(product.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>

                    {product.features && product.features.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {product.preview_image_url && (
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={product.preview_image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreManager;