import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Comment {
  id: string;
  content: string;
  answer_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string | null;
    display_name: string | null;
    role: string | null;
  };
}

export const useComments = (answerId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!answerId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            username,
            display_name,
            role
          )
        `)
        .eq('answer_id', answerId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(data || []);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить комментарии',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string) => {
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо войти в систему',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('comments').insert({
        content,
        answer_id: answerId,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: 'Успешно!',
        description: 'Комментарий добавлен',
      });

      fetchComments(); // Refresh comments
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Успешно!',
        description: 'Комментарий обновлен',
      });

      fetchComments(); // Refresh comments
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить комментарий',
        variant: 'destructive',
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Успешно!',
        description: 'Комментарий удален',
      });

      fetchComments(); // Refresh comments
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить комментарий',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [answerId]);

  return {
    comments,
    loading,
    createComment,
    updateComment,
    deleteComment,
    refetch: fetchComments,
  };
};