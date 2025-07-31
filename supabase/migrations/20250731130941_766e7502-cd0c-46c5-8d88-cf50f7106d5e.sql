-- Add foreign key constraint for questions to profiles
ALTER TABLE public.questions 
ADD CONSTRAINT questions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Add foreign key constraint for answers to profiles  
ALTER TABLE public.answers 
ADD CONSTRAINT answers_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Add foreign key constraint for votes to profiles
ALTER TABLE public.votes 
ADD CONSTRAINT votes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;