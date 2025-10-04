-- Fix questions INSERT policy - use user_id without table prefix
DROP POLICY IF EXISTS "Users can create their own questions" ON public.questions;

CREATE POLICY "Users can create their own questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id
  AND 
  (
    SELECT role
    FROM public.profiles
    WHERE id = auth.uid()
  ) <> 'blocked'
);