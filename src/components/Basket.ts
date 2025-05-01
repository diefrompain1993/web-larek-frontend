import { Component } from './base/Component';
import { ensureElement, createElement } from '../utils/utils';
import { TSummaryProduct } from '../types/index';
import { IEvents } from '../services/events';

export class Basket extends Component<null> {
  private list: HTMLElement;
  private totalElement: HTMLElement;
  private checkoutButton: HTMLButtonElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.list = ensureElement<HTMLElement>('.basket__list', container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__checkout', container);

    this.bindEvents();
  }

  private bindEvents(): void {
    this.checkoutButton.addEventListener('click', () => {
      this.events.emit('basket:checkout');
    });
  }

  public update(items: TSummaryProduct[]): HTMLElement {
    this.list.innerHTML = '';
    let total = 0;

    if (items.length === 0) {
      this.list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
    } else {
      items.forEach((product: TSummaryProduct, index) => {
        const item = createElement('li', {
          className: 'basket__item card card_compact',
        });

        const indexSpan = createElement('span', {
          className: 'basket__item-index',
          textContent: String(index + 1),
        });

        const titleSpan = createElement('span', {
          className: 'card__title',
          textContent: product.title,
        });

        const priceSpan = createElement('span', {
          className: 'card__price',
          textContent: `${product.price ?? 0} синапсов`,
        });

        const deleteButton = createElement('button', {
          className: 'basket__item-delete',
          ariaLabel: 'Удалить товар из корзины',
        });

        deleteButton.addEventListener('click', () => {
          if (product.id) {
            this.events.emit('basket:remove', { id: product.id });
          }
        });

        item.append(indexSpan, titleSpan, priceSpan, deleteButton);
        this.list.appendChild(item);

        total += product.price ?? 0;
      });
    }

    this.totalElement.textContent = `${total} синапсов`;
    this.setDisabled(this.checkoutButton, total === 0);

    return this.container;
  }
}
