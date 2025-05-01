// Описание товара
export interface Product {
	id: string;
	title: string;
	description?: string;
	image?: string;
	category?: string;
	price: number | null; // null означает, что товар бесценен
  }

  export type CartItem = Pick<Product, 'id' | 'title' | 'price'>;
 
  export type PaymentMethod = 'card' | 'cash';

  export interface OrderPayload {
	total: number;
	items: string[];
	email: string;
	phone: string;
	address: string;
	payment: PaymentMethod;
  }
 
  export type FormErrors = Partial<Record<keyof OrderPayload, string>>;
 
  export type OrderFormFields = Pick<OrderPayload, 'payment' | 'address' | 'email' | 'phone'>;
  export type DeliveryInfo = Pick<OrderPayload, 'payment' | 'address'>;
  export type ContactInfo = Pick<OrderPayload, 'email' | 'phone'>;
  
  export interface OrderResponse {
	total: number;
  }

  export interface FormState {
	isValid: boolean;
	errorMessages: string[];
  }

  export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
  
  export interface ApiClient {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: HttpMethod): Promise<T>;
  }
  
  export interface CardCallbacks {
	onClick: (event: MouseEvent) => void;
  }
  
  export interface SuccessScreenCallbacks {
	onClick: () => void;
  }

  export interface EventBus {
	on<T = unknown>(event: string, callback: (data: T) => void): void;
	emit<T = unknown>(event: string, data?: T): void;
  }
  