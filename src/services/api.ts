import { Product, OrderPayload, OrderResponse } from '../types';
import { HttpMethod } from '../types';

export class ApiService {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultOptions: RequestInit = {}
  ) {}

  private buildOptions(method: HttpMethod, body?: object): RequestInit {
    return {
      ...this.defaultOptions,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.defaultOptions.headers || {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    };
  }

  private async handle<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch((err: unknown) => {
        console.warn('Ошибка при разборе JSON:', err);
        return { error: 'Ошибка при разборе JSON' }; 
      });
      const message = (errorData as { error?: string })?.error || response.statusText || 'Ошибка сервера';
      return Promise.reject(new Error(message)); 
    }
    return response.json();
  }

  public async fetchProducts(): Promise<{ total: number; items: Product[] }> {
    const response = await fetch(`${this.baseUrl}/product`, this.buildOptions('GET'));
    return this.handle(response); 
  }
  
  public async submitOrder(order: OrderPayload): Promise<OrderResponse> {
    const response = await fetch(`${this.baseUrl}/order`, this.buildOptions('POST', order));
    return this.handle(response);
  }
}
