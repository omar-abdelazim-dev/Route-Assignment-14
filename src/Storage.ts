export class Storage<T> {
  private readonly items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  getAllItems(): T[] {
    return [...this.items];
  }
}
