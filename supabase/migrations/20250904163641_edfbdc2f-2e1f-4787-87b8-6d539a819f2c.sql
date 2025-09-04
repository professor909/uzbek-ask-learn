-- Create function to calculate rank based on points
CREATE OR REPLACE FUNCTION public.calculate_rank_by_points(points_value integer)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
  IF points_value >= 32000 THEN
    RETURN 'academician';
  ELSIF points_value >= 16000 THEN
    RETURN 'dsc';
  ELSIF points_value >= 8000 THEN
    RETURN 'phd';
  ELSIF points_value >= 4000 THEN
    RETURN 'master';
  ELSIF points_value >= 1500 THEN
    RETURN 'student';
  ELSIF points_value >= 500 THEN
    RETURN 'learner';
  ELSE
    RETURN 'novice';
  END IF;
END;
$function$;

-- Create function to update user rank based on points
CREATE OR REPLACE FUNCTION public.update_user_rank()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only update reputation_level if user is not admin or expert
  -- Admins and experts keep their role titles instead of point-based ranks
  IF NEW.role NOT IN ('admin') AND NEW.is_expert = false THEN
    NEW.reputation_level = public.calculate_rank_by_points(NEW.points);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger to automatically update rank when points change
DROP TRIGGER IF EXISTS update_user_rank_trigger ON public.profiles;
CREATE TRIGGER update_user_rank_trigger
  BEFORE UPDATE OF points ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_user_rank();

-- Create trigger to set initial rank for new users
DROP TRIGGER IF EXISTS set_initial_rank_trigger ON public.profiles;
CREATE TRIGGER set_initial_rank_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_user_rank();

-- Update existing users' ranks based on current points
UPDATE public.profiles 
SET reputation_level = public.calculate_rank_by_points(points)
WHERE role != 'admin' AND is_expert = false;