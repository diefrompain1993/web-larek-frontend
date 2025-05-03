import { Component } from './base/Component';
import { Card } from '../components/Card';
import { cloneTemplate } from '../utils/utils';
import type { Product } from '../types';
import type { IEvents } from '../services/events';

export interface PreviewProps extends Product {
  inCart: boolean;
}

export class ProductPreviewView extends Component<PreviewProps> {
  private card: Card;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.card = new Card(container, {
      onClick: () => {
        this.events.emit<{ id: string }>('preview:toggleCart', { id: this.card.id });
      },
    });
  }

  override render(props: PreviewProps): HTMLElement {
    this.card.render(props);
    return this.container;
  }
}
