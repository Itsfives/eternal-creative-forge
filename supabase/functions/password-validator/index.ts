import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PasswordValidationRequest {
  password: string;
  email?: string;
}

interface PasswordValidationResponse {
  isValid: boolean;
  score: number; // 0-100
  issues: string[];
  suggestions: string[];
}

// Common weak passwords and patterns
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
  'master', 'login', 'passw0rd', 'football', 'baseball', 'sunshine',
  'princess', 'charlie', 'aa123456', 'donald', 'freedom'
];

const WEAK_PATTERNS = [
  /^(.)\1+$/, // All same character
  /^(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/, // Sequential numbers
  /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i, // Sequential letters
  /^(qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm)/i, // Keyboard patterns
];

function validatePassword(password: string, email?: string): PasswordValidationResponse {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < 8) {
    issues.push('Password must be at least 8 characters long');
    suggestions.push('Use at least 8 characters');
  } else if (password.length >= 8) {
    score += 20;
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    issues.push('Password must contain at least one uppercase letter');
    suggestions.push('Add uppercase letters (A-Z)');
  } else {
    score += 15;
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    issues.push('Password must contain at least one lowercase letter');
    suggestions.push('Add lowercase letters (a-z)');
  } else {
    score += 15;
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    issues.push('Password must contain at least one number');
    suggestions.push('Add numbers (0-9)');
  } else {
    score += 15;
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push('Password must contain at least one special character');
    suggestions.push('Add special characters (!@#$%^&*)');
  } else {
    score += 15;
  }

  // Check against common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    issues.push('This password is too common and easily guessed');
    suggestions.push('Choose a unique password that is not commonly used');
    score = Math.max(0, score - 40);
  }

  // Check for weak patterns
  for (const pattern of WEAK_PATTERNS) {
    if (pattern.test(password)) {
      issues.push('Password contains predictable patterns');
      suggestions.push('Avoid sequential characters or keyboard patterns');
      score = Math.max(0, score - 20);
      break;
    }
  }

  // Check if password contains email username
  if (email) {
    const emailUsername = email.split('@')[0].toLowerCase();
    if (password.toLowerCase().includes(emailUsername)) {
      issues.push('Password should not contain your email username');
      suggestions.push('Choose a password unrelated to your email');
      score = Math.max(0, score - 15);
    }
  }

  // Check for repeated characters
  const repeatedChars = /(.)\1{2,}/.test(password);
  if (repeatedChars) {
    issues.push('Password contains too many repeated characters');
    suggestions.push('Avoid repeating the same character multiple times');
    score = Math.max(0, score - 10);
  }

  // Bonus points for longer passwords
  if (password.length >= 12) {
    score += 10;
  }
  if (password.length >= 16) {
    score += 10;
  }

  // Calculate entropy bonus
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) {
    score += 10;
  }

  // Cap score at 100
  score = Math.min(100, score);

  const isValid = issues.length === 0 && score >= 70;

  if (!isValid && suggestions.length === 0) {
    suggestions.push('Try using a mix of uppercase, lowercase, numbers, and special characters');
  }

  return {
    isValid,
    score,
    issues,
    suggestions
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { password, email }: PasswordValidationRequest = await req.json();

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const validation = validatePassword(password, email);

    console.log('Password validation:', {
      isValid: validation.isValid,
      score: validation.score,
      issueCount: validation.issues.length
    });

    return new Response(
      JSON.stringify(validation),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in password-validator function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});