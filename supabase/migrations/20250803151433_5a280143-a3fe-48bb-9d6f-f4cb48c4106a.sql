-- Add foreign key relationship between questions and profiles
ALTER TABLE public.questions ADD CONSTRAINT fk_questions_user_id FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- Add foreign key relationship between answers and profiles  
ALTER TABLE public.answers ADD CONSTRAINT fk_answers_user_id FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- Add foreign key relationship between comments and profiles
ALTER TABLE public.comments ADD CONSTRAINT fk_comments_user_id FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- Add foreign key relationship between votes and profiles
ALTER TABLE public.votes ADD CONSTRAINT fk_votes_user_id FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- Add foreign key relationships between answers/comments/votes and questions
ALTER TABLE public.answers ADD CONSTRAINT fk_answers_question_id FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE public.comments ADD CONSTRAINT fk_comments_answer_id FOREIGN KEY (answer_id) REFERENCES public.answers(id) ON DELETE CASCADE;

ALTER TABLE public.votes ADD CONSTRAINT fk_votes_question_id FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

ALTER TABLE public.votes ADD CONSTRAINT fk_votes_answer_id FOREIGN KEY (answer_id) REFERENCES public.answers(id) ON DELETE CASCADE;

-- Update default user role from 'student' to 'novice'
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'novice';

-- Update existing student users to novice
UPDATE public.profiles SET role = 'novice' WHERE role = 'student';