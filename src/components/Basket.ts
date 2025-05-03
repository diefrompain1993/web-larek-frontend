import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { CartItem } from '../types';
import { IEvents } from '../services/events';

export interface BasketViewProps {
  items: HTMLElement[];  
  total: number;        
  canCheckout: boolean; 
}

export class BasketView extends Component<null> {
  private listElement: HTMLElement;
  private totalPriceElement: HTMLElement;
  private confirmButton: HTMLButtonElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.listElement       = ensureElement<HTMLElement>('.basket__list', container);
    this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', container);
    this.confirmButton     = ensureElement<HTMLButtonElement>('.basket__checkout', container);
    this.confirmButton.addEventListener('click', () => {
      this.events.emit('basket:checkout');
    });
  }

  override render(): HTMLElement {
    return this.container;
  }

  public setItems(itemNodes: HTMLElement[]): void {
    this.listElement.innerHTML = '';
    itemNodes.forEach(node => this.listElement.appendChild(node));
  }

  public setTotal(amount: number): void {
    this.totalPriceElement.textContent = `${amount} синапсов`;
  }

  public setCheckoutEnabled(enabled: boolean): void {
    this.confirmButton.disabled = !enabled;
  }
}
