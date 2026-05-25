# Delivery Store - Интернет-магазин с доставкой

Полноценный интернет-магазин с системой доставки, созданный на базе React (фронтенд) и Django REST Framework (бэкенд).

## Особенности

- Современный интерфейс на React с Material UI
- Полноценный бэкенд на Django REST Framework
- Система аутентификации и регистрации
- Управление профилем пользователя
- Просмотр каталога товаров
- Корзина покупок
- Оформление заказов
- Просмотр и управление заказами
- Административная панель для управления товарами и заказами

## Установка и запуск

### Бэкенд (Django)

1. Перейдите в директорию backend:
```
cd backend
```

2. Создайте и активируйте виртуальное окружение:
```
python -m venv venv
venv\Scripts\activate  # для Windows
source venv/bin/activate  # для Linux/Mac
```

3. Установите зависимости:
```
pip install django djangorestframework django-cors-headers pillow
```

4. Примените миграции:
```
python manage.py migrate
```

5. Создайте суперпользователя:
```
python manage.py createsuperuser
```

6. Запустите сервер:
```
python manage.py runserver
```

### Фронтенд (React)

1. Перейдите в директорию frontend:
```
cd frontend
```

2. Установите зависимости:
```
npm install
```

3. Запустите сервер разработки:
```
npm start
```

## Использование

- Сайт будет доступен по адресу: http://localhost:3000
- Админ-панель Django: http://localhost:8000/admin
- API бэкенда: http://localhost:8000/api

## Структура проекта

### Бэкенд

- `delivery_store/` - основной проект Django
- `users/` - приложение для управления пользователями
- `products/` - приложение для управления товарами
- `orders/` - приложение для управления заказами

### Фронтенд

- `src/components/` - компоненты React
- `src/contexts/` - контексты React (авторизация, корзина)
- `src/pages/` - страницы приложения
- `src/services/` - сервисы для работы с API

## Технологии

### Бэкенд
- Django
- Django REST Framework
- SQLite (может быть заменено на PostgreSQL)

### Фронтенд
- React
- React Router
- Material UI
- Axios 