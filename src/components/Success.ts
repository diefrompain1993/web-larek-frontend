import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ISuccessData {
  total: number;
}

interface SuccessOptions {
  onClose: () => void;
}

export class Success extends Component<ISuccessData> {
  private descriptionElement: HTMLElement;
  private closeButton: HTMLButtonElement;
  private options: SuccessOptions;

  constructor(container: HTMLElement, options: SuccessOptions) {
    super(container);

    this.options = options;

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.bindEvents();
  }

  private bindEvents(): void {
    this.closeButton.addEventListener('click', () => {
      this.options.onClose();
    });
  }

  override render(data: ISuccessData): HTMLElement {
    this.setText(this.descriptionElement, `Ваш заказ на сумму ${data.total} ₽ успешно оформлен!`);
    return this.container;
  }
}
