export abstract class Component<T = unknown> {
    protected constructor(protected readonly container: HTMLElement) {}
  
    /**
     * Обновляет данные компонента и перерисовывает его, если нужно.
     */
    public render(data?: Partial<T>): HTMLElement {
      if (data) {
        Object.assign(this as object, data);
      }
      return this.container;
    }
  
    /**
     * Устанавливает текстовое содержимое в элемент.
     */
    protected setText(element: HTMLElement | null, value: unknown): void {
      if (element) {
        element.textContent = String(value);
      }
    }
  
    /**
     * Переключает класс у элемента.
     */
    protected toggleClass(element: HTMLElement | null, className: string, force?: boolean): void {
      if (element) {
        element.classList.toggle(className, force);
      }
    }
  
    /**
     * Устанавливает или убирает атрибут disabled.
     */
    protected setDisabled(element: HTMLElement | null, state: boolean): void {
      if (element) {
        if (state) {
          element.setAttribute('disabled', 'disabled');
        } else {
          element.removeAttribute('disabled');
        }
      }
    }
  
    /**
     * Устанавливает картинку и атрибут alt.
     */
    protected setImage(element: HTMLImageElement | null, src: string, alt?: string): void {
      if (element) {
        element.src = src;
        if (alt) {
          element.alt = alt;
        }
      }
    }
  }
  