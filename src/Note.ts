import type { User } from './User.js';

export class Note {
  private constructor(
    public readonly Id: number,
    public tittle: string,
    public content: string,
    public readonly userId: User,
  ) {}

  static createFactory(): (id: number, tittle: string, content: string, author: User) => Note {
    return (id, tittle, content, author) => new Note(id, tittle, content, author);
  }

  preview(length = 50): string {
    if (!Number.isInteger(length) || length < 0) {
      throw new RangeError('Preview length must be a non-negative integer.');
    }
    return this.content.length > length ? `${this.content.slice(0, length)}...` : this.content;
  }
}
