-- Create function to automatically mark questions as solved when they have 3+ answers
CREATE OR REPLACE FUNCTION public.update_question_solved_status()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  -- Update is_solved status for the question based on answer count
  UPDATE questions 
  SET is_solved = (
    SELECT COUNT(*) >= 3
    FROM answers 
    WHERE answers.question_id = COALESCE(NEW.question_id, OLD.question_id)
  )
  WHERE id = COALESCE(NEW.question_id, OLD.question_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for INSERT on answers
CREATE OR REPLACE TRIGGER trigger_update_question_solved_on_answer_insert
  AFTER INSERT ON answers
  FOR EACH ROW
  EXECUTE FUNCTION update_question_solved_status();

-- Create trigger for DELETE on answers  
CREATE OR REPLACE TRIGGER trigger_update_question_solved_on_answer_delete
  AFTER DELETE ON answers
  FOR EACH ROW
  EXECUTE FUNCTION update_question_solved_status();

-- Update existing questions to mark them as solved if they have 3+ answers
UPDATE questions 
SET is_solved = true 
WHERE id IN (
  SELECT q.id 
  FROM questions q
  JOIN (
    SELECT question_id, COUNT(*) as answer_count
    FROM answers 
    GROUP BY question_id
    HAVING COUNT(*) >= 3
  ) a ON q.id = a.question_id
  WHERE q.is_solved = false
);