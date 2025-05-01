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

## Архитектура

Проект построен по принципу **MVP**:

-   **Model** 
    — хранит и валидирует состояние корзины и заказа (`CartModel`, `OrderModel`).
    
-   **View**
    — отдельные UI-компоненты, отвечающие за отображение и обработку взаимодействия с DOM.
    
-   **Presenter / EventBus**
    — `EventEmitter` связывает Model и View через публикацию/подписку на события.
    

----------

##  Типы данных

Все типы объединены в `src/types/index.ts`.


#### Описание товара

```ts
export interface Product {
  id: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  price: number | null; // null = бесценный товар
}

```

----------

#### Элемент корзины

```ts
export type CartItem = Pick<Product, 'id' | 'title' | 'price'>;

```

----------

#### Параметры заказа

```ts
export interface OrderPayload {
  total: number;
  items: string[];
  email: string;
  phone: string;
  address: string;
  payment: PaymentMethod;
}

```

----------

#### Способы оплаты

```ts
export type PaymentMethod = 'card' | 'cash';

```

----------

#### Ошибки валидации формы

```ts
export type FormErrors = Partial<Record<keyof OrderPayload, string>>;

```

----------

#### Поля оформления заказа (шаги)

```ts
// Для выбора способа оплаты и адреса
export type DeliveryInfo = Pick<OrderPayload, 'payment' | 'address'>;

// Для контактных данных
export type ContactInfo = Pick<OrderPayload, 'email' | 'phone'>;

// Все одновременно (если нужно)
export type OrderFormFields = Pick<OrderPayload, 'payment' | 'address' | 'email' | 'phone'>;

```
----------

## Слой данных (Models)

### CartModel

Управляет списком товаров в корзине.

-   **Методы**
    
    -   `add(product: Product): void`
        
    -   `remove(productId: string): void`
        
    -   `clear(): void`
        
    -   `getItems(): Product[]`
        
    -   `getTotal(): number`
        
-   **События**
    
    -   `cart:change` — передаёт новый массив товаров
        
    -   `cart:count` — передаёт текущее число товаров
        

----------

### OrderModel

Хранит текущее состояние заказа и выполняет валидацию.

-   **Методы**
    
    -   `assignItems(itemIds: string[], totalSum: number): void`
        
    -   `updateField(field: keyof OrderFormFields, value: string): void`
        
    -   `validate(section: 'delivery' | 'contacts'): boolean`
        
    -   `reset(): void`
        
-   **События**
    
    -   `form:errors` — передаёт объект `FormErrors` после каждой валидации
        

----------

##  Слой отображения (View Components)

### Базовый класс `Component<T>`

Абстрактный компонент:

-   Конструктор принимает `container: HTMLElement`
    
-   `render(data?: Partial<T>): HTMLElement` — обновляет внутренние поля и возвращает контейнер
    
-   Утилиты:
    
    -   `setText`, `toggleClass`, `setDisabled`, `setImage`
        

----------

### Card

Отображает карточку товара.


`new  Card(container: HTMLElement, actions?: { onClick?: () =>  void })` 

-   **render(props: CardProps): HTMLElement**
    
    -   `id`, `title`, `price`, `category?`, `image?`, `description?`, `inCart?`
        
-   Автоматически меняет текст и состояние кнопки (`«В корзину»` / `«Удалить»`)
    
-   Генерирует `actions.onClick`
    

----------

### Basket

Отображает содержимое корзины.

-   **update(items: CartItem[]): HTMLElement**  
    — перерисовывает список, рассчитывает `total`, включает/отключает кнопку «Оформить»
    
-   По клику на «Оформить».Emit’ит событие `basket:checkout`
    

----------

### Modal 

Обёртка для любого контента в модальном окне.

-   **open(content: HTMLElement): void**
    
-   **close(): void**
    
-   `render(data: { content: HTMLElement }): HTMLElement` — открывает окно
    
-   Закрывается по ESC, клику вне содержимого и по кнопке «Закрыть»
    

----------

### OrderForm

Форма выбора способа оплаты и ввода адреса.

-   Принимает `container: HTMLFormElement` и `events: IEvents`
    
-   Валидация адреса (минимум 5 символов)
    
-   Кнопки выбора `card` / `cash`
    
-   `render(data: DeliveryInfo & { valid: boolean; errors: string }): HTMLElement`
    

----------

### ContactForm 

Форма ввода email и телефона.

-   Форматирует телефон в российский формат `+7 (XXX) XXX-XX-XX`
    
-   Валидация email и длины номера
    
-   `render(data: ContactInfo & { valid: boolean; errors: string[] }): HTMLElement`
    
-   При успешной валидации Emit’ит `contacts:submit`
    

----------

### Success 

Сообщение об успешном оформлении заказа.

-   **render(data: { total: number }): HTMLElement** — выводит сумму
    
-   При клике на закрытие вызывает колбэк из `options.onClose`
    

----------

## Presenter — EventEmitter 

`interface  IEvents {
  on<T>(event: string | RegExp, cb: (data: T) => void): void;
  emit<T>(event: string, data?: T): void;
  trigger<T>(event: string, ctx?: Partial<T>): (data: T) => void;
}` 

Используется для связи между компонентами и моделями без жёстких зависимостей.

----------

##  Работа с API 

Класс `ApiService`:

-   **fetchProducts(): Promise<{ total: number; items: Product[] }>**
    
-   **submitOrder(order: OrderPayload): Promise<{ total: number }>**
    

Оборачивает `fetch`, добавляет заголовки, обрабатывает ошибки и парсит JSON.

----------

## Взаимодействие компонентов

1.  Инициализируем `ApiService`, `EventEmitter`, модели (`CartModel`, `OrderModel`) и View-компоненты.
    
2.  Загружаем товары с сервера и рендерим `Card` в галерее.
    
3.  По событиям:
    
    -   `product:view` → открытие превью в `Modal`
        
    -   `basket:checkout` → открытие `OrderForm`
        
    -   `order:submit` → открытие `ContactForm`
        
    -   `contacts:submit` → вызов `ApiService.submitOrder` → очистка корзины → открытие `Success`
        
4.  Изменения корзины и форм синхронизируются через `EventEmitter` и методы `render` компонентов.