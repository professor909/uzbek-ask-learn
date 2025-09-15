-- Initialize monthly points for existing users based on their current total points
-- This gives them a starting balance for the current month
INSERT INTO public.monthly_points (user_id, year, month, points)
SELECT 
  id as user_id,
  EXTRACT(year FROM now()) as year,
  EXTRACT(month FROM now()) as month,
  GREATEST(0, points / 4) as points  -- Give them 1/4 of their total points as monthly starting balance
FROM public.profiles 
WHERE points > 0
ON CONFLICT (user_id, year, month) DO NOTHING;