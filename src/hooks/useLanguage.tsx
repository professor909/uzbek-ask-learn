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
    'category.algebra': 'Алгебра',
    'category.english': 'Английский язык',
    'category.astronomy': 'Астрономия',
    'category.biology': 'Биология',
    'category.worldHistory': 'Всемирная история',
    'category.geography': 'География',
    'category.geometry': 'Геометрия',
    'category.naturalScience': 'Естественные науки',
    'category.informatics': 'Информатика',
    'category.uzbekHistory': 'История Узбекистана',
    'category.literature': 'Литература',
    'category.math': 'Математика',
    'category.russian': 'Русский язык',
    'category.uzbek': 'Узбекский язык',
    'category.physics': 'Физика',
    'category.chemistry': 'Химия',
    'category.economics': 'Экономика',
    'category.other': 'Другое',
    
    // Sidebar
    'sidebar.statistics': 'Статистика',
    'sidebar.questions': 'Вопросов',
    'sidebar.activeUsers': 'Активных пользователей',
    'sidebar.popularCategories': 'Популярные категории',
    'sidebar.topUsers': 'Топ участники месяца',
    'sidebar.points': 'баллов',
    'sidebar.answers': 'ответов',
    'sidebar.categories': 'Категории',
    'sidebar.quickStats': 'Ответов',
    'sidebar.noUsers': 'Пока нет пользователей',
    
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

    // Footer
    'footer.terms': 'Условия пользования',
    'footer.copyright': 'Авторское право',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.careers': 'Вакансии',
    'footer.about': 'О нас',
    'footer.mobileApps': 'Мобильные приложения',
    'footer.downloadOn': 'Скачать в',
    'footer.ourMission': 'Наша миссия',
    'footer.allRightsReserved': 'Все права защищены',
    'footer.educationalPlatform': 'Образовательная платформа для студентов',
    'footer.slogan': 'Образование — это самое мощное оружие, которое можно использовать, чтобы изменить мир',

    // Common
    'common.yes': 'Да',
    'common.no': 'Нет',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    
    // Terms of Service
    'terms.title': 'Условия использования',
    'terms.acceptance.title': 'Принятие условий',
    'terms.acceptance.content': 'Используя платформу ForSkull, вы соглашаетесь с данными условиями использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наш сервис.',
    'terms.services.title': 'Описание услуг',
    'terms.services.content': 'ForSkull предоставляет образовательную платформу для обмена знаниями, где пользователи могут задавать вопросы и получать ответы от экспертов в различных областях.',
    'terms.userConduct.title': 'Поведение пользователей',
    'terms.userConduct.content': 'Пользователи обязуются использовать платформу исключительно в образовательных целях, не нарушать авторские права, не публиковать неприемлемый контент и относиться с уважением к другим участникам сообщества.',
    'terms.intellectualProperty.title': 'Интеллектуальная собственность',
    'terms.intellectualProperty.content': 'Весь контент, размещенный на платформе, включая вопросы, ответы и материалы, принадлежит их авторам. ForSkull получает лицензию на использование этого контента для функционирования платформы.',
    'terms.limitation.title': 'Ограничение ответственности',
    'terms.limitation.content': 'ForSkull не несет ответственности за точность информации, предоставляемой пользователями. Использование информации осуществляется на собственный риск пользователя.',
    'terms.changes.title': 'Изменения условий',
    'terms.changes.content': 'ForSkull оставляет за собой право изменять данные условия в любое время. Пользователи будут уведомлены о существенных изменениях.',
    'terms.lastUpdated': 'Последнее обновление',
    
    // Privacy Policy
    'privacy.title': 'Политика конфиденциальности',
    'privacy.collection.title': 'Сбор информации',
    'privacy.collection.content': 'Мы собираем информацию, которую вы предоставляете при регистрации, создании профиля и использовании наших услуг, включая имя, email, образовательную информацию и контент, который вы создаете.',
    'privacy.usage.title': 'Использование информации',
    'privacy.usage.content': 'Собранная информация используется для предоставления и улучшения наших услуг, персонализации опыта, обеспечения безопасности платформы и связи с пользователями.',
    'privacy.sharing.title': 'Обмен информацией',
    'privacy.sharing.content': 'Мы не продаем и не передаем вашу личную информацию третьим лицам без вашего согласия, за исключением случаев, предусмотренных законом или необходимых для функционирования сервиса.',
    'privacy.security.title': 'Безопасность данных',
    'privacy.security.content': 'Мы применяем современные технологии и процедуры для защиты ваших данных от несанкционированного доступа, изменения, раскрытия или уничтожения.',
    'privacy.rights.title': 'Ваши права',
    'privacy.rights.content': 'Вы имеете право получить доступ к своим данным, исправить их, удалить или ограничить их обработку. Для реализации этих прав свяжитесь с нами.',
    'privacy.contact.title': 'Контактная информация',
    'privacy.contact.content': 'По вопросам конфиденциальности обращайтесь к нам по адресу privacy@forskull.com',
    'privacy.lastUpdated': 'Последнее обновление',
    
    // Copyright
    'copyright.title': 'Авторские права',
    'copyright.ownership.title': 'Права собственности',
    'copyright.ownership.content': 'Все материалы на платформе ForSkull, включая дизайн, код, логотипы и контент, защищены авторским правом и принадлежат ForSkull или их соответствующим владельцам.',
    'copyright.userContent.title': 'Пользовательский контент',
    'copyright.userContent.content': 'Размещая контент на платформе, вы сохраняете права на свой контент, но предоставляете ForSkull неисключительную лицензию на его использование в рамках функционирования платформы.',
    'copyright.infringement.title': 'Нарушение авторских прав',
    'copyright.infringement.content': 'ForSkull уважает права интеллектуальной собственности и оперативно реагирует на сообщения о нарушениях авторских прав в соответствии с действующим законодательством.',
    'copyright.procedure.title': 'Процедура подачи жалоб',
    'copyright.procedure.content': 'Если вы считаете, что ваши авторские права нарушены, направьте письменное уведомление с подробным описанием нарушения на адрес copyright@forskull.com',
    'copyright.contact.title': 'Контактная информация',
    'copyright.contact.content': 'По всем вопросам авторского права обращайтесь: copyright@forskull.com',
    'copyright.allRightsReserved': 'Все права защищены',
    
    // Careers
    'careers.title': 'Карьера в ForSkull',
    'careers.subtitle': 'Присоединяйтесь к нашей команде и помогайте создавать будущее образования',
    'careers.culture.title': 'Наша культура',
    'careers.culture.content': 'В ForSkull мы ценим инновации, сотрудничество и стремление к совершенству. Наша команда состоит из увлеченных профессионалов, которые разделяют миссию демократизации образования и создания доступной платформы для обмена знаниями.',
    'careers.openPositions': 'Открытые вакансии',
    'careers.positions.frontend.title': 'Frontend разработчик',
    'careers.positions.frontend.description': 'Создание интуитивного пользовательского интерфейса для образовательной платформы',
    'careers.positions.backend.title': 'Backend разработчик',
    'careers.positions.backend.description': 'Разработка надежной серверной архитектуры и API для обработки данных',
    'careers.positions.designer.title': 'UI/UX дизайнер',
    'careers.positions.designer.description': 'Проектирование пользовательского опыта и создание привлекательных интерфейсов',
    'careers.locations.remote': 'Удаленно',
    'careers.types.fullTime': 'Полная занятость',
    'careers.types.partTime': 'Частичная занятость',
    'careers.requiredSkills': 'Требуемые навыки',
    'careers.apply': 'Откликнуться',
    'careers.benefits.title': 'Наши преимущества',
    'careers.benefits.flexible.title': 'Гибкий график',
    'careers.benefits.flexible.description': 'Работайте в удобное для вас время',
    'careers.benefits.growth.title': 'Профессиональный рост',
    'careers.benefits.growth.description': 'Возможности обучения и развития',
    'careers.benefits.competitive.title': 'Конкурентная зарплата',
    'careers.benefits.competitive.description': 'Справедливая оплата труда',
    'careers.benefits.team.title': 'Отличная команда',
    'careers.benefits.team.description': 'Работа с профессионалами',
    'careers.contact.title': 'Не нашли подходящую вакансию?',
    'careers.contact.description': 'Отправьте нам свое резюме, и мы свяжемся с вами',
    'careers.contact.button': 'Связаться с нами',
    
    // About
    'about.title': 'О ForSkull',
    'about.subtitle': 'Мы создаем образовательную платформу, которая объединяет учащихся и экспертов со всего мира',
    'about.mission.title': 'Наша миссия',
    'about.mission.content': 'Демократизировать образование, предоставляя каждому доступ к качественным знаниям и экспертизе через инновационную платформу вопросов и ответов.',
    'about.story.title': 'Наша история',
    'about.story.paragraph1': 'ForSkull была основана в 2024 году группой энтузиастов образования, которые видели необходимость в более доступной и интерактивной платформе для обмена знаниями.',
    'about.story.paragraph2': 'Мы начали с простой идеи: соединить тех, кто ищет знания, с теми, кто готов ими поделиться. За короткое время наша платформа выросла в активное сообщество учащихся и экспертов.',
    'about.story.paragraph3': 'Сегодня ForSkull продолжает развиваться, внедряя новые технологии и расширяя возможности для качественного образования.',
    'about.values.title': 'Наши ценности',
    'about.values.mission.title': 'Качество',
    'about.values.mission.description': 'Мы стремимся к высочайшему качеству контента и взаимодействия',
    'about.values.passion.title': 'Доступность',
    'about.values.passion.description': 'Образование должно быть доступно каждому, независимо от обстоятельств',
    'about.values.innovation.title': 'Инновации',
    'about.values.innovation.description': 'Мы используем передовые технологии для улучшения обучения',
    'about.values.community.title': 'Сообщество',
    'about.values.community.description': 'Мы строим сильное и поддерживающее образовательное сообщество',
    'about.team.title': 'Наша команда',
    'about.team.ceo.position': 'Генеральный директор',
    'about.team.ceo.description': 'Визионер и стратег с многолетним опытом в сфере образования',
    'about.team.cto.position': 'Технический директор',
    'about.team.cto.description': 'Эксперт в области технологий с фокусом на образовательные решения',
    'about.team.lead.position': 'Ведущий разработчик',
    'about.team.lead.description': 'Талантливый инженер, создающий надежную и масштабируемую платформу',
    'about.stats.title': 'Наши достижения',
    'about.stats.users': 'Активных пользователей',
    'about.stats.questions': 'Заданных вопросов',
    'about.stats.experts': 'Экспертов',
    'about.stats.satisfaction': 'Удовлетворенность пользователей',
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
    'category.algebra': 'Algebra',
    'category.english': 'Ingliz tili',
    'category.astronomy': 'Astronomiya',
    'category.biology': 'Biologiya',
    'category.worldHistory': 'Jahon tarixi',
    'category.geography': 'Geografiya',
    'category.geometry': 'Geometriya',
    'category.naturalScience': 'Tabiiy fanlar',
    'category.informatics': 'Informatika',
    'category.uzbekHistory': 'O\'zbekiston tarixi',
    'category.literature': 'Adabiyot',
    'category.math': 'Matematika',
    'category.russian': 'Rus tili',
    'category.uzbek': 'O\'zbek tili',
    'category.physics': 'Fizika',
    'category.chemistry': 'Kimyo',
    'category.economics': 'Iqtisodiyot',
    'category.other': 'Boshqa',
    
    // Sidebar
    'sidebar.statistics': 'Statistika',
    'sidebar.questions': 'Savollar',
    'sidebar.activeUsers': 'Faol foydalanuvchilar',
    'sidebar.popularCategories': 'Mashhur kategoriyalar',
    'sidebar.topUsers': 'Oyning eng yaxshi ishtirokchilari',
    'sidebar.points': 'ball',
    'sidebar.answers': 'javob',
    'sidebar.categories': 'Kategoriyalar',
    'sidebar.quickStats': 'Javoblar',
    'sidebar.noUsers': 'Hozircha foydalanuvchilar yo\'q',
    
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

    // Footer
    'footer.terms': 'Foydalanish shartlari',
    'footer.copyright': 'Mualliflik huquqi',
    'footer.privacy': 'Maxfiylik siyosati',
    'footer.careers': 'Ish o\'rinlari',
    'footer.about': 'Biz haqimizda',
    'footer.mobileApps': 'Mobil ilovalar',
    'footer.downloadOn': 'Yuklab olish',
    'footer.ourMission': 'Bizning missiyamiz',
    'footer.allRightsReserved': 'Barcha huquqlar himoyalangan',
    'footer.educationalPlatform': 'Talabalar uchun ta\'lim platformasi',
    'footer.slogan': 'Ta\'lim - dunyoni o\'zgartirish uchun ishlatilishi mumkin bo\'lgan eng kuchli quroldir',

    // Common
    'common.yes': 'Ha',
    'common.no': "Yo'q",
    'common.save': 'Saqlash',
    'common.cancel': 'Bekor qilish',
    'common.loading': 'Yuklanmoqda...',
    'common.error': 'Xato',
    'common.success': 'Muvaffaqiyat',
    
    // Terms of Service
    'terms.title': 'Foydalanish shartlari',
    'terms.acceptance.title': 'Shartlarni qabul qilish',
    'terms.acceptance.content': "ForSkull platformasidan foydalanib, siz ushbu foydalanish shartlarini qabul qilasiz. Agar siz ushbu shartlarga rozi bo'lmasangiz, iltimos, xizmatimizdan foydalanmang.",
    'terms.services.title': 'Xizmatlar tavsifi',
    'terms.services.content': "ForSkull bilim almashish uchun ta'lim platformasini taqdim etadi, bu yerda foydalanuvchilar savollar berib, turli sohalardagi mutaxassislardan javoblar olishlari mumkin.",
    'terms.userConduct.title': 'Foydalanuvchilar xulqi',
    'terms.userConduct.content': "Foydalanuvchilar platformadan faqat ta'lim maqsadlarida foydalanishni, mualliflik huquqlarini buzmaslikni, nomaqbul kontent chop etmaslikni va jamiyat a'zolariga hurmat bilan munosabatda bo'lishni majburiyat sifatida olishadi.",
    'terms.intellectualProperty.title': 'Intellektual mulk',
    'terms.intellectualProperty.content': "Platformada joylashtirilgan barcha kontent, jumladan savollar, javoblar va materiallar ularning mualliflariga tegishli. ForSkull ushbu kontentni platformaning ishlashi uchun foydalanish litsenziyasini oladi.",
    'terms.limitation.title': "Javobgarlik cheklanishi",
    'terms.limitation.content': "ForSkull foydalanuvchilar tomonidan taqdim etilgan ma'lumotlarning to'g'riligi uchun javobgar emas. Ma'lumotlardan foydalanish foydalanuvchining o'z xavfida amalga oshiriladi.",
    'terms.changes.title': 'Shartlarni o\'zgartirish',
    'terms.changes.content': "ForSkull ushbu shartlarni istalgan vaqtda o'zgartirish huquqini o'zida saqlab qoladi. Foydalanuvchilar muhim o'zgarishlar haqida xabardor qilinadi.",
    'terms.lastUpdated': "So'nggi yangilanish",
    
    // Privacy Policy
    'privacy.title': 'Maxfiylik siyosati',
    'privacy.collection.title': "Ma'lumot yig'ish",
    'privacy.collection.content': "Biz siz ro'yxatdan o'tish, profil yaratish va xizmatlarimizdan foydalanish vaqtida taqdim etgan ma'lumotlaringizni, jumladan ism, email, ta'lim ma'lumotlari va yaratgan kontentingizni yig'amiz.",
    'privacy.usage.title': "Ma'lumotlardan foydalanish",
    'privacy.usage.content': "Yig'ilgan ma'lumotlar xizmatlarimizni taqdim etish va yaxshilash, tajribani shaxsiylashtirish, platforma xavfsizligini ta'minlash va foydalanuvchilar bilan aloqa o'rnatish uchun ishlatiladi.",
    'privacy.sharing.title': "Ma'lumotlar almashish",
    'privacy.sharing.content': "Biz sizning shaxsiy ma'lumotlaringizni roziligingizsiz uchinchi shaxslarga sotmaymiz va uzatmaymiz, qonun tomonidan nazarda tutilgan yoki xizmat faoliyati uchun zarur bo'lgan holatlar bundan mustasno.",
    'privacy.security.title': "Ma'lumotlar xavfsizligi",
    'privacy.security.content': "Biz ma'lumotlaringizni ruxsatsiz kirish, o'zgartirish, oshkor qilish yoki yo'q qilishdan himoya qilish uchun zamonaviy texnologiyalar va protseduralarni qo'llaymiz.",
    'privacy.rights.title': 'Sizning huquqlaringiz',
    'privacy.rights.content': "Siz o'z ma'lumotlaringizga kirish, ularni to'g'rilash, o'chirish yoki ularni qayta ishlashni cheklash huquqiga egasiz. Ushbu huquqlarni amalga oshirish uchun biz bilan bog'laning.",
    'privacy.contact.title': 'Aloqa ma\'lumotlari',
    'privacy.contact.content': 'Maxfiylik masalalari bo\'yicha bizga privacy@forskull.com manziliga murojaat qiling',
    'privacy.lastUpdated': "So'nggi yangilanish",
    
    // Copyright
    'copyright.title': 'Mualliflik huquqlari',
    'copyright.ownership.title': 'Mulkchilik huquqlari',
    'copyright.ownership.content': "ForSkull platformasidagi barcha materiallar, jumladan dizayn, kod, logotiplar va kontent mualliflik huquqi bilan himoyalangan va ForSkull yoki ularning tegishli egalariga tegishli.",
    'copyright.userContent.title': 'Foydalanuvchi kontenti',
    'copyright.userContent.content': "Platformaga kontent joylashtirib, siz o'z kontentingizga huquqlaringizni saqlab qolasiz, lekin ForSkull-ga platforma faoliyati doirasida undan foydalanish uchun eksklyuziv bo'lmagan litsenziya berasiz.",
    'copyright.infringement.title': 'Mualliflik huquqlarini buzish',
    'copyright.infringement.content': "ForSkull intellektual mulk huquqlarini hurmat qiladi va amaldagi qonunchilikka muvofiq mualliflik huquqlarini buzish haqidagi xabarlarga tezkor javob beradi.",
    'copyright.procedure.title': 'Shikoyat berish tartibi',
    'copyright.procedure.content': "Agar sizning mualliflik huquqlaringiz buzilgan deb hisoblasangiz, buzilishning batafsil tavsifi bilan yozma xabar copyright@forskull.com manziliga yuboring",
    'copyright.contact.title': 'Aloqa ma\'lumotlari',
    'copyright.contact.content': 'Mualliflik huquqi bo\'yicha barcha savollar uchun: copyright@forskull.com',
    'copyright.allRightsReserved': 'Barcha huquqlar himoyalangan',
    
    // Careers
    'careers.title': 'ForSkull-da martaba',
    'careers.subtitle': "Bizning jamoamizga qo'shiling va ta'limning kelajagini yaratishga yordam bering",
    'careers.culture.title': 'Bizning madaniyatimiz',
    'careers.culture.content': "ForSkull-da biz innovatsiyalar, hamkorlik va mukammallikka intilishni qadrlaymiz. Bizning jamoamiz ta'limni demokratlashtirish va bilim almashish uchun ochiq platforma yaratish missiyasini baham ko'radigan ishtiyoqli mutaxassislardan iborat.",
    'careers.openPositions': 'Ochiq vakansiyalar',
    'careers.positions.frontend.title': 'Frontend dasturchi',
    'careers.positions.frontend.description': "Ta'lim platformasi uchun intuitiv foydalanuvchi interfeysini yaratish",
    'careers.positions.backend.title': 'Backend dasturchi',
    'careers.positions.backend.description': "Ma'lumotlarni qayta ishlash uchun ishonchli server arxitekturasi va API yaratish",
    'careers.positions.designer.title': 'UI/UX dizayner',
    'careers.positions.designer.description': 'Foydalanuvchi tajribasini loyihalash va jozibali interfeyslarni yaratish',
    'careers.locations.remote': 'Masofaviy',
    'careers.types.fullTime': "To'liq bandlik",
    'careers.types.partTime': 'Qisman bandlik',
    'careers.requiredSkills': 'Talab qilinadigan ko\'nikmalar',
    'careers.apply': 'Murojaat qilish',
    'careers.benefits.title': 'Bizning afzalliklarimiz',
    'careers.benefits.flexible.title': 'Moslashuvchan jadval',
    'careers.benefits.flexible.description': 'O\'zingizga qulay vaqtda ishlang',
    'careers.benefits.growth.title': 'Kasbiy o\'sish',
    'careers.benefits.growth.description': "O'qish va rivojlanish imkoniyatlari",
    'careers.benefits.competitive.title': 'Raqobatbardosh maosh',
    'careers.benefits.competitive.description': "Adolatli mehnat haqi to'lash",
    'careers.benefits.team.title': 'Ajoyib jamoa',
    'careers.benefits.team.description': 'Mutaxassislar bilan ishlash',
    'careers.contact.title': 'Mos vakansiya topa olmadingizmi?',
    'careers.contact.description': 'Bizga rezyumengizni yuboring, biz siz bilan bog\'lanamiz',
    'careers.contact.button': 'Biz bilan bog\'laning',
    
    // About
    'about.title': 'ForSkull haqida',
    'about.subtitle': "Biz butun dunyo bo'ylab talabalar va mutaxassislarni birlashtiruvchi ta'lim platformasini yaratmoqdamiz",
    'about.mission.title': 'Bizning missiyamiz',
    'about.mission.content': "Innovatsion savol-javob platformasi orqali har kimga sifatli bilim va ekspertizaga kirish imkonini berish orqali ta'limni demokratlashtirish.",
    'about.story.title': 'Bizning hikoyamiz',
    'about.story.paragraph1': "ForSkull 2024 yilda bilim almashish uchun yanada ochiq va interaktiv platforma zarurligini ko'rgan ta'lim ishtiyoqchilari guruhi tomonidan tashkil etilgan.",
    'about.story.paragraph2': "Biz oddiy g'oya bilan boshladik: bilim izlovchilarni ularni baham ko'rishga tayyor bo'lganlar bilan bog'lash. Qisqa vaqt ichida bizning platformamiz talabalar va mutaxassislarning faol hamjamiyatiga aylandi.",
    'about.story.paragraph3': "Bugun ForSkull yangi texnologiyalarni joriy etib, sifatli ta'lim imkoniyatlarini kengaytirib, rivojlanishda davom etmoqda.",
    'about.values.title': 'Bizning qadriyatlarimiz',
    'about.values.mission.title': 'Sifat',
    'about.values.mission.description': 'Biz kontent va o\'zaro munosabatlarning eng yuqori sifatiga intilamiz',
    'about.values.passion.title': 'Ochiqlik',
    'about.values.passion.description': "Ta'lim vaziyatdan qat'i nazar, har kimga ochiq bo'lishi kerak",
    'about.values.innovation.title': 'Innovatsiyalar',
    'about.values.innovation.description': "Biz o'qishni yaxshilash uchun ilg'or texnologiyalardan foydalanamiz",
    'about.values.community.title': 'Jamiyat',
    'about.values.community.description': "Biz kuchli va qo'llab-quvvatlovchi ta'lim hamjamiyatini quramiz",
    'about.team.title': 'Bizning jamoamiz',
    'about.team.ceo.position': 'Bosh direktor',
    'about.team.ceo.description': "Ta'lim sohasida ko'p yillik tajribaga ega vizioner va strateg",
    'about.team.cto.position': 'Texnik direktor',
    'about.team.cto.description': "Ta'lim yechimlari diqqat markazida bo'lgan texnologiyalar sohasidagi ekspert",
    'about.team.lead.position': 'Yetakchi dasturchi',
    'about.team.lead.description': 'Ishonchli va kengaytiriladigan platforma yaratuvchi iqtidorli muhandis',
    'about.stats.title': 'Bizning yutuqlarimiz',
    'about.stats.users': 'Faol foydalanuvchilar',
    'about.stats.questions': 'Berilgan savollar',
    'about.stats.experts': 'Mutaxassislar',
    'about.stats.satisfaction': 'Foydalanuvchilar mamnunligi',
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