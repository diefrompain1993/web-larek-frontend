import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../../services/events';
import { PaymentMethod, DeliveryInfo } from '../../types/index';

export class OrderForm extends Component<DeliveryInfo & { valid: boolean; errors: string }> {
  private addressInput: HTMLInputElement;
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private submitButton: HTMLButtonElement;
  private errorOutput: HTMLElement;
  private events: IEvents;
  private selectedPayment: PaymentMethod | null = null;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorOutput = ensureElement<HTMLElement>('.form__errors', container);

    this.bindEvents();
  }

  private bindEvents(): void {
    this.cardButton.addEventListener('click', () => this.selectPayment('card'));
    this.cashButton.addEventListener('click', () => this.selectPayment('cash'));

    this.addressInput.addEventListener('input', () => {
      const value = this.addressInput.value.trim();

      this.events.emit('order:change', {
        field: 'address',
        value,
      });

      this.events.emit('formErrors:change', {
        address: value.length < 5 ? 'Введите корректный адрес' : '',
      });
    });

    this.addressInput.addEventListener('blur', () => {
      const value = this.addressInput.value.trim();
      this.events.emit('formErrors:change', {
        address: value.length < 5 ? 'Введите корректный адрес' : '',
      });
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('order:submit');
    });
  }

  private selectPayment(method: PaymentMethod): void {
    this.selectedPayment = method;
    this.events.emit('order:change', {
      field: 'payment',
      value: method,
    });
    this.toggleSelectedButton(method);
  }

  private toggleSelectedButton(method: PaymentMethod) {
    this.cardButton.classList.toggle('button_alt-active', method === 'card');
    this.cashButton.classList.toggle('button_alt-active', method === 'cash');
  }

  override render(data: DeliveryInfo & { valid: boolean; errors: string }): HTMLElement {
    this.addressInput.value = data.address || '';
    this.submitButton.disabled = !data.valid;
    this.errorOutput.textContent = data.errors || '';

    this.addressInput.classList.toggle(
      'form__input_invalid',
      data.errors.toLowerCase().includes('адрес')
    );

    return this.container;
  }
}
