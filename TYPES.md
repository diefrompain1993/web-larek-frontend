### IOrder

**Описание:**  
Объект, представляющий заказ.

**Поля:**

-   `items: string[]` – массив идентификаторов товаров, входящих в заказ.
-   `total: number` – общая сумма заказа.
-   `paymentMethod?: 'card' | 'cash'` – (опционально) способ оплаты.
-   `address?: string` – (опционально) адрес доставки.
-   `contactEmail?: string` – (опционально) email для контакта.
-   `contactPhone?: string` – (опционально) телефон для контакта.

`interface  IOrder { items: string[]; total: number;
  paymentMethod?: 'card' | 'cash';
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
}` 

----------

### IAppState

**Описание:**  
Объект, представляющий состояние приложения.

**Поля:**

-   `massProduct: IProduct[]` – список всех доступных товаров.
-   `basketItems: IProduct[]` – список товаров, добавленных в корзину.
-   `order: IOrder` – данные текущего заказа.
-   `formErrors: { [key: string]: string }` – ошибки валидации форм.

`interface  IAppState { massProduct: IProduct[]; basketItems: IProduct[]; order: IOrder; formErrors: { [key: string]: string };
}` 

----------

## Типы для компонентов

### ProductCardProps

**Описание:**  
Свойства для компонента карточки товара.

**Поля:**

-   `product: IProduct` – данные товара.
-   `onAddToCart: (product: IProduct) => void` – функция-обработчик для добавления товара в корзину.

`interface  ProductCardProps { product: IProduct; onAddToCart: (product: IProduct) => void;
}` 

----------

### OrderFormProps

**Описание:**  
Свойства для компонента формы оформления заказа.

**Поля:**

-   `onSubmit: (order: IOrder) => void` – функция-обработчик отправки заказа.
-   `formErrors: { [key: string]: string }` – ошибки валидации формы заказа.

`interface  OrderFormProps { onSubmit: (order: IOrder) => void; formErrors: { [key: string]: string };
}` 

----------

### ContactsFormProps

**Описание:**  
Свойства для компонента формы контактов.

**Поля:**

-   `onSubmit: (contactData: { email: string; phone: string }) => void` – функция-обработчик отправки контактных данных.
-   `formErrors: { [key: string]: string }` – ошибки валидации для контактной формы.

`interface  ContactsFormProps { onSubmit: (contactData: { email: string; phone: string }) => void; formErrors: { [key: string]: string };
}` 

----------

## Дополнительные типы

### ApiOptions

**Описание:**  
Опции для настройки HTTP‑запросов в классе Api.

**Поля:**

-   `headers?: { [key: string]: string }` – дополнительные HTTP‑заголовки.
-   `credentials?: RequestCredentials` – настройки передачи кукис и прочих параметров запроса.

`interface  ApiOptions {
  headers?: { [key: string]: string };
  credentials?: RequestCredentials;
}` 

----------

### EventCallback

**Описание:**  
Тип для обработчиков событий, позволяющий принимать произвольное число аргументов.

`type  EventCallback = (...args: any[]) => void;`