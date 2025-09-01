-- Allow assigning experts from Supabase SQL editor by permitting database superuser roles
CREATE OR REPLACE FUNCTION public.set_expert_status(user_id uuid, is_expert boolean, categories text[] DEFAULT '{}'::text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow when invoked from SQL editor as superuser roles
  IF current_user IN ('supabase_admin', 'postgres') THEN
    -- allowed
  ELSIF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Only administrators can set expert status';
  END IF;

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
  
  -- Refresh experts cache
  PERFORM public.refresh_experts_cache();
END;
$$;