import './scss/styles.scss';

import { ApiService } from './services/api';
import { EventEmitter } from './services/events';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';

import { Modal } from './components/Modal';
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { Success } from './components/Success';
import { ContactForm } from './components/forms/ContactForm';
import { OrderForm } from './components/forms/OrderForm';

import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';

import {
  Product,
  OrderFormFields,
  FormErrors,
  OrderResponse,
} from './types/index';

const api = new ApiService(API_URL);
const events = new EventEmitter();

const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);

const catalogElement = ensureElement<HTMLElement>('.gallery');
const modalElement = ensureElement<HTMLElement>('#modal-container');
const cartButton = ensureElement<HTMLElement>('.header__basket');
const cartCounter = ensureElement<HTMLElement>('.header__basket-counter');

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modal = new Modal(modalElement, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactForm = new ContactForm(cloneTemplate(contactTemplate), events);

function renderProductCard(product: Product) {
  const inCart = cartModel.getItems().some((p) => p.id === product.id);
  const card = new Card(cloneTemplate(cardTemplate), {
    onClick: () => events.emit('product:view', product),
  });

  catalogElement.appendChild(
    card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      image: CDN_URL + product.image,
      category: product.category,
      buttonText:
        product.price === null
          ? 'Нельзя купить'
          : inCart
          ? 'Удалить из корзины'
          : 'В корзину',
      inCart,
    })
  );
}

function openProductPreview(product: Product) {
  const container = cloneTemplate(previewTemplate);
  const inCart = cartModel.getItems().some((p) => p.id === product.id);
  const card = new Card(container, {
    onClick: () => {
      if (inCart) {
        cartModel.remove(product.id);
      } else if (product.price !== null) {
        cartModel.add(product);
      }
      modal.close();
    },
  });

  modal.render({
    content: card.render({
      ...product,
      image: CDN_URL + product.image,
      buttonText:
        product.price === null
          ? 'Нельзя купить'
          : inCart
          ? 'Удалить из корзины'
          : 'В корзину',
      inCart,
    }),
  });
}

function openBasket() {
  modal.open(basket.render());
}

function updateBasket() {
  const items = cartModel.getItems();
  basket.update(items);
  cartCounter.textContent = String(items.length);
}

function handleCheckout() {
  const items = cartModel.getItems().map((item) => item.id);
  const total = cartModel.getTotal();
  orderModel.assignItems(items, total);

  const isValid = orderModel.validate('delivery');
  const errors = orderModel.errors;
  const order = orderModel.current;

  modal.open(
    orderForm.render({
      address: order.address,
      payment: order.payment,
      valid: isValid,
      errors: [errors.address, errors.payment].filter(Boolean).join(', '),
    })
  );
}

function openContactsForm() {
  const isValid = orderModel.validate('contacts');
  const errors = orderModel.errors;
  const order = orderModel.current;

  modal.open(
    contactForm.render({
      email: order.email,
      phone: order.phone,
      valid: isValid,
      errors: [errors.email, errors.phone].filter(Boolean),
    })
  );
}

function submitOrder() {
  if (!orderModel.validate('contacts')) return;

  api
    .submitOrder(orderModel.current)
    .then((result: OrderResponse) => {
      cartModel.clear();
      orderModel.reset();
      const success = new Success(cloneTemplate(successTemplate), {
        onClose: () => modal.close(),
      });
      modal.render({ content: success.render({ total: result.total }) });
    })
    .catch((err: unknown) => {
      console.error('Ошибка оформления заказа:', err);
    });
}

function syncFormErrors(errors: FormErrors) {
  const order = orderModel.current;

  orderForm.render({
    address: order.address,
    payment: order.payment,
    valid: !errors.address && !errors.payment,
    errors: [errors.address, errors.payment].filter(Boolean).join(', '),
  });

  contactForm.render({
    email: order.email,
    phone: order.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean),
  });
}

cartButton.addEventListener('click', openBasket);

api.fetchProducts().then(({ items }: { items: Product[] }) =>
  items.forEach(renderProductCard)
);

events.on('product:view', openProductPreview);
events.on('cart:change', updateBasket);
events.on('basket:remove', (data: { id: string }) => cartModel.remove(data.id));
events.on('basket:checkout', handleCheckout);
events.on('order:submit', openContactsForm);
events.on('contacts:submit', submitOrder);
events.on('order:change', (data: { field: keyof OrderFormFields; value: string }) => {
  orderModel.updateField(data.field, data.value);
  orderModel.validate('delivery');
});
events.on('form:errors', syncFormErrors);