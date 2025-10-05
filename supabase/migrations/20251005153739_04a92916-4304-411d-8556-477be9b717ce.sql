-- Fix the INSERT policy - remove table prefix for INSERT operations
DROP POLICY IF EXISTS "Users can create their own questions" ON public.questions;

CREATE POLICY "Users can create their own questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id
  AND NOT public.is_user_blocked(auth.uid())
);