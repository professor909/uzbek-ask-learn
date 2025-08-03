-- Phase 1: Critical Privilege Escalation Fix

-- Create security definer function to get current user role without RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin', false);
$$;

-- Drop existing update policy that allows users to update sensitive fields
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create restricted update policy that prevents users from modifying sensitive fields
CREATE POLICY "Users can update their own profile (restricted)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Prevent users from changing sensitive fields
  (role IS NULL OR role = OLD.role) AND
  (is_expert IS NULL OR is_expert = OLD.is_expert) AND
  (expert_since IS NULL OR expert_since = OLD.expert_since) AND
  (expert_categories IS NULL OR expert_categories = OLD.expert_categories) AND
  (points IS NULL OR points = OLD.points)
);

-- Create admin-only update policy for sensitive fields
CREATE POLICY "Admins can update all profile fields" 
ON public.profiles 
FOR UPDATE 
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Fix the experts view RLS issue by dropping and recreating it as a table with proper RLS
DROP VIEW IF EXISTS public.experts;

-- Create experts table instead of view for better security control
CREATE TABLE IF NOT EXISTS public.experts_cache (
  id UUID PRIMARY KEY,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  points INTEGER,
  expert_since TIMESTAMP WITH TIME ZONE,
  expert_categories TEXT[],
  answers_count BIGINT DEFAULT 0,
  best_answers_count BIGINT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on experts cache table
ALTER TABLE public.experts_cache ENABLE ROW LEVEL SECURITY;

-- Create policy for experts cache table
CREATE POLICY "Experts cache is viewable by everyone" 
ON public.experts_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify experts cache" 
ON public.experts_cache 
FOR ALL 
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Create function to refresh experts cache
CREATE OR REPLACE FUNCTION public.refresh_experts_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Clear existing cache
  DELETE FROM public.experts_cache;
  
  -- Repopulate cache
  INSERT INTO public.experts_cache (
    id, username, display_name, avatar_url, points, 
    expert_since, expert_categories, answers_count, best_answers_count
  )
  SELECT 
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.points,
    p.expert_since,
    p.expert_categories,
    COUNT(a.id) as answers_count,
    COUNT(CASE WHEN a.is_best_answer THEN 1 END) as best_answers_count
  FROM public.profiles p
  LEFT JOIN public.answers a ON p.id = a.user_id
  WHERE p.is_expert = true
  GROUP BY p.id, p.username, p.display_name, p.avatar_url, p.points, p.expert_since, p.expert_categories;
  
  -- Update timestamp
  UPDATE public.experts_cache SET updated_at = now();
END;
$$;

-- Initial population of experts cache
SELECT public.refresh_experts_cache();

-- Update the set_expert_status function to use proper search path and refresh cache
CREATE OR REPLACE FUNCTION public.set_expert_status(
  user_id UUID,
  is_expert BOOLEAN,
  categories TEXT[] DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to set expert status
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Only administrators can set expert status';
  END IF;

  UPDATE public.profiles 
  SET 
    is_expert = set_expert_status.is_expert,
    expert_since = CASE 
      WHEN set_expert_status.is_expert = true AND profiles.expert_since IS NULL 
      THEN now() 
      ELSE profiles.expert_since 
    END,
    expert_categories = CASE 
      WHEN set_expert_status.is_expert = true 
      THEN categories 
      ELSE '{}' 
    END
  WHERE id = set_expert_status.user_id;
  
  -- Refresh experts cache
  PERFORM public.refresh_experts_cache();
END;
$$;