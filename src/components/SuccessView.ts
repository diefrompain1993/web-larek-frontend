import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import type { IEvents } from '../services/events';

export interface SuccessProps {
  total: number;
}

export class SuccessView extends Component<SuccessProps> {
  private descriptionEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.descriptionEl = ensureElement<HTMLElement>('.order-success__description', container);
    this.closeBtn      = ensureElement<HTMLButtonElement>('.order-success__close',    container);

    this.closeBtn.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  override render(props: SuccessProps): HTMLElement {
    this.setText(
      this.descriptionEl,
      `Ваш заказ на сумму ${props.total} синапсов успешно оформлен!`
    );
    return this.container;
  }
}
