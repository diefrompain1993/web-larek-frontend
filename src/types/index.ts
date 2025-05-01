// Основная модель товара
export interface IProduct {
	id: string;
	title: string;
	description?: string;
	image?: string;
	category?: string;
	price: number | null; // null = бесценный товар
}

export type TSummaryProduct = Pick<IProduct, 'id' | 'title' | 'price'>;

export interface IOrder {
	total: number;
	items: string[];
	email: string;
	phone: string;
	address: string;
	payment: PaymentType;
}

// Способы оплаты
export type PaymentType = 'card' | 'cash';

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

export type TOrderFields = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;


export type TPaymentFields = Pick<IOrder, 'payment' | 'address'>;

export type TUserContactFields = Pick<IOrder, 'email' | 'phone'>;

export interface IOrderResult {
	total: number;
}

export interface IFormValidator {
	valid: boolean;
	errors: string[];
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface IEvents {
	on<T = unknown>(event: string, callback: (data: T) => void): void;
	emit<T = unknown>(event: string, data?: T): void;
}
