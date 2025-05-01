import { IProduct } from '../types/index';
import { IEvents } from '../types/index';

export class CartModel {
  private items: IProduct[] = [];
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.emitChange();
  }

  removeItem(productId: string): void {
    const index = this.items.findIndex((item) => item.id === productId);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.emitChange();
    }
  }

  getItems(): IProduct[] {
    return this.items;
  }

  clear(): void {
    this.items = [];
    this.emitChange();
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  private emitChange(): void {
    this.events.emit('cart:change', this.items);
    this.events.emit('cart:count', this.items.length);
  }
}
