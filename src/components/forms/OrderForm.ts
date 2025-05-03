import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../../services/events';
import { PaymentMethod, DeliveryInfo } from '../../types';

export interface OrderFormProps extends DeliveryInfo {
  valid: boolean;
  errors: string; 
}

export class OrderForm extends Component<OrderFormProps> {
  private addressInput: HTMLInputElement;
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private submitButton: HTMLButtonElement;
  private errorOutput: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this.addressInput  = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this.cardButton    = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this.cashButton    = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
    this.submitButton  = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorOutput   = ensureElement<HTMLElement>('.form__errors', container);

    this.bindEvents();
  }

  private bindEvents(): void {
    this.cardButton.addEventListener('click', () =>
      this.events.emit('order:change', { field: 'payment', value: 'card' as PaymentMethod })
    );
    this.cashButton.addEventListener('click', () =>
      this.events.emit('order:change', { field: 'payment', value: 'cash' as PaymentMethod })
    );

    this.addressInput.addEventListener('input', () =>
      this.events.emit('order:change', { field: 'address', value: this.addressInput.value })
    );

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:submit');
    });
  }

  override render(props: OrderFormProps): HTMLElement {
    this.addressInput.value = props.address;
    this.cardButton.classList.toggle('button_alt-active', props.payment === 'card');
    this.cashButton.classList.toggle('button_alt-active', props.payment === 'cash');
    this.submitButton.disabled = !props.valid;
    this.errorOutput.textContent = props.errors;

    return this.container;
  }
}
