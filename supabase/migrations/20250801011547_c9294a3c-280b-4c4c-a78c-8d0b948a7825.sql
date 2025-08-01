-- Add language field to questions table
ALTER TABLE public.questions 
ADD COLUMN language TEXT NOT NULL DEFAULT 'ru';

-- Add language field to answers table  
ALTER TABLE public.answers
ADD COLUMN language TEXT NOT NULL DEFAULT 'ru';

-- Create images storage bucket for question and answer images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create storage policies for images
CREATE POLICY "Images are viewable by everyone" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY "Users can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'images' AND auth.uid() IS NOT NULL);