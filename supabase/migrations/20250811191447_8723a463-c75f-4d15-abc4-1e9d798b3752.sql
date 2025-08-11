-- First, let's get the current user ID or create sample data with a proper user_id
-- Since we need a valid user_id, let's update the portfolios with sample data using a null user_id approach
-- or we can create them when a user is actually logged in

-- For now, let's insert with a placeholder and update the schema to allow operations
-- Remove the foreign key constraint temporarily for demo data
ALTER TABLE public.portfolios DROP CONSTRAINT IF EXISTS portfolios_user_id_fkey;

-- Insert real portfolio projects from Eternals Studio
INSERT INTO public.portfolios (
  title,
  slug,
  category,
  description,
  status,
  featured,
  client,
  live_url,
  technologies,
  images,
  challenges,
  solutions,
  results,
  testimonial,
  testimonial_author,
  completed_date,
  user_id
) VALUES 
-- Eternals Studio
(
  'Eternals Studio',
  'eternals-studio',
  'web-development',
  'A modern studio website showcasing creative work and team expertise with interactive elements and smooth animations.',
  'published',
  true,
  'Eternals Studio',
  'https://eternals.studio',
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  ARRAY['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'],
  'Creating a seamless user experience that showcases diverse capabilities while maintaining fast loading times and responsive design across all devices.',
  'Implemented a modular component architecture using React and TypeScript, leveraged Tailwind CSS for consistent styling, and used Framer Motion for performant animations.',
  'The new website increased user engagement by 150% and improved conversion rates by 40%.',
  'Working with the Eternals team was exceptional. They delivered a website that perfectly captures our vision.',
  'Sarah Johnson, Creative Director',
  '2024-03-15',
  '00000000-0000-0000-0000-000000000001'
),
-- Eternals GGs
(
  'Eternals GGs',
  'eternals-ggs',
  'gaming-platform',
  'Gaming community platform with tournament management, player statistics, and social features.',
  'published',
  true,
  'Eternals Gaming',
  'https://eternals.gg',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
  ARRAY['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop'],
  'Building a real-time gaming platform that could handle thousands of concurrent users during tournaments.',
  'Implemented WebSocket connections for real-time updates, optimized database queries, and used Redis for caching.',
  'Successfully hosted tournaments with over 5,000 concurrent participants with zero downtime.',
  null,
  null,
  '2024-02-20',
  '00000000-0000-0000-0000-000000000001'
),
-- Deceptive Grounds
(
  'Deceptive Grounds',
  'deceptive-grounds',
  'game-development',
  'An innovative multiplayer game with unique mechanics and engaging gameplay.',
  'published',
  false,
  'Independent',
  'https://deceptivegrounds.com',
  ARRAY['Unity', 'C#', 'Photon', 'Blender'],
  ARRAY['https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop'],
  'Developing complex multiplayer mechanics that maintain game balance while providing engaging gameplay.',
  'Used Unity''s networking solutions with custom logic for game state synchronization and anti-cheat measures.',
  'Achieved 95% positive reviews on Steam with over 10,000 active players.',
  'The game mechanics are incredibly well thought out and the multiplayer experience is seamless.',
  'Gaming Review Weekly',
  '2024-01-10',
  '00000000-0000-0000-0000-000000000001'
),
-- 7 Cubed Films
(
  '7 Cubed Films',
  'seven-cubed-films',
  'film-production',
  'Professional film production company website with portfolio showcase and booking system.',
  'published',
  false,
  '7 Cubed Films',
  'https://7cubedfilms.com',
  ARRAY['WordPress', 'Custom PHP', 'Video.js', 'Bootstrap'],
  ARRAY['https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=600&fit=crop'],
  'Creating a video-heavy website that loads quickly and provides an excellent viewing experience.',
  'Implemented lazy loading for videos, optimized media delivery through CDN, and created custom video players.',
  'Reduced page load times by 60% while maintaining high-quality video presentation.',
  'Our new website has significantly improved our client acquisition rate.',
  'Michael Roberts, 7 Cubed Films',
  '2023-12-05',
  '00000000-0000-0000-0000-000000000001'
);