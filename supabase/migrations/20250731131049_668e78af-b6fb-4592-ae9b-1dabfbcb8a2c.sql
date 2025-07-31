-- Check if foreign keys don't exist and add them
DO $$
BEGIN
    -- Add foreign key for questions if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'questions_user_id_fkey'
    ) THEN
        ALTER TABLE public.questions 
        ADD CONSTRAINT questions_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
        ON DELETE CASCADE;
    END IF;

    -- Add foreign key for answers if it doesn't exist  
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'answers_user_id_fkey'
    ) THEN
        ALTER TABLE public.answers 
        ADD CONSTRAINT answers_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
        ON DELETE CASCADE;
    END IF;

    -- Add foreign key for votes if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'votes_user_id_fkey'
    ) THEN
        ALTER TABLE public.votes 
        ADD CONSTRAINT votes_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
        ON DELETE CASCADE;
    END IF;

    -- Add foreign key for answers to questions if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'answers_question_id_fkey'
    ) THEN
        ALTER TABLE public.answers 
        ADD CONSTRAINT answers_question_id_fkey 
        FOREIGN KEY (question_id) REFERENCES public.questions(id) 
        ON DELETE CASCADE;
    END IF;

    -- Add foreign key for comments to answers if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'comments_answer_id_fkey'
    ) THEN
        ALTER TABLE public.comments 
        ADD CONSTRAINT comments_answer_id_fkey 
        FOREIGN KEY (answer_id) REFERENCES public.answers(id) 
        ON DELETE CASCADE;
    END IF;

    -- Add foreign key for votes to questions if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'votes_question_id_fkey'
    ) THEN
        ALTER TABLE public.votes 
        ADD CONSTRAINT votes_question_id_fkey 
        FOREIGN KEY (question_id) REFERENCES public.questions(id) 
        ON DELETE CASCADE;
    END IF;

    -- Add foreign key for votes to answers if it doesn't exist  
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'votes_answer_id_fkey'
    ) THEN
        ALTER TABLE public.votes 
        ADD CONSTRAINT votes_answer_id_fkey 
        FOREIGN KEY (answer_id) REFERENCES public.answers(id) 
        ON DELETE CASCADE;
    END IF;
END $$;