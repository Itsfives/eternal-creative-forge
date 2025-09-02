import React from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { useCart } from '@/hooks/useCart';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

export function CartIcon() {
  const { items, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <CartContent />
      </SheetContent>
    </Sheet>
  );
}

export function CartContent() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
      </SheetHeader>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start gap-4">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="border-t pt-4 space-y-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total: ${getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="space-y-2">
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => window.location.href = '/checkout'}
          >
            Proceed to Checkout
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}