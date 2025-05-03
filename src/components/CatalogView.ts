import { Component } from './base/Component';

export class CatalogView extends Component<null> {

  constructor(container: HTMLElement) {
    super(container);
  }

  override render(): HTMLElement {
    return this.container;
  }

  public setItems(items: HTMLElement[]): void {
    this.container.innerHTML = '';
    items.forEach(node => this.container.appendChild(node));
  }
}
