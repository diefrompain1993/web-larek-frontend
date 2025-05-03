# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура (MVP + EventEmitter)

Проект использует паттерн **Model–View–Presenter** с событийной шиной для слабой связности.

-   **Model**: хранит состояние и выполняет валидацию.
    
    -   `CartModel`: управление элементами корзины, подсчёт итога.
        
    -   `OrderModel`: хранение полей заказа и детализированная валидация:
        
        -   **Delivery** (payment и address, минимум 5 символов для адреса)
            
        -   **Contacts** (email через RegExp, телефон 11 цифр)
            
-   **View**: компоненты, отвечающие только за отображение и генерацию событий.
    
    -   **Component<T>** — базовый класс без бизнес-логики.
        
    -   **CatalogView** — рендер списка карточек.
        
    -   **HeaderView** — кнопка корзины и счётчик.
        
    -   **BasketView** — список товаров, итоговая сумма, кнопка «Оформить».
        
    -   **ProductPreviewView** — предпросмотр товара в модалке.
        
    -   **OrderForm** — форма доставки (отображение valid/errors, выбор способа, адрес).
        
    -   **ContactForm** — форма контактов с UX-маской телефона и подсветкой ошибок.
        
    -   **SuccessView** — модалка успеха с выводом суммы и кнопкой закрыть.
        
-   **Presenter**
    
    1.  Инициализирует View и Model.
        
    2.  Слушает события (`order:change`, `basket:checkout` и т.д.).
        
    3.  Вызывает методы модели (`updateField`, `validate`, `assignItems`).
        
    4.  Обновляет View вызовом `view.render` или `setItems`, `setTotal`, `setCount`.
        
    5.  Делает HTTP-запросы через `ApiService`.
        

----------

## Основные типы данных

Все типы в `src/types/index.ts`.

-   **Product**:
    

```ts
interface Product {
  id: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  price: number | null;
}

```

-   **CartItem**:
    

```ts
type CartItem = Pick<Product, 'id' | 'title' | 'price'>;

```

-   **OrderPayload**:
    

```ts
interface OrderPayload {
  total: number;
  items: string[];
  email: string;
  phone: string;
  address: string;
  payment: PaymentMethod;
}

```

-   **PaymentMethod**: `'card' | 'cash'`.
    
-   **FormErrors**: `{ delivery?; contacts?; email?; phone?; ... }`.
    
-   **OrderFormFields**, **DeliveryInfo**, **ContactInfo** — вспомогательные типы.
    

----------

## Models

### CartModel

-   `add(product)`, `remove(id)`, `clear()`
    
-   `getItems()`, `getTotal()`
    
-   Эмитит `cart:change` и `cart:count` при изменениях
    

### OrderModel

-   `assignItems(ids, sum)`, `updateField(field, value)`, `validate(section)`, `reset()`
    
-   **Валидация**:
    
    -   Адрес: минимум 5 символов
        
    -   Способ оплаты: обязательный выбор
        
    -   Email: RegExp `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
        
    -   Телефон: ровно 11 цифр, формат +7...
        
-   Эмитит `form:errors` после валидации
    

----------

## View-компоненты (public API)

-   **Component**:
    
    -   `render(data: Partial<T>)`
        
    -   `setText`, `toggleClass`, `setDisabled`, `setImage`
        
-   **CatalogView**:
    
    -   `setItems(nodes: HTMLElement[])`
        
-   **HeaderView**:
    
    -   `setCount(n: number)`
        
    -   Эмитит `header:openBasket` по клику на иконку корзины
        
-   **BasketView**:
    
    -   `render()` → HTMLElement контейнер
        
    -   `setItems(nodes: HTMLElement[])`
        
    -   `setTotal(amount: number)`
        
    -   `setCheckoutEnabled(flag: boolean)`
        
    -   Эмитит `basket:checkout` по клику
        
-   **ProductPreviewView**:
    
    -   `render(props: { Product & { inCart: boolean } })`
        
    -   Эмитит `preview:toggleCart` с `{ id }`
        
-   **OrderForm**:
    
    -   `render(props: { payment, address, valid, errors })`
        
    -   Эмитит `order:change` и `order:submit`
        
-   **ContactForm**:
    
    -   `render(props: { email, phone, valid, errors: { email?, phone? } })`
        
    -   Форматирует телефон как +7 (XXX) XXX-XX-XX
        
    -   Подсвечивает инпуты при ошибках
        
    -   Эмитит `order:change` и `contacts:submit`
        
-   **SuccessView**:
    
    -   `render({ total })`
        
    -   Эмитит `success:close`
        

----------

## Presenter

Сценарии:

1.  `fetchProducts` → `CatalogView.setItems`
    
2.  `product:view` → `ProductPreviewView.render` → `preview:toggleCart` → model.update
    
3.  `cart:change` → `BasketView` + `HeaderView.setCount`
    
4.  `basket:checkout` → `OrderForm.render`
    
5.  `order:submit` → `ContactForm.render`
    
6.  `contacts:submit` → `ApiService.submitOrder` → `SuccessView.render` → `success:close`
    

----------