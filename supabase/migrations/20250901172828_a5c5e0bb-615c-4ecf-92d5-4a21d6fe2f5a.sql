-- Create function to prevent answering own questions and limit answers
CREATE OR REPLACE FUNCTION public.validate_answer_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user is trying to answer their own question
  IF EXISTS (
    SELECT 1 FROM public.questions 
    WHERE id = NEW.question_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Cannot answer your own questions';
  END IF;
  
  -- Check if question already has 3 answers
  IF (
    SELECT COUNT(*) FROM public.answers 
    WHERE question_id = NEW.question_id
  ) >= 3 THEN
    RAISE EXCEPTION 'Maximum of 3 answers allowed per question';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for answer validation
DROP TRIGGER IF EXISTS validate_answer_before_insert ON public.answers;
CREATE TRIGGER validate_answer_before_insert
  BEFORE INSERT ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_answer_creation();