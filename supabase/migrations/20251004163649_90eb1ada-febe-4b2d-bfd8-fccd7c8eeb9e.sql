-- Fix ambiguous user_id reference in questions RLS policy
DROP POLICY IF EXISTS "Users can create their own questions" ON public.questions;

CREATE POLICY "Users can create their own questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (
  (auth.uid() = questions.user_id) 
  AND 
  (
    SELECT profiles.role
    FROM public.profiles
    WHERE profiles.id = auth.uid()
  ) <> 'blocked'
);