-- Add 'blocked' role to the profiles role constraint
ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;

-- Add new constraint with 'blocked' role included
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['novice'::text, 'student'::text, 'expert'::text, 'admin'::text, 'blocked'::text]));