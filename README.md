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
# Larek Frontend

Документация по архитектуре веб‑проекта «Larek Frontend» оформлена согласно паттерну MVP (Model‑View‑Presenter) и событийно‑ориентированному подходу. В данном проекте реализовано четкое разделение ответственности между тремя слоями:

- **Модель** – отвечает за хранение и управление данными приложения (каталог товаров, корзина, заказ, ошибки валидации).
- **Представление (View)** – отвечает за отображение информации, рендеринг элементов интерфейса и обработку событий, происходящих в DOM.
- **Презентер** – связывает Модель и Представление, обрабатывает события от пользователя, инициирует изменение данных в модели и обновление представления.

---

----------

## Слой Модель

### Класс AppApi

**Назначение:**  
Класс `AppApi` служит для взаимодействия с REST‑API. Он инкапсулирует логику отправки HTTP‑запросов, обработки ответов и ошибок.

**Конструктор:**  
Принимает два параметра:

-   `baseUrl` (string) — базовый URL для запросов (внедряется через `baseApi`).
-   `options` (object) — дополнительные параметры запроса (например, заголовки, credentials).

**Поля:**

-   `baseApi` — экземпляр класса, реализующего `get`, `post` и обработку ответов.
-   `cdn` — строка для подстановки адреса CDN в пути изображений.

**Методы:**

-   `getProducts()` — выполняет GET‑запрос к списку товаров.
-   `getProduct(id)` — выполняет GET‑запрос для получения одного товара по ID.
-   `orderProducts(order)` — отправляет POST‑запрос на создание заказа.

### Класс ProductsData

**Назначение:**  
Управляет списком товаров в каталоге и состоянием предпросмотра.

**Поля:**

-   `_products` — массив всех доступных товаров (каталог).
-   `_preview` — идентификатор текущего выбранного товара.

**Методы:**

-   `setProducts(products)` — устанавливает список доступных товаров.
-   `getProducts()` — возвращает текущий список товаров.
-   `addProduct(product)` — добавляет товар в каталог.
-   `getProduct(id)` — возвращает товар по ID.
-   `savePreview(product)` — сохраняет выбранный товар.
-   `preview` — геттер идентификатора предпросмотра.

### Класс BasketData

**Назначение:**  
Управляет товарами, добавленными в корзину, и расчётами стоимости.

**Поля:**

-   `_products` — массив товаров в корзине.
-   `events` — событийный эмиттер.

**Методы:**

-   `appendToBasket(product)` — добавляет товар в корзину.
-   `removeFromBasket(product)` — удаляет товар из корзины.
-   `isBasketCard(product)` — добавляет или удаляет товар в зависимости от текущего состояния.
-   `getCardIndex(product)` — возвращает порядковый номер товара.
-   `getButtonStatus(product)` — возвращает надпись на кнопке ("Купить" или "Удалить").
-   `getBasketPrice()` — возвращает общую сумму корзины.
-   `getBasketQuantity()` — возвращает количество товаров в корзине.
-   `clearBasket()` — очищает корзину.
-   `sendBasketToOrder(orderData)` — копирует ID товаров и сумму в объект заказа.

### Класс OrderData

**Назначение:**  
Управляет данными заказа, контактами, адресом и оплатой.

**Поля:**

-   `_order` — объект заказа (`IOrder`).
-   `_formErrors` — объект ошибок валидации.

**Методы:**

-   `setOrderField(field, value)` — устанавливает поле заказа и запускает валидацию.
-   `setOrderPayment(value)` — задаёт способ оплаты.
-   `validateOrder()` — проверяет корректность заполнения и обновляет ошибки.
-   `clearOrder()` — очищает данные заказа.

## Слой Представления (View)

### Класс Card

**Назначение:**  
Расширяет `BaseCard`, добавляет изображение, описание, категорию и кнопку действия.

**Поля:**

-   `_image` — элемент изображения товара.
-   `_description` — элемент описания товара.
-   `_category` — элемент категории товара.
-   `_button` — кнопка для действия (например, купить/удалить).

**Методы:**

-   `id`, `image`, `description`, `category`, `buttonText` — свойства карточки.

### Класс Basket

**Назначение:**  
Отображает содержимое корзины и управляет оформлением.

**Поля:**

-   `_catalog` — контейнер карточек товаров.
-   `_price` — элемент отображения итоговой стоимости.
-   `_button` — кнопка для оформления заказа.

**Методы:**

-   `price`, `items` — сеттеры данных.
-   `updateButtonState()` — включает/отключает кнопку в зависимости от суммы.

### Класс Form

**Назначение:**  
Базовый класс форм: обработка ввода, валидации, отображение ошибок.

**Поля:**

-   `container` — HTML-форма.
-   `_submit` — кнопка отправки.
-   `_errors` — контейнер для ошибок формы.

**Методы:**

-   `onInputChange(field, value)` — передаёт изменения модели.
-   `valid`, `errors` — сеттеры.
-   `render(state)` — обновление UI.

### Класс OrderContacts

**Поля:**

-   `_email` — поле ввода email.
-   `_phone` — поле ввода телефона.

### Класс OrderPayment

**Поля:**

-   `_buttonOnline` — кнопка для выбора оплаты картой.
-   `_buttonCash` — кнопка для выбора оплаты наличными.
-   `_address` — поле для ввода адреса доставки.

**Методы:**

-   `address` — сеттер значения адреса.
-   `togglePayment(button)` — активирует соответствующую кнопку оплаты.
-   `resetPayment()` — сбрасывает активное состояние кнопок оплаты.

### Класс Success

**Поля:**

-   `_description` — элемент для отображения текста с итоговой суммой заказа.
-   `_close` — кнопка закрытия окна.

**Методы:**

-   `total` — устанавливает текст с итоговой суммой заказа.

## Слой Презентера

**Назначение:**  
Обрабатывает события между View и Model. Связывает пользовательские действия с бизнес-логикой.

**Примеры событий:**

- `card:selected`, `card:basket`, `basket:change`
- `order:open`, `order:change`, `order:submit`
- `contacts:submit`, `errors:change`

**Пример сценария:**
1. Пользователь нажимает «Купить» — `card:basket`
2. Модель обновляет данные — `basket:change`
3. Презентер передаёт их в `Basket` — обновляется интерфейс
4. Пользователь оформляет заказ — `order:open`, `contacts:submit`
5. После отправки — `Success` показывает итог
----------

## Типы данных

### IProductList

**Описание:**  
Объект, представляющий товар из каталога.

**Поля:**

-   `id: string` — уникальный идентификатор товара
    
-   `discription: string` — описание товара
    
-   `image: string` — ссылка на изображение
    
-   `title: string` — название товара
    
-   `category: string` — категория товара
    
-   `price: number \| null` — цена (или `null`, если товар не продаётся)
    

`interface IProductList { id: string; discription: string; image: string; title: string; category: string; price: number | null; }`

----------

### IOrder

**Описание:**  
Объект, представляющий заказ.

**Поля:**

-   `total: number` — общая сумма заказа
    
-   `items: string[]` — массив ID товаров
    
-   `email: string` — электронная почта
    
-   `phone: string` — номер телефона
    
-   `address: string` — адрес доставки
    
-   `payment: string` — способ оплаты
    

`interface IOrder { total: number; items: string[]; email: string; phone: string; address: string; payment: string; }`

----------

### IProductsData

**Описание:**  
Интерфейс модели данных каталога.

**Поля и методы:**

-   `products: IProductList[]`
    
-   `preview: string | null`
    
-   `setProducts(products: IProductList[])`
    
-   `getProducts(): IProductList[]`
    
-   `getProduct(id: string): IProductList`
    
-   `savePreview(product: IProductList)`
    

`interface IProductsData { products: IProductList[]; preview: string | null; setProducts(products: IProductList[]): void; getProducts(): IProductList[]; getProduct(id: string): IProductList; savePreview(product: IProductList): void; }`

----------

### IOrderData

**Описание:**  
Интерфейс модели данных заказа.

**Поля и методы:**

-   `formErrors: TFormErrors`
    
-   `order: IOrder`
    
-   `setOrderPayment(value: string)`
    
-   `setOrderEmail(value: string)`
    
-   `setOrderField(field: keyof TOrderInput, value: string)`
    
-   `setOrderField(field: keyof IOrder, value: IOrder[keyof IOrder])`
    
-   `validateOrder(): boolean`
    
-   `clearOrder(): void`
    

`interface IOrderData { formErrors: TFormErrors; order: IOrder; setOrderPayment(value: string): void; setOrderEmail(value: string): void; setOrderField(field: keyof TOrderInput, value: string): void; setOrderField(field: keyof IOrder, value: IOrder[keyof IOrder]): void; validateOrder(): boolean; clearOrder(): void; }`

----------

### IBasketData

**Описание:**  
Интерфейс модели данных корзины.

**Поля и методы:**

-   `products: TProductBasket[]`
    
-   `appendToBasket(product: IProductList)`
    
-   `removeFromBasket(product: IProductList)`
    
-   `getCardIndex(product: IProductList): number`
    
-   `getButtonStatus(product: TProductBasket): string`
    
-   `getBasketPrice(): number`
    
-   `getBasketQuantity(): number`
    
-   `clearBasket(): void`
    
-   `sendBasketToOrder(orderData: IOrderData): void`
    

`interface IBasketData { products: TProductBasket[]; appendToBasket(product: IProductList): void; removeFromBasket(product: IProductList): void; getCardIndex(product: IProductList): number; getButtonStatus(product: TProductBasket): string; getBasketPrice(): number; getBasketQuantity(): number; clearBasket(): void; sendBasketToOrder(orderData: IOrderData): void; }`

----------

### Дополнительные типы

#### TFormErrors

`type TFormErrors = { [key: string]: string; }`

----------

#### TOrderInput

`type TOrderInput = { email: string; phone: string; address: string; payment: string; }`

----------

#### TProductBasket

`type TProductBasket = IProductList;`

----------