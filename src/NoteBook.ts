import { Note } from './Note.js';
import type { User } from './User.js';

export class NoteBook {
  private readonly notes: Note[] = [];
  private readonly createNote = Note.createFactory();

  constructor(public readonly Id: number, public name: string) {}

  // Notes are created inside their notebook, never transferred between notebooks.
  addNote(id: number, tittle: string, content: string, author: User): Note {
    if (this.notes.some(note => note.Id === id)) {
      throw new Error(`Note ${id} already exists in this notebook.`);
    }
    const note = this.createNote(id, tittle, content, author);
    this.notes.push(note);
    return note;
  }

  removeNote(id: number): boolean {
    const index = this.notes.findIndex(note => note.Id === id);
    if (index === -1) return false;
    this.notes.splice(index, 1);
    return true;
  }

  getNotes(): readonly Note[] {
    return [...this.notes];
  }

  clear(): void {
    this.notes.length = 0;
  }
}
