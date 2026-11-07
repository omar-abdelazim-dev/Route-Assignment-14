import { User } from './User.js';
import type { NoteBook } from './NoteBook.js';

export class Admin extends User {
  manageNotes(notebook: NoteBook, noteId: number): boolean {
    return notebook.removeNote(noteId);
  }
}
