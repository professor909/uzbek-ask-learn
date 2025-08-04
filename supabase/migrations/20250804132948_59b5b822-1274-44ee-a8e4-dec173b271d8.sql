-- Add image_url column to questions table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'image_url') THEN
        ALTER TABLE public.questions ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Add image_url column to answers table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'answers' AND column_name = 'image_url') THEN
        ALTER TABLE public.answers ADD COLUMN image_url TEXT;
    END IF;
END $$;