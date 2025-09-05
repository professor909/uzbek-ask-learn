# Руководство по разблокировке пользователей

## Как разблокировать пользователя

### Способ 1: Через SQL редактор Supabase

1. Откройте [SQL редактор Supabase](https://supabase.com/dashboard/project/sqedesiqyadlrlidtvkj/sql/new)

2. Выполните следующий SQL запрос для разблокировки пользователя:

```sql
UPDATE public.profiles 
SET role = 'novice' 
WHERE id = 'USER_ID_HERE';
```

Замените `USER_ID_HERE` на реальный ID пользователя.

### Способ 2: Найти пользователя по email

Если вы знаете только email пользователя:

```sql
UPDATE public.profiles 
SET role = 'novice' 
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'user@example.com'
);
```

### Способ 3: Найти пользователя по имени пользователя

```sql
UPDATE public.profiles 
SET role = 'novice' 
WHERE username = 'имя_пользователя';
```

## Просмотр всех заблокированных пользователей

Чтобы увидеть список всех заблокированных пользователей:

```sql
SELECT 
  p.id,
  p.username,
  p.display_name,
  au.email,
  p.created_at as blocked_date
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.role = 'blocked'
ORDER BY p.created_at DESC;
```

## Назначение экспертов по предметам

Для назначения эксперта используйте функцию:

```sql
SELECT public.set_expert_status(
  'USER_ID_HERE'::uuid, 
  true, 
  ARRAY['математика', 'физика', 'программирование']::text[]
);
```

Доступные категории:
- математика
- физика  
- химия
- биология
- программирование
- языки
- история
- география
- литература
- экономика

## Снятие статуса эксперта

```sql
SELECT public.set_expert_status('USER_ID_HERE'::uuid, false);
```

## Важные замечания

- **Администраторы** имеют роль `admin` и не могут быть заблокированы
- **Эксперты** имеют `is_expert = true` и роль остается `novice` или выше
- **Заблокированные пользователи** имеют роль `blocked` и не могут создавать контент
- После разблокировки пользователь получает роль `novice` по умолчанию

## Проверка успешности операции

После разблокировки проверьте изменения:

```sql
SELECT username, display_name, role, is_expert 
FROM public.profiles 
WHERE id = 'USER_ID_HERE';
```

Пользователь должен увидеть изменения сразу после перезагрузки страницы.