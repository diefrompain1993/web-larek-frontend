import { Product } from '../types/index';
import { EventBus } from '../types/index';

export class CartModel {
  private cartItems: Product[] = [];

  constructor(private eventBus: EventBus) {}

  add(product: Product): void {
    this.cartItems.push(product);
    this.notifyChanges();
  }

  remove(productId: string): void {
    const index = this.cartItems.findIndex((item) => item.id === productId);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.notifyChanges();
    }
  }

  clear(): void {
    this.cartItems = [];
    this.notifyChanges();
  }

  getItems(): Product[] {
    return [...this.cartItems];
  }

  getTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + (item.price ?? 0), 0);
  }

  private notifyChanges(): void {
    this.eventBus.emit('cart:change', this.cartItems);
    this.eventBus.emit('cart:count', this.cartItems.length);
  }
}
