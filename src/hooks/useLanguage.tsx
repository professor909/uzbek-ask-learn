import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ru' | 'uz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations = {
  ru: {
    // Header
    'search.placeholder': 'Поиск вопросов...',
    'header.login': 'Войти',
    'header.logout': 'Выйти',
    'header.points': 'баллов',
    'header.student': 'Студент',
    
    // Hero Section
    'hero.title': 'Образовательная платформа ForSkull',
    'hero.subtitle': 'Место, где студенты делятся знаниями и получают ответы на свои вопросы',
    'hero.slogan': 'Место, где знания встречают любопытство',
    'hero.exploreQuestions': 'Изучить вопросы',
    'hero.stats.activeQuestions': 'Активных вопросов',
    'hero.stats.participants': 'Участников',
    'hero.stats.experts': 'Экспертов',
    'hero.stats.solvedTasks': 'Решённых задач',
    'hero.actions.askQuestions': 'Задавайте вопросы',
    'hero.actions.askQuestionsDesc': 'Получите помощь от экспертов',
    'hero.actions.helpOthers': 'Помогайте другим',
    'hero.actions.helpOthersDesc': 'Делитесь своими знаниями',
    'hero.actions.earnPoints': 'Зарабатывайте баллы',
    'hero.actions.earnPointsDesc': 'Становитесь экспертом',
    
    // Questions
    'questions.title': 'Последние вопросы',
    'questions.subtitle': 'Найдите ответы на интересующие вас вопросы или поделитесь своими знаниями',
    'questions.askQuestion': 'Задать вопрос',
    'questions.createQuestion': 'Создать вопрос',
    'questions.searchPlaceholder': 'Поиск по вопросам...',
    'questions.sortBy': 'Сортировать по',
    'questions.sortNewest': 'Новые',
    'questions.sortOldest': 'Старые',
    'questions.sortMostLiked': 'Популярные',
    'questions.filterByCategory': 'Категория',
    'questions.allCategories': 'Все категории',
    'questions.noQuestions': 'Вопросы не найдены',
    'questions.noQuestionsDesc': 'Попробуйте изменить параметры поиска или создайте первый вопрос.',
    'questions.loading': 'Загрузка вопросов...',
    
    // Question Form
    'question.title': 'Заголовок',
    'question.titlePlaceholder': 'Введите заголовок вопроса...',
    'question.content': 'Описание',
    'question.contentPlaceholder': 'Опишите ваш вопрос подробно...',
    'question.category': 'Категория',
    'question.selectCategory': 'Выберите категорию',
    'question.points': 'Баллы',
    'question.selectPoints': 'Выберите баллы',
    'question.language': 'Язык',
    'question.attachImage': 'Прикрепить изображение',
    'question.cancel': 'Отмена',
    'question.create': 'Создать вопрос',
    'question.creating': 'Создание...',
    
    // Categories
    'category.math': 'Математика',
    'category.programming': 'Программирование',
    'category.physics': 'Физика',
    'category.chemistry': 'Химия',
    'category.biology': 'Биология',
    'category.history': 'История',
    'category.literature': 'Литература',
    'category.economics': 'Экономика',
    'category.other': 'Другое',
    
    // Answer Form
    'answer.placeholder': 'Напишите ваш ответ...',
    'answer.submit': 'Ответить',
    'answer.submitting': 'Отправка...',
    'answer.attachImage': 'Прикрепить изображение',
    
    // Time
    'time.now': 'только что',
    'time.minuteAgo': 'минуту назад',
    'time.minutesAgo': 'минут назад',
    'time.hourAgo': 'час назад',
    'time.hoursAgo': 'часов назад',
    'time.dayAgo': 'день назад',
    'time.daysAgo': 'дней назад',
    'time.weekAgo': 'неделю назад',
    'time.weeksAgo': 'недель назад',
    'time.monthAgo': 'месяц назад',
    'time.monthsAgo': 'месяцев назад',
    
    // Profile & Stats
    'profile.questions': 'Вопросов',
    'profile.answers': 'Ответов',
    'profile.likes': 'Лайков',
    'profile.bestAnswers': 'Лучших',
    'profile.reputation.expert': 'Эксперт',
    'profile.reputation.advanced': 'Продвинутый',
    'profile.reputation.intermediate': 'Опытный',
    'profile.reputation.novice': 'Новичок',

    // Common
    'common.yes': 'Да',
    'common.no': 'Нет',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
  },
  uz: {
    // Header
    'search.placeholder': "Savollarni qidirish...",
    'header.login': 'Kirish',
    'header.logout': 'Chiqish',
    'header.points': 'ball',
    'header.student': 'Talaba',
    
    // Hero Section
    'hero.title': 'ForSkull ta\'lim platformasi',
    'hero.subtitle': 'Talabalar bilim almashib, savollariga javob oladigan joy',
    'hero.slogan': 'Bilim va qiziqish uchrashgan joy',
    'hero.exploreQuestions': 'Savollarni ko\'rish',
    'hero.stats.activeQuestions': 'Faol savollar',
    'hero.stats.participants': 'Ishtirokchilar',
    'hero.stats.experts': 'Ekspertlar',
    'hero.stats.solvedTasks': 'Hal qilingan vazifalar',
    'hero.actions.askQuestions': 'Savol bering',
    'hero.actions.askQuestionsDesc': 'Ekspertlardan yordam oling',
    'hero.actions.helpOthers': 'Boshqalarga yordam bering',
    'hero.actions.helpOthersDesc': 'Bilimingiz bilan bo\'lishing',
    'hero.actions.earnPoints': 'Ball to\'plang',
    'hero.actions.earnPointsDesc': 'Ekspert bo\'ling',
    
    // Questions
    'questions.title': 'Oxirgi savollar',
    'questions.subtitle': 'Sizni qiziqtirgan savollarga javob toping yoki o\'z bilimingiz bilan bo\'lishing',
    'questions.askQuestion': 'Savol berish',
    'questions.createQuestion': 'Savol yaratish',
    'questions.searchPlaceholder': 'Savollar bo\'yicha qidiruv...',
    'questions.sortBy': 'Saralash',
    'questions.sortNewest': 'Yangi',
    'questions.sortOldest': 'Eski',
    'questions.sortMostLiked': 'Mashhur',
    'questions.filterByCategory': 'Kategoriya',
    'questions.allCategories': 'Barcha kategoriyalar',
    'questions.noQuestions': 'Savollar topilmadi',
    'questions.noQuestionsDesc': 'Qidiruv parametrlarini o\'zgartiring yoki birinchi savolni yarating.',
    'questions.loading': 'Savollar yuklanmoqda...',
    
    // Question Form
    'question.title': 'Sarlavha',
    'question.titlePlaceholder': 'Savol sarlavhasini kiriting...',
    'question.content': 'Tavsif',
    'question.contentPlaceholder': 'Savolingizni batafsil tasvirlab bering...',
    'question.category': 'Kategoriya',
    'question.selectCategory': 'Kategoriyani tanlang',
    'question.points': 'Balllar',
    'question.selectPoints': 'Balllarni tanlang',
    'question.language': 'Til',
    'question.attachImage': 'Rasm biriktirish',
    'question.cancel': 'Bekor qilish',
    'question.create': 'Savol yaratish',
    'question.creating': 'Yaratilmoqda...',
    
    // Categories
    'category.math': 'Matematika',
    'category.programming': 'Dasturlash',
    'category.physics': 'Fizika',
    'category.chemistry': 'Kimyo',
    'category.biology': 'Biologiya',
    'category.history': 'Tarix',
    'category.literature': 'Adabiyot',
    'category.economics': 'Iqtisodiyot',
    'category.other': 'Boshqa',
    
    // Answer Form
    'answer.placeholder': 'Javobingizni yozing...',
    'answer.submit': 'Javob berish',
    'answer.submitting': 'Jo\'natilmoqda...',
    'answer.attachImage': 'Rasm biriktirish',
    
    // Time
    'time.now': 'hozir',
    'time.minuteAgo': 'bir daqiqa oldin',
    'time.minutesAgo': 'daqiqa oldin',
    'time.hourAgo': 'bir soat oldin',
    'time.hoursAgo': 'soat oldin',
    'time.dayAgo': 'bir kun oldin',
    'time.daysAgo': 'kun oldin',
    'time.weekAgo': 'bir hafta oldin',
    'time.weeksAgo': 'hafta oldin',
    'time.monthAgo': 'bir oy oldin',
    'time.monthsAgo': 'oy oldin',
    
    // Profile & Stats
    'profile.questions': 'Savollar',
    'profile.answers': 'Javoblar',
    'profile.likes': 'Yoqtirishlar',
    'profile.bestAnswers': 'Eng yaxshi',
    'profile.reputation.expert': 'Ekspert',
    'profile.reputation.advanced': 'Ilg\'or',
    'profile.reputation.intermediate': 'Tajribali',
    'profile.reputation.novice': 'Yangi boshlovchi',

    // Common
    'common.yes': 'Ha',
    'common.no': "Yo'q",
    'common.save': 'Saqlash',
    'common.cancel': 'Bekor qilish',
    'common.loading': 'Yuklanmoqda...',
    'common.error': 'Xato',
    'common.success': 'Muvaffaqiyat',
  }
};

const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.substring(0, 2);
  return browserLang === 'uz' ? 'uz' : 'ru';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('forskull-language') as Language;
    return saved || detectBrowserLanguage();
  });

  useEffect(() => {
    localStorage.setItem('forskull-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ru']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};