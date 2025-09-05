-- Fix security functions by adding search_path
CREATE OR REPLACE FUNCTION public.check_question_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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