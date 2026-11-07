import { User } from './User.js';
import { Admin } from './Admin.js';
import { NoteBook } from './NoteBook.js';
import { Storage } from './Storage.js';

const omar = new User(1, 'Omar', 'omar@example.com', 'example-password', '01012345678', 23);
const admin = new Admin(2, 'Admin', 'admin@example.com', 'admin-password', '01112345678', 30);
const courseNotes = new NoteBook(1, 'TypeScript');
const personalNotes = new NoteBook(2, 'Personal');

omar.addNotebook(courseNotes);
omar.addNotebook(personalNotes);
omar.displayInfo();

const note = courseNotes.addNote(1, 'OOP', 'Composition means the notebook manages the creation and removal of its notes.', omar);
console.log(`${note.tittle}: ${note.preview()}`);
console.log(`Author: ${note.userId.name}`);

const users = new Storage<User>();
users.addItem(omar);
users.addItem(admin);
const topics = new Storage<string>();
topics.addItem('Inheritance');
topics.addItem('Generics');
topics.removeItem('Inheritance');
console.log('Topics:', topics.getAllItems());
console.log('Users:', users.getAllItems().map(user => user.name));
console.log('Removed by admin:', admin.manageNotes(courseNotes, note.Id));

omar.removeNotebook(personalNotes);
console.log('Detached notebook still exists:', personalNotes.name);
