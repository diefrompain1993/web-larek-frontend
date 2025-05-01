// Типы событий
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
  eventName: string;
  data: unknown;
};

// Интерфейс IEvents с ослабленными generic-ограничениями
export interface IEvents {
  on<T = unknown>(event: EventName, callback: (data: T) => void): void;
  emit<T = unknown>(event: string, data?: T): void;
  trigger<T = unknown>(event: string, context?: Partial<T>): (data: T) => void;
}

// Класс EventEmitter
export class EventEmitter implements IEvents {
  private _events: Map<EventName, Set<Subscriber>> = new Map();

  on<T = unknown>(eventName: EventName, callback: (data: T) => void): void {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Set());
    }
    this._events.get(eventName)!.add(callback);
  }

  off(eventName: EventName, callback: Subscriber): void {
    if (this._events.has(eventName)) {
      this._events.get(eventName)!.delete(callback);
      if (this._events.get(eventName)!.size === 0) {
        this._events.delete(eventName);
      }
    }
  }

  emit<T = unknown>(eventName: string, data?: T): void {
    this._events.forEach((subscribers, name) => {
      if (name === '*' || (name instanceof RegExp && name.test(eventName)) || name === eventName) {
        subscribers.forEach(callback => callback(data));
      }
    });
  }

  onAll(callback: (event: EmitterEvent) => void): void {
    this.on("*", callback);
  }

  offAll(): void {
    this._events.clear();
  }

  trigger<T = unknown>(eventName: string, context?: Partial<T>): (data: T) => void {
    return (event: T) => {
      this.emit(eventName, {
        ...(event || {}),
        ...(context || {}),
      });
    };
  }
}
