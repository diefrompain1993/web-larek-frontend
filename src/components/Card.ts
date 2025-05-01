import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { Product } from '../types/index';
import { categories } from '../utils/constants';

type CardProps = {
  id: string;
  title: string;
  price: number | null;
  category?: string;
  image?: string;
  description?: string;
  buttonText?: string;
  inCart?: boolean;
};

type CardActions = {
  onClick?: () => void;
};

export class Card extends Component<CardProps> {
  private elements = {
    title: ensureElement<HTMLElement>('.card__title', this.container),
    price: ensureElement<HTMLElement>('.card__price', this.container),
    image: this.container.querySelector<HTMLImageElement>('.card__image'),
    category: this.container.querySelector<HTMLElement>('.card__category'),
    description: this.container.querySelector<HTMLElement>('.card__text'),
    button: this.container.querySelector<HTMLButtonElement>('.card__button'),
  };

  private productData!: Product;
  private actions: CardActions;

  constructor(container: HTMLElement, actions: CardActions = {}) {
    super(container);
    this.actions = actions;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    const handleClick = (e: Event) => {
      e.stopPropagation();
      this.actions.onClick?.();
    };

    if (this.elements.button) {
      this.elements.button.addEventListener('click', handleClick);
    } else {
      this.container.addEventListener('click', handleClick);
    }
  }

  private updateCategory(category?: string): void {
    if (!this.elements.category || !category) return;

    this.setText(this.elements.category, category);
    categories.forEach(cls => this.elements.category!.classList.remove(cls));
    const mappedClass = categories.get(category);
    if (mappedClass) this.elements.category.classList.add(mappedClass);
  }

  private updatePrice(price: number | null): void {
    const text = price === null ? 'Бесценно' : `${price} синапсов`;
    this.setText(this.elements.price, text);
  }

  private updateImage(url?: string, alt?: string): void {
    if (this.elements.image && url) {
      this.setImage(this.elements.image, url, alt);
    }
  }

  private updateDescription(desc?: string): void {
    if (this.elements.description && desc) {
      this.setText(this.elements.description, desc);
    }
  }

  private updateButton(price: number | null, inCart?: boolean): void {
    if (!this.elements.button) return;

    if (price === null) {
      this.setText(this.elements.button, 'Нельзя купить');
      this.setDisabled(this.elements.button, true);
    } else {
      const label = inCart ? 'Удалить из корзины' : 'В корзину';
      this.setText(this.elements.button, label);
      this.setDisabled(this.elements.button, false);
    }
  }

  override render(props: CardProps): HTMLElement {
    this.productData = {
      id: props.id,
      title: props.title,
      price: props.price,
      image: props.image,
      description: props.description,
      category: props.category,
    };

    this.setText(this.elements.title, props.title);
    this.updateCategory(props.category);
    this.updateImage(props.image, props.title);
    this.updatePrice(props.price);
    this.updateDescription(props.description);
    this.updateButton(props.price, props.inCart);

    return this.container;
  }

  public get id(): string {
    return this.productData.id;
  }

  public get data(): Product {
    return this.productData;
  }
}
