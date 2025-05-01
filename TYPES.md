##  Данные и типы данных, используемые в приложении

### Товар

```ts
export interface IProduct {
  id: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  price: number | null; // null = бесценный товар
}

export type TSummaryProduct = Pick<IProduct, 'id' | 'title' | 'price'>;

```

### Заказ

```ts
export interface IOrder {
  total: number;
  items: string[];
  email: string;
  phone: string;
  address: string;
  payment: PaymentType;
}

```

### Типы, связанные с заказом

```ts
export type PaymentType = 'card' | 'cash';
export type TFormErrors = Partial<Record<keyof IOrder, string>>;
export type TOrderFields = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;
export type TPaymentFields = Pick<IOrder, 'payment' | 'address'>;
export type TUserContactFields = Pick<IOrder, 'email' | 'phone'>;

```

----------

## 📐 Архитектура приложения

Приложение реализовано по принципу **MVP (Model-View-Presenter)**:

-   **Model**: `CartModel`, `OrderModel` — управляют состоянием данных
    
-   **View**: компоненты интерфейса (`Card`, `Basket`, `Modal`, `OrderForm`, `ContactForm`, `Success`)
    
-   **Presenter**: `EventEmitter` — осуществляет маршрутизацию событий между моделью и представлением
    

----------

## 🧠 Слой данных (Models)

### `CartModel`

Управляет корзиной:

-   `addItem(product: IProduct)` — добавить товар
    
-   `removeItem(id: string)` — удалить товар
    
-   `getItems()` — получить товары
    
-   `getTotal()` — общая стоимость
    
-   `clear()` — очистка корзины
    
-   Генерирует события: `cart:change`, `cart:count`
    

### `OrderModel`

Хранит и валидирует заказ:

-   `setField(field, value)` — обновить поле
    
-   `validate(step)` — валидация по шагу ('order' или 'contacts')
    
-   `getOrder()` — вернуть текущий заказ
    
-   `getErrors()` — ошибки валидации
    
-   `reset()` — сброс заказа
    
-   Генерирует события: `formErrors:change`
    

----------

## 🧩 Слой отображения (View Components)

### `Component`

Абстрактный базовый класс. Предоставляет вспомогательные методы:

-   `setText`, `toggleClass`, `setDisabled`, `setImage`, `render`
    

### `Card`

Карточка товара. Отображает название, цену, категорию, описание и кнопку «Купить» или «Удалить».

### `Basket`

Корзина. Отображает добавленные товары, их стоимость и кнопку «Оформить заказ».

### `Modal`

Модальное окно. Показывает любое содержимое, закрывается по ESC, клику вне, или кнопке.

### `OrderForm`

Форма адреса и способа оплаты:

-   Валидация адреса
    
-   Выбор способа оплаты (картой или наличными)
    

### `ContactForm`

Форма email и телефона:

-   Форматированный ввод номера
    
-   Валидация email
    
-   Проверка корректности и заполненности
    

### `Success`

Сообщение об успешной оплате. Показывает сумму и кнопку закрытия.

----------

## 🔌 EventEmitter (Presenter Layer)

Механизм связи между слоями:

```ts
interface IEvents {
  on<T = unknown>(event: string, callback: (data: T) => void): void;
  emit<T = unknown>(event: string, data?: T): void;
}

```

### Примеры событий:

-   `product:view` — открытие карточки товара
    
-   `basket:checkout` — открыть оформление
    
-   `order:submit` — переход к шагу контактов
    
-   `contacts:submit` — отправка заказа
    
-   `cart:change` — обновить корзину
    
-   `formErrors:change` — синхронизировать ошибки формы
    

----------

## 🌐 Работа с API

```ts
export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<T>;
}

```

### Методы:

-   `getProducts()` — получить список товаров
    
-   `sendOrder(order: IOrder)` — оформить заказ
    

----------

## 🧾 Прочие интерфейсы

```ts
export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ISuccessActions {
  onClick: () => void;
}

```

----------

## 📋 Типы валидации

```ts
export interface IFormValidator {
  valid: boolean;
  errors: string[];
}

```

Используется формами для отображения состояния и сообщений.

----------

## 📦 Сценарий работы приложения

1.  Пользователь видит каталог (`Card`)
    
2.  При клике — `product:view`, открывается `Modal`
    
3.  Кнопка «Купить» — `cart:change`, обновляется `Basket`
    
4.  Клик «Оформить» — `basket:checkout`, открывается `OrderForm`
    
5.  После валидации — `order:submit`, открывается `ContactForm`
    
6.  Если форма заполнена — `contacts:submit`, отправка заказа
    
7.  Сервер отвечает — показывается `Success`
    

----------