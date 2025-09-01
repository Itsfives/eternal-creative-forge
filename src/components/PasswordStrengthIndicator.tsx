import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PasswordStrengthIndicatorProps {
  password: string;
  email?: string;
  onValidationChange: (isValid: boolean) => void;
}

interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

export const PasswordStrengthIndicator = ({ 
  password, 
  email, 
  onValidationChange 
}: PasswordStrengthIndicatorProps) => {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!password) {
      setValidation(null);
      onValidationChange(false);
      return;
    }

    const validatePassword = async () => {
      setIsValidating(true);
      try {
        const { data, error } = await supabase.functions.invoke('password-validator', {
          body: { password, email }
        });

        if (error) {
          console.error('Password validation error:', error);
          onValidationChange(false);
          return;
        }

        setValidation(data);
        onValidationChange(data.isValid);
      } catch (error) {
        console.error('Failed to validate password:', error);
        onValidationChange(false);
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validatePassword, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [password, email, onValidationChange]);

  if (!password) return null;

  const getStrengthColor = (score: number) => {
    if (score >= 80) return 'hsl(var(--seagram-green))';
    if (score >= 60) return 'hsl(var(--warning))';
    if (score >= 40) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getStrengthLabel = (score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Weak';
  };

  const getStrengthVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (isValidating) {
    return (
      <div className="space-y-2 mt-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Checking password strength...</span>
        </div>
      </div>
    );
  }

  if (!validation) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Password Strength</span>
          <Badge variant={getStrengthVariant(validation.score)}>
            {getStrengthLabel(validation.score)}
          </Badge>
        </div>
        <Progress 
          value={validation.score} 
          className="h-2"
          style={{
            '--progress-foreground': getStrengthColor(validation.score)
          } as React.CSSProperties}
        />
      </div>

      {/* Issues */}
      {validation.issues.length > 0 && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertDescription>
            <ul className="space-y-1 mt-1">
              {validation.issues.map((issue, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <X className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Suggestions */}
      {validation.suggestions.length > 0 && !validation.isValid && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="text-sm font-medium mb-1">Suggestions:</div>
            <ul className="space-y-1">
              {validation.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <div className="h-1 w-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {validation.isValid && (
        <Alert className="border-seagram-green/20 bg-seagram-green/5">
          <Check className="h-4 w-4 text-seagram-green" />
          <AlertDescription className="text-seagram-green">
            Great! Your password meets all security requirements.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};