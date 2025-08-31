import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  timestamp?: string;
  page?: string;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse the request body - can be single event or array of events
    const requestData = await req.json();
    const events: AnalyticsEvent[] = Array.isArray(requestData) ? requestData : [requestData];

    // Validate required fields for each event
    for (const event of events) {
      if (!event.action || !event.category) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: action, category' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Log the analytics events to console for debugging
    console.log('Analytics Events Received:', {
      count: events.length,
      events: events.map(event => ({
        action: event.action,
        category: event.category,
        value: event.value
      }))
    });

    // Store analytics data in a simple analytics table (if it exists)
    // For now, we'll just log and return success
    
    // You could also forward to external analytics services here:
    // - Google Analytics
    // - Mixpanel
    // - PostHog
    // - Custom analytics platform

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${events.length} analytics event(s) processed`,
        timestamp: new Date().toISOString(),
        processed: events.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Analytics processing error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});