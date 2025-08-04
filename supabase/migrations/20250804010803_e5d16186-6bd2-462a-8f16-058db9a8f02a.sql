-- Add points earning system for answers
-- Update profiles points when user creates answer
CREATE OR REPLACE FUNCTION public.update_user_points_for_answer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Award 5 points for creating an answer
  UPDATE public.profiles 
  SET points = points + 5
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for answer points
CREATE TRIGGER award_points_for_answer
  AFTER INSERT ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_points_for_answer();

-- Function to give starting points to new users
CREATE OR REPLACE FUNCTION public.give_starting_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Give 100 starting points to new users
  NEW.points = 100;
  RETURN NEW;
END;
$$;

-- Update the existing handle_new_user trigger to include starting points
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, points)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', 'user_' || SUBSTR(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    100
  );
  RETURN NEW;
END;
$$;