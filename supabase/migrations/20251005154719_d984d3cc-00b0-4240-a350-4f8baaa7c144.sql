-- Fix ambiguous user_id reference in questions INSERT policy
DROP POLICY IF EXISTS "Users can create their own questions" ON public.questions;

CREATE POLICY "Users can create their own questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (
  auth.uid() = questions.user_id 
  AND NOT is_user_blocked(auth.uid())
);