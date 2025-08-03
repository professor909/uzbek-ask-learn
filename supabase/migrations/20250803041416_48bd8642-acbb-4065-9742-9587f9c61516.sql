-- Добавляем поле для экспертного статуса в профили
ALTER TABLE public.profiles 
ADD COLUMN is_expert BOOLEAN DEFAULT false,
ADD COLUMN expert_since TIMESTAMP WITH TIME ZONE,
ADD COLUMN expert_categories TEXT[] DEFAULT '{}';

-- Создаем функцию для установки экспертного статуса
CREATE OR REPLACE FUNCTION public.set_expert_status(
  user_id UUID,
  is_expert BOOLEAN,
  categories TEXT[] DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    is_expert = set_expert_status.is_expert,
    expert_since = CASE 
      WHEN set_expert_status.is_expert = true AND profiles.expert_since IS NULL 
      THEN now() 
      ELSE profiles.expert_since 
    END,
    expert_categories = CASE 
      WHEN set_expert_status.is_expert = true 
      THEN categories 
      ELSE '{}' 
    END
  WHERE id = set_expert_status.user_id;
END;
$$;

-- Создаем представление для экспертов
CREATE OR REPLACE VIEW public.experts AS
SELECT 
  p.id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.points,
  p.expert_since,
  p.expert_categories,
  COUNT(a.id) as answers_count,
  COUNT(CASE WHEN a.is_best_answer THEN 1 END) as best_answers_count
FROM public.profiles p
LEFT JOIN public.answers a ON p.id = a.user_id
WHERE p.is_expert = true
GROUP BY p.id, p.username, p.display_name, p.avatar_url, p.points, p.expert_since, p.expert_categories;

-- Включаем RLS для представления экспертов
ALTER VIEW public.experts SET (security_barrier = true);

-- Добавляем политику для просмотра экспертов
CREATE POLICY "Experts are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (is_expert = true OR auth.uid() = id);