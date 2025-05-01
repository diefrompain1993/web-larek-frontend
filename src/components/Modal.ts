import { Component } from './base/Component';
import { IEvents } from '../services/events';
import { ensureElement } from '../utils/utils';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  private closeButton: HTMLButtonElement;
  private content: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this.content = ensureElement<HTMLElement>('.modal__content', container);

    this.bindEvents();
  }

  private bindEvents(): void {
    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this.content.addEventListener('click', (event) => event.stopPropagation());
    document.addEventListener('keydown', this.handleEscape.bind(this));
  }

  private handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  public open(content: HTMLElement): void {
    this.content.innerHTML = '';
    this.content.appendChild(content);
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden'; 
    this.events.emit('modal:open');
  }

  public close(): void {
    this.container.classList.remove('modal_active');
    this.content.innerHTML = '';
    document.body.style.overflow = ''; 
    this.events.emit('modal:close');
  }

  override render(data: IModalData): HTMLElement {
    this.open(data.content);
    return this.container;
  }
}
