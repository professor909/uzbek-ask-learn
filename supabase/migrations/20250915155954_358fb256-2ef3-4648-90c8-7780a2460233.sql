-- Create table for monthly points tracking
CREATE TABLE public.monthly_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  year integer NOT NULL,
  month integer NOT NULL,
  points integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, year, month)
);

-- Enable RLS
ALTER TABLE public.monthly_points ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Monthly points are viewable by everyone" 
ON public.monthly_points 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage monthly points" 
ON public.monthly_points 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Function to add points to current month
CREATE OR REPLACE FUNCTION public.add_monthly_points(user_id uuid, points_to_add integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_year integer := EXTRACT(year FROM now());
  current_month integer := EXTRACT(month FROM now());
BEGIN
  INSERT INTO public.monthly_points (user_id, year, month, points)
  VALUES (user_id, current_year, current_month, points_to_add)
  ON CONFLICT (user_id, year, month)
  DO UPDATE SET
    points = monthly_points.points + points_to_add,
    updated_at = now();
END;
$$;

-- Update the existing points trigger to also track monthly points
CREATE OR REPLACE FUNCTION public.update_user_points_for_answer()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  question_points integer;
  reward_points integer;
BEGIN
  -- Get question points and calculate reward (question points / 3)
  SELECT q.points INTO question_points
  FROM public.questions q 
  WHERE q.id = NEW.question_id;
  
  reward_points := GREATEST(1, question_points / 3);
  
  -- Update total points
  UPDATE public.profiles 
  SET points = points + reward_points
  WHERE id = NEW.user_id;
  
  -- Add to monthly points
  PERFORM public.add_monthly_points(NEW.user_id, reward_points);
  
  RETURN NEW;
END;
$$;