import {
    IOrder,
    PaymentType,
    TOrderFields,
    TFormErrors,
    IOrderResult,
    TPaymentFields,
    TUserContactFields,
  } from '../types/index';
  import { IEvents } from '../services/events';
  
  export class OrderModel {
    private order: IOrder = {
      total: 0,
      items: [],
      email: '',
      phone: '',
      address: '',
      payment: '' as PaymentType,
    };
  
    private errors: TFormErrors = {};
  
    constructor(private events: IEvents) {}
  
    public setItems(items: string[], total: number): void {
      this.order.items = items;
      this.order.total = total;
    }
  
    public setField(field: keyof TOrderFields, value: string): void {
      if (['email', 'phone', 'address', 'payment'].includes(field)) {
        (this.order as any)[field] = value;
      }
  
      const step = field === 'email' || field === 'phone' ? 'contacts' : 'order';
      this.validate(step);
    }
  
    public getOrder(): IOrder {
      return this.order;
    }
  
    public getErrors(): TFormErrors {
      return this.errors;
    }
  
    public validate(step: 'order' | 'contacts' = 'contacts'): boolean {
      const errors: TFormErrors = { ...this.errors };
  
      if (step === 'order') {
        const order: TPaymentFields = {
          payment: this.order.payment,
          address: this.order.address,
        };
  
        if (!order.address?.trim()) {
          errors.address = 'Введите адрес доставки';
        } else {
          delete errors.address;
        }
  
        if (!order.payment) {
          errors.payment = 'Выберите способ оплаты';
        } else {
          delete errors.payment;
        }
      }
  
      if (step === 'contacts') {
        const contact: TUserContactFields = {
          email: this.order.email,
          phone: this.order.phone,
        };
  
        if (!contact.email?.trim()) {
          errors.email = 'Укажите email';
        } else {
          delete errors.email;
        }
  
        if (!contact.phone?.trim() || contact.phone.replace(/\D/g, '').length < 11) {
          errors.phone = 'Укажите корректный телефон';
        } else {
          delete errors.phone;
        }
      }
  
      this.errors = errors;
      this.events.emit('formErrors:change', this.errors);
      return Object.keys(errors).length === 0;
    }
  
    public reset(): void {
      this.order = {
        total: 0,
        items: [],
        email: '',
        phone: '',
        address: '',
        payment: '' as PaymentType,
      };
      this.errors = {};
    }
  }
  