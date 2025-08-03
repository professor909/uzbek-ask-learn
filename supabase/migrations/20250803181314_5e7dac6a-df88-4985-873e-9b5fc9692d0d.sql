-- Create notifications table for user notifications
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('new_answer', 'question_liked', 'answer_liked', 'best_answer', 'expert_promoted')),
  title text NOT NULL,
  content text NOT NULL,
  related_question_id uuid,
  related_answer_id uuid,
  related_user_id uuid,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for notifications timestamps
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to create notification when answer is added
CREATE OR REPLACE FUNCTION public.create_answer_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Get question author
  INSERT INTO public.notifications (user_id, type, title, content, related_question_id, related_answer_id, related_user_id)
  SELECT 
    q.user_id,
    'new_answer',
    'Новый ответ на ваш вопрос',
    'На ваш вопрос "' || SUBSTRING(q.title, 1, 50) || '..." поступил новый ответ',
    NEW.question_id,
    NEW.id,
    NEW.user_id
  FROM public.questions q
  WHERE q.id = NEW.question_id
    AND q.user_id != NEW.user_id; -- Don't notify if user answers own question
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new answer notifications
CREATE TRIGGER notify_new_answer
  AFTER INSERT ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.create_answer_notification();

-- Add user role management for admins
CREATE OR REPLACE FUNCTION public.can_manage_users()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'expert'), false);
$$;