import { Component } from './base/Component';
import { ensureElement, createElement } from '../utils/utils';
import { CartItem, EventBus } from '../types';

export class Basket extends Component<null> {
  private listElement: HTMLElement;
  private totalPriceElement: HTMLElement;
  private confirmButton: HTMLButtonElement;
  private events: EventBus;

  constructor(container: HTMLElement, events: EventBus) {
    super(container);
    this.events = events;

    this.listElement = ensureElement<HTMLElement>('.basket__list', container);
    this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', container);
    this.confirmButton = ensureElement<HTMLButtonElement>('.basket__checkout', container);

    this.bindUI();
  }

  private bindUI(): void {
    this.confirmButton.addEventListener('click', () => {
      this.events.emit('basket:checkout');
    });
  }

  public update(items: CartItem[]): HTMLElement {
    this.listElement.innerHTML = '';
    let total = 0;

    if (items.length === 0) {
      this.listElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
    } else {
      items.forEach((item, index) => {
        const element = createElement('li', {
          className: 'basket__item card card_compact',
        });

        const indexLabel = createElement('span', {
          className: 'basket__item-index',
          textContent: String(index + 1),
        });

        const title = createElement('span', {
          className: 'card__title',
          textContent: item.title,
        });

        const price = createElement('span', {
          className: 'card__price',
          textContent: `${item.price ?? 0} синапсов`,
        });

        const deleteBtn = createElement('button', {
          className: 'basket__item-delete',
          ariaLabel: 'Удалить товар из корзины',
        });

        deleteBtn.addEventListener('click', () => {
          if (item.id) {
            this.events.emit('basket:remove', { id: item.id });
          }
        });

        element.append(indexLabel, title, price, deleteBtn);
        this.listElement.appendChild(element);

        total += item.price ?? 0;
      });
    }

    this.totalPriceElement.textContent = `${total} синапсов`;
    this.setDisabled(this.confirmButton, total === 0);

    return this.container;
  }
}
