import { useLanguage } from './useLanguage';

export const useRankTranslation = () => {
  const { t } = useLanguage();

  const translateRank = (rank: string) => {
    switch (rank) {
      case 'novice':
        return t('rank.novice');
      case 'student':
        return t('rank.student');
      case 'expert':
        return t('rank.expert');
      case 'admin':
        return t('rank.admin');
      case 'blocked':
        return t('rank.blocked');
      default:
        return rank;
    }
  };

  const translateCategory = (category: string) => {
    return t(`category.${category}`);
  };

  const translateSortBy = (sortBy: string) => {
    switch (sortBy) {
      case 'newest':
        return t('questions.sortNewest');
      case 'oldest':
        return t('questions.sortOldest');
      case 'most_liked':
        return t('questions.sortMostLiked');
      case 'points_high':
        return t('questions.sortPointsHigh');
      case 'points_low':
        return t('questions.sortPointsLow');
      default:
        return sortBy;
    }
  };

  return { translateRank, translateCategory, translateSortBy };
};