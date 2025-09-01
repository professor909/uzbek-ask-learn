import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Answer {
  id: string;
  content: string;
  question_id: string;
  user_id: string;
  language: string;
  is_best_answer: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
  profiles: {
    username: string | null;
    display_name: string | null;
    role: string | null;
    avatar_url: string | null;
  } | null;
  likes_count?: number;
  user_vote?: number;
}

export const useAnswers = (questionId: string) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAnswers = async () => {
    if (!questionId) return;
    
    try {
      setLoading(true);
      
      // Fetch answers with profiles
      const { data: answersData, error } = await supabase
        .from('answers')
        .select(`
          *,
          profiles (
            username,
            display_name,
            role,
            avatar_url
          )
        `)
        .eq('question_id', questionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get likes count and user votes for each answer
      const answersWithCounts = await Promise.all(
        answersData.map(async (answer) => {
          // Get likes count
          const { count: likesCount } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('answer_id', answer.id)
            .eq('vote_type', 1);

          // Get user vote if logged in
          let userVote = null;
          if (user) {
            const { data: voteData } = await supabase
              .from('votes')
              .select('vote_type')
              .eq('answer_id', answer.id)
              .eq('user_id', user.id)
              .single();
            userVote = voteData?.vote_type || null;
          }

          return {
            ...answer,
            likes_count: likesCount || 0,
            user_vote: userVote,
            profiles: answer.profiles || { username: null, display_name: null, role: null, avatar_url: null }
          } as Answer;
        })
      );

      setAnswers(answersWithCounts);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить ответы',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createAnswer = async (content: string, imageUrl?: string, language?: string) => {
    if (!user || !questionId) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо войти в систему',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Проверяем информацию о вопросе
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .select('user_id')
        .eq('id', questionId)
        .single();

      if (questionError) throw questionError;

      // Проверяем, что пользователь не автор вопроса
      if (questionData.user_id === user.id) {
        toast({
          title: 'Ошибка',
          description: 'Нельзя отвечать на собственные вопросы',
          variant: 'destructive',
        });
        return;
      }

      // Проверяем количество существующих ответов
      const { count: answersCount, error: countError } = await supabase
        .from('answers')
        .select('*', { count: 'exact', head: true })
        .eq('question_id', questionId);

      if (countError) throw countError;

      if (answersCount && answersCount >= 3) {
        toast({
          title: 'Ошибка',
          description: 'На вопрос уже дано максимальное количество ответов (3)',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase.from('answers').insert({
        content: content.trim(),
        question_id: questionId,
        user_id: user.id,
        language: language || 'ru',
        ...(imageUrl && { image_url: imageUrl })
      });

      if (error) throw error;

      toast({
        title: 'Успешно!',
        description: 'Ответ добавлен',
      });

      fetchAnswers(); // Refresh answers
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const voteOnAnswer = async (answerId: string, voteType: 1 | -1) => {
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо войти в систему',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('answer_id', answerId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote or delete if same vote
        if (existingVote.vote_type === voteType) {
          await supabase
            .from('votes')
            .delete()
            .eq('answer_id', answerId)
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('votes')
            .update({ vote_type: voteType })
            .eq('answer_id', answerId)
            .eq('user_id', user.id);
        }
      } else {
        // Create new vote
        await supabase.from('votes').insert({
          answer_id: answerId,
          user_id: user.id,
          vote_type: voteType,
        });
      }

      fetchAnswers(); // Refresh to update counts
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось проголосовать',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [questionId, user]);

  return {
    answers,
    loading,
    createAnswer,
    voteOnAnswer,
    refetch: fetchAnswers,
  };
};