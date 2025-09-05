-- Create trigger to automatically mark question as solved when it gets 3 answers
CREATE OR REPLACE FUNCTION public.check_question_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if question now has 3 answers
  IF (
    SELECT COUNT(*) FROM public.answers 
    WHERE question_id = NEW.question_id
  ) >= 3 THEN
    -- Mark question as solved
    UPDATE public.questions 
    SET is_solved = true 
    WHERE id = NEW.question_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for answer insertion
CREATE TRIGGER auto_solve_question_on_answer
  AFTER INSERT ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.check_question_completion();

-- Update RLS policies to block users with 'blocked' role
-- Update questions policies
DROP POLICY IF EXISTS "Users can create their own questions" ON public.questions;
CREATE POLICY "Users can create their own questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'blocked'
);

-- Update answers policies  
DROP POLICY IF EXISTS "Users can create answers" ON public.answers;
CREATE POLICY "Users can create answers" 
ON public.answers 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'blocked'
);

-- Update comments policies
DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'blocked'
);

-- Update votes policies
DROP POLICY IF EXISTS "Users can create their own votes" ON public.votes;
CREATE POLICY "Users can create their own votes" 
ON public.votes 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'blocked'
);