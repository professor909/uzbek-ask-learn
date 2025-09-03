import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useAdminActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const deleteQuestion = async (questionId: string) => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // First check if user can delete (is owner or admin/expert)
      const { data: question } = await supabase
        .from('questions')
        .select('user_id')
        .eq('id', questionId)
        .single();

      if (!question) {
        toast({
          title: "Ошибка",
          description: "Вопрос не найден",
          variant: "destructive"
        });
        return false;
      }

      // Check permissions
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const canDelete = question.user_id === user.id || 
                       profile?.role === 'admin' || 
                       profile?.role === 'expert';

      if (!canDelete) {
        toast({
          title: "Нет прав",
          description: "У вас нет прав для удаления этого вопроса",
          variant: "destructive"
        });
        return false;
      }

      // Delete answers first (due to foreign key constraints)
      await supabase
        .from('answers')
        .delete()
        .eq('question_id', questionId);

      // Delete votes
      await supabase
        .from('votes')
        .delete()
        .eq('question_id', questionId);

      // Delete notifications
      await supabase
        .from('notifications')
        .delete()
        .eq('related_question_id', questionId);

      // Finally delete the question
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Вопрос удален"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить вопрос",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAnswer = async (answerId: string, questionId: string) => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Check permissions
      const { data: answer } = await supabase
        .from('answers')
        .select('user_id')
        .eq('id', answerId)
        .single();

      if (!answer) {
        toast({
          title: "Ошибка",
          description: "Ответ не найден",
          variant: "destructive"
        });
        return false;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const canDelete = profile?.role === 'admin' || 
                       profile?.role === 'expert';

      if (!canDelete) {
        toast({
          title: "Нет прав",
          description: "У вас нет прав для удаления этого ответа",
          variant: "destructive"
        });
        return false;
      }

      // Delete related data
      await supabase
        .from('comments')
        .delete()
        .eq('answer_id', answerId);

      await supabase
        .from('votes')
        .delete()
        .eq('answer_id', answerId);

      await supabase
        .from('notifications')
        .delete()
        .eq('related_answer_id', answerId);

      // Delete the answer
      const { error } = await supabase
        .from('answers')
        .delete()
        .eq('id', answerId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Ответ удален"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting answer:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить ответ",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async (userId: string, reason: string = '') => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Check if current user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          title: "Нет прав",
          description: "Только администраторы могут блокировать пользователей",
          variant: "destructive"
        });
        return false;
      }

      // Update user role to 'blocked'
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'blocked' })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Пользователь заблокирован"
      });
      
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось заблокировать пользователя",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const promoteToExpert = async (userId: string, categories: string[] = []) => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Check if current user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          title: "Нет прав",
          description: "Только администраторы могут назначать экспертов",
          variant: "destructive"
        });
        return false;
      }

      // Call the set_expert_status function
      const { error } = await supabase.rpc('set_expert_status', {
        user_id: userId,
        is_expert: true,
        categories: categories
      });

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Пользователь назначен экспертом"
      });
      
      return true;
    } catch (error) {
      console.error('Error promoting to expert:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось назначить экспертом",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteQuestion,
    deleteAnswer,
    blockUser,
    promoteToExpert,
    loading
  };
};