import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../../services/events';
import { ContactInfo } from '../../types';

export interface ContactFormProps extends ContactInfo {
  valid: boolean;
  errors: {
    email?: string;
    phone?: string;
  };
}

export class ContactForm extends Component<ContactFormProps> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorOutput: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this.emailInput   = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput   = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorOutput  = ensureElement<HTMLElement>('.form__errors', container);

    this.bindEvents();
  }

  private bindEvents(): void {
    this.phoneInput.addEventListener('input', () => {
      this.phoneInput.value = this.formatPhone(this.phoneInput.value);
      this.events.emit('order:change', { field: 'phone', value: this.phoneInput.value });
    });

    this.emailInput.addEventListener('input', () => {
      this.events.emit('order:change', { field: 'email', value: this.emailInput.value });
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('contacts:submit');
    });
  }

  private formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    let formatted = '+7';
    if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
    if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
    if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);
    return formatted.trim();
  }

  override render(props: ContactFormProps): HTMLElement {
    this.emailInput.value   = props.email;
    this.phoneInput.value   = props.phone;
    this.submitButton.disabled = !props.valid;
    this.emailInput.classList.toggle(
      'form__input_invalid',
      Boolean(props.errors.email)
    );
    this.phoneInput.classList.toggle(
      'form__input_invalid',
      Boolean(props.errors.phone)
    );
    
    const messages = [];
    if (props.errors.email) messages.push(props.errors.email);
    if (props.errors.phone) messages.push(props.errors.phone);
    this.errorOutput.textContent = messages.join(', ');

    return this.container;
  }
}
