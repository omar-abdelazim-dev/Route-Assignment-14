import type { NoteBook } from './NoteBook.js';

export class User {
  private _age!: number;
  private readonly notebooks: NoteBook[] = [];

  constructor(
    public readonly Id: number,
    public name: string,
    public email: string,
    private Password: string,
    protected Phone: string,
    age: number,
  ) {
    this.age = age;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (!Number.isInteger(value) || value < 18 || value > 60) {
      throw new RangeError('Age must be a whole number between 18 and 60.');
    }
    this._age = value;
  }

  displayInfo(): void {
    console.log(`ID: ${this.Id}, Name: ${this.name}, Email: ${this.email}, Phone: ${this.Phone}, Age: ${this.age}`);
  }

  addNotebook(notebook: NoteBook): void {
    if (!this.notebooks.includes(notebook)) this.notebooks.push(notebook);
  }

  removeNotebook(notebook: NoteBook): boolean {
    const index = this.notebooks.indexOf(notebook);
    if (index === -1) return false;
    this.notebooks.splice(index, 1);
    return true;
  }

  getNotebooks(): readonly NoteBook[] {
    return [...this.notebooks];
  }
}
