import {
  OrderPayload,
  PaymentMethod,
  OrderFormFields,
  FormErrors,
  DeliveryInfo,
  ContactInfo,
} from '../types/index';
import { EventEmitter } from '../services/events';

export class OrderModel {
  private data: OrderPayload = {
    total: 0,
    items: [],
    email: '',
    phone: '',
    address: '',
    payment: '' as PaymentMethod,
  };

  private validationErrors: FormErrors = {};

  constructor(private events: EventEmitter) {}

  public assignItems(itemIds: string[], totalSum: number): void {
    this.data.items = itemIds;
    this.data.total = totalSum;
  }

  public updateField(field: keyof OrderFormFields, value: string): void {
    (this.data as any)[field] = value;
    const section = field === 'email' || field === 'phone' ? 'contacts' : 'delivery';
    this.validate(section);
  }

  public get current(): OrderPayload {
    return this.data;
  }

  public get errors(): FormErrors {
    return this.validationErrors;
  }

  public validate(section: 'delivery' | 'contacts'): boolean {
    const updatedErrors: FormErrors = { ...this.validationErrors };

    if (section === 'delivery') {
      const { address, payment } = this.data;

      if (!address?.trim()) {
        updatedErrors.address = 'Укажите адрес доставки';
      } else if (address.trim().length < 5) {
        updatedErrors.address = 'Введите корректный адрес';
      } else {
        delete updatedErrors.address;
      }

      if (!payment) {
        updatedErrors.payment = 'Выберите способ оплаты';
      } else {
        delete updatedErrors.payment;
      }
    }

    if (section === 'contacts') {
      const { email, phone } = this.data;

      if (!email?.trim()) {
        updatedErrors.email = 'Укажите email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        updatedErrors.email = 'Некорректный email';
      } else {
        delete updatedErrors.email;
      }

      const digits = phone.replace(/\D/g, '');
      if (!digits) {
        updatedErrors.phone = 'Укажите телефон';
      } else if (digits.length !== 11) {
        updatedErrors.phone = 'Укажите корректный телефон';
      } else {
        delete updatedErrors.phone;
      }
    }

    this.validationErrors = updatedErrors;
    this.events.emit('form:errors', updatedErrors);
    return Object.keys(updatedErrors).length === 0;
  }

  public reset(): void {
    this.data = {
      total: 0,
      items: [],
      email: '',
      phone: '',
      address: '',
      payment: '' as PaymentMethod,
    };
    this.validationErrors = {};
  }
}
