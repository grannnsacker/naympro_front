# NaymPro Front- Клиентская часть сервиса по поиску работы
## Автор: Александриди-Шандаевский Е. Д. ИКБО-20-22
## Бекенд часть - https://github.com/grannnsacker/naympro_backend
## Технологии
- React 18
- TypeScript
- Material-UI
- React Router
- Axios
- Vite

## Требования
- Node.js 18 или выше

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone [url-репозитория]
cd job-finder-front
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env в корневой директории и добавьте необходимые переменные окружения:
```env
VITE_API_URL=http://localhost:8080
```

4. Запустите приложение в режиме разработки:
```bash
npm run dev
```

5. Для сборки проекта:
```bash
npm run build
```

## Структура проекта
```
src/
  ├── components/     # React компоненты
    ├── auth/     # Компоненты авторизации
    ├── jobs/     # Компоненты вакансий и откликов
    ├── profile/     # Компоненты профиля
  ├── services/       # API сервисы
  ├── types/         # TypeScript типы
  ├── utils/         # Вспомогательные функции
  ├── App.tsx        # Корневой компонент
  └── main.tsx       # Точка входа
```

## API Endpoints
- `/login` - Авторизация
- `/registration` - Регистрация
- `/jobs` - Просмотр вакансий
- `/jobs/` - Работа с вакансиями
- `/my-applications` - Просмотр своих откликов
- `/my-jobs` - Просмотр своих вакансий
- `/profile` - Просмотр своего профиля
