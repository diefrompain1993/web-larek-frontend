import { IOrder, IProduct, IOrderResult } from '../types/index';

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
  readonly baseUrl: string;
  protected options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as object ?? {})
      }
    };
  }

  protected handleResponse(response: Response): Promise<any> {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then(data => Promise.reject(data.error ?? response.statusText));
    }
  }

  // ✅ Получить список товаров — теперь корректно
  public getProducts(): Promise<{ total: number; items: IProduct[] }> {
    return fetch(`${this.baseUrl}/product`, {
      ...this.options,
      method: 'GET',
    }).then(this.handleResponse);
  }

  // Отправить заказ
  public sendOrder(order: IOrder): Promise<IOrderResult> {
    return fetch(`${this.baseUrl}/order`, {
      ...this.options,
      method: 'POST',
      body: JSON.stringify(order)
    }).then(this.handleResponse);
  }
}
