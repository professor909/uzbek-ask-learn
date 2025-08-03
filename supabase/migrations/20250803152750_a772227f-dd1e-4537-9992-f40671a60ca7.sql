-- Fix the role check constraint to include 'novice' role
ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;

-- Add new constraint with correct role values
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['novice'::text, 'student'::text, 'expert'::text, 'admin'::text]));

-- Update any existing records with 'student' role to 'novice' 
UPDATE public.profiles SET role = 'novice' WHERE role = 'student';