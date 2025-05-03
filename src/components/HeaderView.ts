import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from '../services/events';

export class HeaderView extends Component<null> {
  private basketButton: HTMLElement;
  private counterEl: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.basketButton = ensureElement<HTMLElement>('.header__basket', container);
    this.counterEl    = ensureElement<HTMLElement>('.header__basket-counter', container);
    this.basketButton.addEventListener('click', () => {
      this.events.emit('header:openBasket');
    });
  }

  override render(): HTMLElement {
    return this.container;
  }

  public setCount(count: number): void {
    this.counterEl.textContent = String(count);
  }
}
