import './scss/styles.scss';

import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import type { Product, CartItem, OrderResponse, OrderFormFields } from './types/index';
import { API_URL, CDN_URL } from './utils/constants';
import { ApiService } from './services/api';
import { EventEmitter } from './services/events';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';

import { HeaderView } from './components/HeaderView';
import { CatalogView } from './components/CatalogView';
import { Modal } from './components/Modal';
import { Card } from './components/Card';
import { BasketView } from './components/Basket';
import { ProductPreviewView } from './components/ProductPreviewView';
import { OrderForm } from './components/forms/OrderForm';
import { ContactForm } from './components/forms/ContactForm';
import { SuccessView } from './components/SuccessView';

const api = new ApiService(API_URL);
const events = new EventEmitter();

const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);

let allProducts: Product[] = [];

const cardCatalogTemplate  = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate  = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate       = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate        = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate     = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate      = ensureElement<HTMLTemplateElement>('#success');

const headerView      = new HeaderView(ensureElement<HTMLElement>('header'), events);
const catalogView     = new CatalogView(ensureElement<HTMLElement>('.gallery'));
const modal           = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basketView      = new BasketView(
  cloneTemplate(basketTemplate), events
);
const orderFormView   = new OrderForm(
  cloneTemplate(orderTemplate), events
);
const contactFormView = new ContactForm(
  cloneTemplate(contactsTemplate), events
);
const previewView     = new ProductPreviewView(
  cloneTemplate(cardPreviewTemplate), events
);
const successView     = new SuccessView(
  cloneTemplate(successTemplate), events
);

function generateProductCardNode(product: Product): HTMLElement {
  const container = cloneTemplate(cardCatalogTemplate);
  const card = new Card(container, { onClick: () => events.emit<Product>('product:view', product) });
  return card.render({
    id:          product.id,
    title:       product.title,
    price:       product.price,
    image:       CDN_URL + product.image.replace('.svg', '.png'),
    description: product.description,
    category:    product.category,
    inCart:      cartModel.getItems().some(p => p.id === product.id),
  });
}

api.fetchProducts()
  .then(({ items }) => {
    allProducts = items.map(i => ({ ...i, image: i.image.replace('.svg', '.png') }));
    catalogView.setItems(allProducts.map(generateProductCardNode));
  })
  .catch(err => {
    console.error('Ошибка загрузки продуктов:', err);
  });

events.on('header:openBasket', () => {
  modal.open(basketView.render());
});

events.on<Product>('product:view', product => {
  const inCart = cartModel.getItems().some(p => p.id === product.id);
  const node = previewView.render({
    ...product,
    image: CDN_URL + product.image,
    inCart,
  });
  modal.render({ content: node });
});

events.on<{ id: string }>('preview:toggleCart', ({ id }) => {
  const isIn = cartModel.getItems().some(p => p.id === id);
  if (isIn) cartModel.remove(id);
  else {
    const prod = allProducts.find(p => p.id === id);
    if (prod && prod.price !== null) cartModel.add(prod);
  }
  modal.close();
});

function updateBasketView(): void {
  const items = cartModel.getItems();
  const total = cartModel.getTotal();
  const nodes = items.map((it, idx) => {
    const li = createElement('li', { className: 'basket__item card card_compact' });
    const idxEl = createElement('span', {
      className:   'basket__item-index',
      textContent: String(idx + 1),
    });
    const titleEl = createElement('span', {
      className:   'card__title',
      textContent: it.title,
    });
    const priceEl = createElement('span', {
      className:   'card__price',
      textContent: `${it.price ?? 0} синапсов`,
    });
    const delBtn = createElement('button', {
      className:  'basket__item-delete',
      ariaLabel: 'Удалить товар из корзины',
    });
    delBtn.addEventListener('click', () => events.emit<{ id: string }>('basket:remove', { id: it.id }));
    li.append(idxEl, titleEl, priceEl, delBtn);
    return li;
  });
  basketView.setItems(nodes);
  basketView.setTotal(total);
  basketView.setCheckoutEnabled(items.length > 0);
  headerView.setCount(items.length);
}
events.on('cart:change', updateBasketView);
events.on<{ id: string }>('basket:remove', ({ id }) => cartModel.remove(id));

events.on('basket:checkout', () => {
  orderModel.assignItems(
    cartModel.getItems().map(i => i.id),
    cartModel.getTotal()
  );
  const valid = orderModel.validate('delivery');
  const errs = [orderModel.errors.payment, orderModel.errors.address]
    .filter(Boolean)
    .join(', ');
  modal.open(orderFormView.render({
    payment: orderModel.current.payment,
    address: orderModel.current.address,
    valid,
    errors: errs,
  }));
});

events.on('order:submit', () => {
  const valid = orderModel.validate('contacts');
  const errObj = {
    email: orderModel.errors.email,
    phone: orderModel.errors.phone,
  };
  modal.open(contactFormView.render({
    email:  orderModel.current.email,
    phone:  orderModel.current.phone,
    valid,
    errors: errObj,
  }));
});

events.on('contacts:submit', () => {
  if (!orderModel.validate('contacts')) return;
  api.submitOrder(orderModel.current)
    .then((res: OrderResponse) => {
      cartModel.clear();
      orderModel.reset();
      modal.render({ content: successView.render({ total: res.total }) });
    })
    .catch(err => {
      console.error('Ошибка оформления заказа:', err);
    });
});

events.on('success:close', () => modal.close());

events.on<{ field: keyof OrderFormFields; value: string }>(
  'order:change',
  ({ field, value }) => {
    orderModel.updateField(field, value);
    if (field === 'email' || field === 'phone') {
      const valid = orderModel.validate('contacts');
      const errs = {
        email: orderModel.errors.email,
        phone: orderModel.errors.phone,
      };
      contactFormView.render({
        email:  orderModel.current.email,
        phone:  orderModel.current.phone,
        valid,
        errors: errs,
      });
    } else {
      const valid = orderModel.validate('delivery');
      const errs = [orderModel.errors.payment, orderModel.errors.address]
        .filter(Boolean)
        .join(', ');
      orderFormView.render({
        payment: orderModel.current.payment,
        address: orderModel.current.address,
        valid,
        errors: errs,
      });
    }
  }
);

updateBasketView();
catalogView.render();
headerView.render();
