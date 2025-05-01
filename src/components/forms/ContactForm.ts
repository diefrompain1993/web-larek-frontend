import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../../services/events';
import { ContactInfo } from '../../types';

export class ContactForm extends Component<ContactInfo & { valid: boolean; errors: string[] }> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorOutput: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorOutput = ensureElement<HTMLElement>('.form__errors', container);

    this.bindEvents();
  }

  private bindEvents(): void {
    this.emailInput.addEventListener('input', () => {
      const value = this.emailInput.value.trim();
      const isValid = this.validateEmail(value);

      this.events.emit('order:change', {
        field: 'email',
        value,
      });

      this.emitValidation();
    });

    this.emailInput.addEventListener('blur', () => {
      this.emitValidation();
    });

    this.phoneInput.addEventListener('input', () => {
      const formatted = this.formatPhone(this.phoneInput.value);
      this.phoneInput.value = formatted;

      this.events.emit('order:change', {
        field: 'phone',
        value: formatted,
      });

      this.emitValidation();
    });

    this.phoneInput.addEventListener('blur', () => {
      this.emitValidation();
    });

    this.phoneInput.addEventListener('keypress', (e: KeyboardEvent) => {
      const allowed = /[\d\+\-\(\)\s]/;
      if (!allowed.test(e.key)) {
        e.preventDefault();
      }
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.emitValidation();
      if (!this.submitButton.disabled) {
        this.events.emit('contacts:submit');
      }
    });
  }

  private emitValidation() {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value;
    const isEmailValid = this.validateEmail(email);
    const isPhoneValid = phone.replace(/\D/g, '').length === 11;

    this.toggleInputError(this.emailInput, isEmailValid);
    this.toggleInputError(this.phoneInput, isPhoneValid);

    this.events.emit('formErrors:change', {
      email: !email ? 'Укажите email' : isEmailValid ? '' : 'Некорректный email',
      phone: !isPhoneValid ? 'Укажите корректный телефон' : '',
    });
  }

  private toggleInputError(input: HTMLInputElement, isValid: boolean) {
    input.classList.toggle('form__input_invalid', !isValid);
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

  private validateEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  override render(data: ContactInfo & { valid: boolean; errors: string[] }): HTMLElement {
    this.emailInput.value = data.email || '';
    this.phoneInput.value = data.phone || '';
    this.submitButton.disabled = !data.valid;

    const isEmailValid = this.validateEmail(data.email);
    const isPhoneValid = data.phone.replace(/\D/g, '').length === 11;

    this.toggleInputError(this.emailInput, isEmailValid);
    this.toggleInputError(this.phoneInput, isPhoneValid);

    this.errorOutput.textContent = data.errors.join(', ') || '';
    return this.container;
  }
}
