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

  assignItems(itemIds: string[], totalSum: number): void {
    this.data.items = itemIds;
    this.data.total = totalSum;
  }

  updateField(field: keyof OrderFormFields, value: string): void {
    (this.data as any)[field] = value;

    const section = field === 'email' || field === 'phone' ? 'contacts' : 'delivery';
    this.validate(section);
  }

  get current(): OrderPayload {
    return this.data;
  }

  get errors(): FormErrors {
    return this.validationErrors;
  }

  validate(section: 'delivery' | 'contacts'): boolean {
    const updatedErrors: FormErrors = { ...this.validationErrors };

    if (section === 'delivery') {
      const delivery: DeliveryInfo = {
        payment: this.data.payment,
        address: this.data.address,
      };

      if (!delivery.address?.trim()) {
        updatedErrors.address = 'Введите адрес доставки';
      } else {
        delete updatedErrors.address;
      }

      if (!delivery.payment) {
        updatedErrors.payment = 'Выберите способ оплаты';
      } else {
        delete updatedErrors.payment;
      }
    }

    if (section === 'contacts') {
      const contact: ContactInfo = {
        email: this.data.email,
        phone: this.data.phone,
      };

      if (!contact.email?.trim()) {
        updatedErrors.email = 'Укажите email';
      } else {
        delete updatedErrors.email;
      }

      if (!contact.phone?.trim() || contact.phone.replace(/\D/g, '').length < 11) {
        updatedErrors.phone = 'Укажите корректный телефон';
      } else {
        delete updatedErrors.phone;
      }
    }

    this.validationErrors = updatedErrors;
    this.events.emit('form:errors', updatedErrors);

    return Object.keys(updatedErrors).length === 0;
  }

  reset(): void {
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