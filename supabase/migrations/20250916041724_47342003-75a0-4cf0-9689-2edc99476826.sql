-- Update the create question function to also deduct monthly points
CREATE OR REPLACE FUNCTION public.deduct_monthly_points(user_id uuid, points_to_deduct integer)
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
  VALUES (user_id, current_year, current_month, -points_to_deduct)
  ON CONFLICT (user_id, year, month)
  DO UPDATE SET
    points = monthly_points.points - points_to_deduct,
    updated_at = now();
END;
$$;