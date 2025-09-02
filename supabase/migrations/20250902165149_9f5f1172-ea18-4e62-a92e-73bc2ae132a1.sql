-- Enforce: no self-answers, max 3 answers per question, and only one answer per user per question
CREATE OR REPLACE FUNCTION public.validate_answer_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent answering own question
  IF EXISTS (
    SELECT 1 FROM public.questions 
    WHERE id = NEW.question_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Нельзя отвечать на свои вопросы';
  END IF;

  -- Prevent more than one answer per user per question
  IF EXISTS (
    SELECT 1 FROM public.answers 
    WHERE question_id = NEW.question_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Вы уже оставили ответ на этот вопрос';
  END IF;
  
  -- Limit total answers per question to 3
  IF (
    SELECT COUNT(*) FROM public.answers 
    WHERE question_id = NEW.question_id
  ) >= 3 THEN
    RAISE EXCEPTION 'Максимум 3 ответа на один вопрос';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS validate_answer_before_insert ON public.answers;
CREATE TRIGGER validate_answer_before_insert
  BEFORE INSERT ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_answer_creation();