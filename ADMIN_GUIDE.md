# Руководство администратора ForSkull

## Назначение админов и экспертов

### 1. Как назначить пользователя администратором

Для назначения администратора необходимо выполнить SQL-запрос в базе данных Supabase:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'USER_ID_HERE';
```

Замените `USER_ID_HERE` на фактический UUID пользователя.

### 2. Как назначить пользователя экспертом

Используйте функцию `set_expert_status` для назначения эксперта:

```sql
SELECT public.set_expert_status(
  'USER_ID_HERE'::uuid, 
  true, 
  ARRAY['math', 'physics']::text[]
);
```

Параметры:
- `USER_ID_HERE` - UUID пользователя
- `true` - статус эксперта (true = назначить, false = убрать)
- `ARRAY['math', 'physics']` - массив категорий, в которых пользователь является экспертом

### 3. Как найти UUID пользователя

```sql
SELECT id, username, display_name, email 
FROM auth.users 
JOIN public.profiles ON auth.users.id = public.profiles.id
WHERE username = 'USERNAME' OR email = 'EMAIL';
```

### 4. Как заблокировать пользователя

```sql
UPDATE public.profiles 
SET role = 'blocked' 
WHERE id = 'USER_ID_HERE';
```

### 5. Возможности администраторов

Администраторы могут:
- Удалять любые вопросы и ответы
- Блокировать пользователей через интерфейс
- Назначать экспертов
- Модерировать контент

### 6. Возможности экспертов

Эксперты могут:
- Удалять вопросы и ответы в своих категориях
- Получать специальный бейдж "Эксперт"
- Отвечать на вопросы экспертного уровня (75+ баллов)

### 7. Система ролей

- `novice` - Новичок (по умолчанию)
- `student` - Студент  
- `expert` - Эксперт
- `admin` - Администратор
- `blocked` - Заблокированный пользователь

### 8. Категории для экспертов

Доступные категории:
- `algebra` - Алгебра
- `english` - Английский язык
- `astronomy` - Астрономия
- `biology` - Биология
- `worldHistory` - Всемирная история
- `geography` - География
- `geometry` - Геометрия
- `naturalScience` - Естественные науки
- `informatics` - Информатика
- `uzbekHistory` - История Узбекистана
- `literature` - Литература
- `math` - Математика
- `russian` - Русский язык
- `uzbek` - Узбекский язык
- `physics` - Физика
- `chemistry` - Химия
- `economics` - Экономика
- `other` - Другое

### 9. Пример назначения эксперта по математике

```sql
SELECT public.set_expert_status(
  '123e4567-e89b-12d3-a456-426614174000'::uuid, 
  true, 
  ARRAY['math', 'algebra', 'geometry']::text[]
);
```

### 10. Отмена статуса эксперта

```sql
SELECT public.set_expert_status(
  'USER_ID_HERE'::uuid, 
  false, 
  ARRAY[]::text[]
);
```

## Безопасность

⚠️ **Важно**: Доступ к базе данных должен быть только у доверенных администраторов. Все изменения ролей должны логироваться.

## Контакты

По вопросам администрирования: admin@forskull.com