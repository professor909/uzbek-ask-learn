import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  points: number;
  language: string;
  is_expert: boolean;
  is_solved: boolean;
  created_at: string;
  user_id: string;
  image_url?: string;
  profiles: {
    username: string | null;
    display_name: string | null;
    role: string | null;
    avatar_url: string | null;
    is_expert: boolean | null;
    reputation_level: string | null;
  } | null;
  answers_count?: number;
  likes_count?: number;
  user_vote?: number;
}

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      // Fetch questions with profiles and counts
      const { data: questionsData, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles (
            username,
            display_name,
            role,
            avatar_url,
            is_expert,
            reputation_level
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!questionsData) {
        setQuestions([]);
        return;
      }

      // Get answer counts for each question
      const questionsWithCounts = await Promise.all(
        questionsData.map(async (question) => {
          try {
            // Get answer count
            const { count: answerCount } = await supabase
              .from('answers')
              .select('*', { count: 'exact', head: true })
              .eq('question_id', question.id);

            // Get likes count
            const { count: likesCount } = await supabase
              .from('votes')
              .select('*', { count: 'exact', head: true })
              .eq('question_id', question.id)
              .eq('vote_type', 1);

            // Get user vote if logged in
            let userVote = null;
            if (user) {
              try {
                const { data: voteData } = await supabase
                  .from('votes')
                  .select('vote_type')
                  .eq('question_id', question.id)
                  .eq('user_id', user.id)
                  .single();
                userVote = voteData?.vote_type || null;
              } catch (error) {
                // Игнорируем ошибки получения голосов - не критично
                userVote = null;
              }
            }

            return {
              ...question,
              answers_count: answerCount || 0,
              likes_count: likesCount || 0,
              user_vote: userVote,
              profiles: question.profiles || { username: null, display_name: null, role: null, avatar_url: null, is_expert: null, reputation_level: null }
            } as Question;
          } catch (error) {
            console.error('Error fetching counts for question:', question.id, error);
            // Возвращаем вопрос с нулевыми счетчиками в случае ошибки
            return {
              ...question,
              answers_count: 0,
              likes_count: 0,
              user_vote: null,
              profiles: question.profiles || { username: null, display_name: null, role: null, avatar_url: null, is_expert: null, reputation_level: null }
            } as Question;
          }
        })
      );

      setQuestions(questionsWithCounts);
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Ошибка подключения',
        description: 'Проверьте интернет-соединение и попробуйте снова',
        variant: 'destructive',
      });
      // Устанавливаем пустой массив вместо того, чтобы оставлять старые данные
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: {
    title: string;
    content: string;
    category: string;
    points: number;
    language: string;
    is_expert?: boolean;
    image_url?: string;
  }) => {
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо войти в систему',
        variant: 'destructive',
      });
      return;
    }

    // Check if user has enough points
    let profile: any = null;
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();
      
      profile = profileData;

      if (profile && profile.points < questionData.points) {
        toast({
          title: 'Недостаточно баллов',
          description: `У вас ${profile.points} баллов, а нужно ${questionData.points}. Отвечайте на вопросы, чтобы заработать баллы!`,
          variant: 'destructive',
        });
        return;
      }
    } catch (error) {
      console.error('Error checking user points:', error);
    }

    try {
      // First deduct points from user
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({ points: profile ? profile.points - questionData.points : 0 })
        .eq('id', user.id);

      if (pointsError) throw pointsError;

      const { error } = await supabase.from('questions').insert({
        ...questionData,
        user_id: user.id,
        is_expert: questionData.is_expert || false,
      });

      if (error) {
        // Rollback points if question creation failed
        await supabase
          .from('profiles')
          .update({ points: profile ? profile.points : 0 })
          .eq('id', user.id);
        throw error;
      }

      toast({
        title: 'Успешно!',
        description: 'Вопрос создан',
      });

      fetchQuestions(); // Refresh questions
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const voteOnQuestion = async (questionId: string, voteType: 1 | -1) => {
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
        .eq('question_id', questionId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote or delete if same vote
        if (existingVote.vote_type === voteType) {
          await supabase
            .from('votes')
            .delete()
            .eq('question_id', questionId)
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('votes')
            .update({ vote_type: voteType })
            .eq('question_id', questionId)
            .eq('user_id', user.id);
        }
      } else {
        // Create new vote
        await supabase.from('votes').insert({
          question_id: questionId,
          user_id: user.id,
          vote_type: voteType,
        });
      }

      fetchQuestions(); // Refresh to update counts
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось проголосовать',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []); // Убираем зависимость от user - загружаем вопросы для всех

  return {
    questions,
    loading,
    createQuestion,
    voteOnQuestion,
    refetch: fetchQuestions,
  };
};