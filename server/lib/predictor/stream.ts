type Listener<S> = (data: S) => void;

class Stream<T> {
  listeners: Listener<T>[] = [];

  add(data: T) {
    this.listeners.forEach(listener => listener(data));
  }
  listen(callback: Listener<T>): number {
    this.listeners.push(callback);
    return this.listeners.length - 1;
  }
  clear(index: number) {
    this.listeners.splice(index, 1);
  }
}
export default Stream;
