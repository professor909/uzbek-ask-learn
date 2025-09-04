-- Update the function to give points based on question points divided by 3
CREATE OR REPLACE FUNCTION public.update_user_points_for_answer()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Get question points and calculate reward (question points / 3)
  UPDATE public.profiles 
  SET points = points + (
    SELECT GREATEST(1, q.points / 3) -- Minimum 1 point, or question points divided by 3
    FROM public.questions q 
    WHERE q.id = NEW.question_id
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists for awarding points when answers are created
DROP TRIGGER IF EXISTS update_user_points_for_answer_trigger ON public.answers;
CREATE TRIGGER update_user_points_for_answer_trigger
  AFTER INSERT ON public.answers
  FOR EACH ROW EXECUTE FUNCTION public.update_user_points_for_answer();

-- Ensure the trigger exists for giving starting points to new users
DROP TRIGGER IF EXISTS give_starting_points_trigger ON public.profiles;
CREATE TRIGGER give_starting_points_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.give_starting_points();