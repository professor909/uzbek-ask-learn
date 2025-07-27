import QuestionCard from "./QuestionCard";

const sampleQuestions = [
  {
    id: 1,
    title: "Как решить квадратное уравнение x² + 5x + 6 = 0?",
    content: "Помогите пожалуйста решить это квадратное уравнение. Я знаю формулу дискриминанта, но путаюсь в вычислениях. Можете объяснить пошагово?",
    category: "Математика",
    points: 50,
    answersCount: 2,
    likesCount: 15,
    isExpert: false,
    authorName: "Алексей Петров",
    authorRank: "Ученик",
    timeAgo: "2 часа назад",
    isBestAnswer: false
  },
  {
    id: 2,
    title: "Объясните закон сохранения энергии в физике",
    content: "Изучаю физику и не могу понять принцип работы закона сохранения энергии. Можете привести простые примеры из жизни?",
    category: "Физика",
    points: 75,
    answersCount: 3,
    likesCount: 23,
    isExpert: true,
    authorName: "Мария Иванова",
    authorRank: "Студент",
    timeAgo: "4 часа назад",
    isBestAnswer: true
  },
  {
    id: 3,
    title: "Разница между Present Simple и Present Continuous?",
    content: "Постоянно путаю эти времена в английском языке. Когда какое использовать? Есть ли простые правила для запоминания?",
    category: "Языки",
    points: 30,
    answersCount: 1,
    likesCount: 8,
    isExpert: false,
    authorName: "Елена Козлова",
    authorRank: "Бакалавр",
    timeAgo: "6 часов назад",
    isBestAnswer: false
  },
  {
    id: 4,
    title: "Основные характеристики романтизма в литературе",
    content: "Готовлюсь к экзамену по литературе. Нужно понять основные черты романтизма. Какие произведения лучше всего отражают этот стиль?",
    category: "Литература",
    points: 40,
    answersCount: 2,
    likesCount: 12,
    isExpert: true,
    authorName: "Дмитрий Смирнов",
    authorRank: "Магистр",
    timeAgo: "8 часов назад",
    isBestAnswer: false
  },
  {
    id: 5,
    title: "Как найти производную сложной функции?",
    content: "Изучаю математический анализ. Не понимаю как правильно находить производную когда функция состоит из нескольких частей. Помогите разобраться с правилом цепочки.",
    category: "Математика",
    points: 60,
    answersCount: 1,
    likesCount: 18,
    isExpert: false,
    authorName: "Анна Волкова",
    authorRank: "Студент",
    timeAgo: "12 часов назад",
    isBestAnswer: false
  }
];

const QuestionFeed = () => {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Последние вопросы</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Сортировать:</span>
          <select className="text-sm bg-background border border-border rounded-md px-3 py-1">
            <option>Новые</option>
            <option>Популярные</option>
            <option>Без ответов</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {sampleQuestions.map((question) => (
          <QuestionCard key={question.id} {...question} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-6">
        <button className="text-primary hover:text-primary-glow font-medium transition-colors">
          Загрузить еще вопросы...
        </button>
      </div>
    </div>
  );
};

export default QuestionFeed;