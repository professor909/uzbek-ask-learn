import { useRankTranslation } from './useRankTranslation';

interface UserDisplayInfo {
  role: string;
  isExpert: boolean;
  reputationLevel: string;
}

export const useUserDisplay = () => {
  const { translateRank } = useRankTranslation();

  const getUserDisplayRank = (user: UserDisplayInfo) => {
    // Admins show their admin role
    if (user.role === 'admin') {
      return translateRank('admin');
    }
    
    // Experts show their expert role
    if (user.isExpert) {
      return translateRank('expert');
    }
    
    // Regular users show their points-based rank
    return translateRank(user.reputationLevel);
  };

  const getUserRankColor = (user: UserDisplayInfo) => {
    // Admins get special red color
    if (user.role === 'admin') {
      return 'text-destructive';
    }
    
    // Experts get purple color
    if (user.isExpert) {
      return 'text-expert';
    }
    
    // Regular users get colors based on their rank
    switch (user.reputationLevel) {
      case 'academician':
        return 'text-accent-warm';
      case 'dsc':
        return 'text-purple-600';
      case 'phd':
        return 'text-blue-600';
      case 'master':
        return 'text-green-600';
      case 'student':
        return 'text-primary';
      case 'learner':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  return { getUserDisplayRank, getUserRankColor };
};