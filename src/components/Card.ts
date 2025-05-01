import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IProduct } from '../types/index';
import { categories } from '../utils/constants';

interface ICardProps {
	id: string;
	title: string;
	price: number | null;
	category?: string;
	image?: string;
	description?: string;
	buttonText?: string;
	inCart?: boolean;
}

interface CardEvents {
	onClick?: () => void;
}

export class Card extends Component<ICardProps> {
	private titleNode: HTMLElement;
	private priceNode: HTMLElement;
	private imageNode?: HTMLImageElement;
	private categoryNode?: HTMLElement;
	private descriptionNode?: HTMLElement;
	private actionButton?: HTMLButtonElement;

	private product!: IProduct;
	private handlers: CardEvents;

	constructor(container: HTMLElement, handlers: CardEvents = {}) {
		super(container);
		this.handlers = handlers;

		this.titleNode = ensureElement<HTMLElement>('.card__title', container);
		this.priceNode = ensureElement<HTMLElement>('.card__price', container);
		this.imageNode = container.querySelector('.card__image');
		this.categoryNode = container.querySelector('.card__category');
		this.descriptionNode = container.querySelector('.card__text');
		this.actionButton = container.querySelector('.card__button');

		this.bindEvents();
	}

	private bindEvents() {
		const handleClick = (e: Event) => {
			e.stopPropagation();
			this.handlers.onClick?.();
		};

		if (this.actionButton) {
			this.actionButton.addEventListener('click', handleClick);
		} else {
			this.container.addEventListener('click', () => this.handlers.onClick?.());
		}
	}

	private renderTitle(title: string) {
		this.setText(this.titleNode, title);
	}

	private renderCategory(category?: string) {
		if (this.categoryNode && category) {
			this.setText(this.categoryNode, category);
			categories.forEach((cls) => this.categoryNode!.classList.remove(cls));
			const cls = categories.get(category);
			if (cls) this.categoryNode.classList.add(cls);
		}
	}

	private renderImage(src?: string, alt?: string) {
		if (this.imageNode && src) {
			this.setImage(this.imageNode, src, alt);
		}
	}

	private renderPrice(price: number | null) {
		this.setText(this.priceNode, price === null ? 'Бесценно' : `${price} синапсов`);
	}

	private renderDescription(text?: string) {
		if (this.descriptionNode && text) {
			this.setText(this.descriptionNode, text);
		}
	}

	private renderActionButton(price: number | null, inCart?: boolean) {
		if (!this.actionButton) return;

		if (price === null) {
			this.setText(this.actionButton, 'Нельзя купить');
			this.setDisabled(this.actionButton, true);
		} else {
			const label = inCart ? 'Удалить из корзины' : 'В корзину';
			this.setText(this.actionButton, label);
			this.setDisabled(this.actionButton, false);
		}
	}

	override render(data: ICardProps): HTMLElement {
		this.product = {
			id: data.id,
			title: data.title,
			price: data.price,
			image: data.image,
			description: data.description,
			category: data.category,
		};

		this.renderTitle(data.title);
		this.renderCategory(data.category);
		this.renderImage(data.image, data.title);
		this.renderPrice(data.price);
		this.renderDescription(data.description);
		this.renderActionButton(data.price, data.inCart);

		return this.container;
	}

	public get id(): string {
		return this.product.id;
	}

	public get data(): IProduct {
		return this.product;
	}
}
