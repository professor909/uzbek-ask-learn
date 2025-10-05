-- Create security definer function to check if user is blocked
CREATE OR REPLACE FUNCTION public.is_user_blocked(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role FROM public.profiles WHERE id = user_id) = 'blocked', false);
$$;

-- Fix questions INSERT policy - use the security definer function
DROP POLICY IF EXISTS "Users can create their own questions" ON public.questions;

CREATE POLICY "Users can create their own questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (
  auth.uid() = questions.user_id
  AND NOT public.is_user_blocked(auth.uid())
);