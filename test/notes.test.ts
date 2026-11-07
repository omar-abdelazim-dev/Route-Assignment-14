import { test } from 'node:test';
import assert from 'node:assert/strict';
import { User } from '../src/User.js';
import { Admin } from '../src/Admin.js';
import { NoteBook } from '../src/NoteBook.js';
import { Storage } from '../src/Storage.js';

const user = (age = 23) => new User(1, 'Omar', 'omar@example.com', 'secret', '01012345678', age);

test('age accepts both boundaries and rejects invalid creation and updates', () => {
  assert.equal(user(18).age, 18);
  assert.equal(user(60).age, 60);
  for (const age of [17, 61, NaN, Infinity, 23.5]) {
    assert.throws(() => user(age), RangeError);
  }
  const author = user();
  assert.throws(() => { author.age = 10; }, RangeError);
  assert.equal(author.age, 23);
  author.age = 24;
  assert.equal(author.age, 24);
});

test('notebooks create their notes and retain the author reference', () => {
  const author = user();
  const notebook = new NoteBook(1, 'Course');
  const note = notebook.addNote(1, 'Lesson', 'A long note about classes.', author);
  assert.equal(note.userId, author);
  assert.equal(note.preview(6), 'A long...');
  assert.equal(note.preview(100), note.content);
  assert.throws(() => note.preview(-1), RangeError);
  assert.throws(() => notebook.addNote(1, 'Duplicate', '', author));
  const snapshot = notebook.getNotes() as unknown[];
  snapshot.length = 0;
  assert.equal(notebook.getNotes().length, 1);
  assert.equal(notebook.removeNote(99), false);
  assert.equal(notebook.removeNote(1), true);
  assert.equal(notebook.getNotes().length, 0);
  notebook.addNote(2, 'Second', 'Content', author);
  notebook.clear();
  assert.equal(notebook.getNotes().length, 0);
});

test('aggregation allows multiple notebooks and independent notebook lifetimes', () => {
  const author = user();
  const first = new NoteBook(1, 'First');
  const second = new NoteBook(2, 'Second');
  first.addNote(1, 'Title', 'Content', author);
  author.addNotebook(first);
  author.addNotebook(first);
  author.addNotebook(second);
  assert.equal(author.getNotebooks().length, 2);
  assert.equal(author.removeNotebook(first), true);
  assert.equal(author.removeNotebook(first), false);
  assert.equal(first.getNotes().length, 1);
  assert.equal(author.getNotebooks()[0], second);
});

test('admin inherits User and manages notebook notes', () => {
  const admin = new Admin(2, 'Admin', 'admin@example.com', 'secret', '01112345678', 30);
  const notebook = new NoteBook(1, 'Course');
  notebook.addNote(1, 'Title', 'Content', user());
  assert.ok(admin instanceof User);
  assert.equal(admin.manageNotes(notebook, 1), true);
  assert.equal(admin.manageNotes(notebook, 1), false);
});

test('generic storage handles values and objects without exposing its collection', () => {
  const numbers = new Storage<number>();
  numbers.addItem(10);
  numbers.addItem(20);
  numbers.getAllItems().pop();
  assert.deepEqual(numbers.getAllItems(), [10, 20]);
  assert.equal(numbers.removeItem(10), true);
  assert.equal(numbers.removeItem(10), false);
  assert.deepEqual(numbers.getAllItems(), [20]);
  const users = new Storage<User>();
  const author = user();
  users.addItem(author);
  assert.equal(users.getAllItems()[0], author);
  assert.equal(users.removeItem(author), true);
});

test('displayInfo prints public details without the password', () => {
  const original = console.log;
  const output: string[] = [];
  console.log = (message: string) => output.push(message);
  try { user().displayInfo(); } finally { console.log = original; }
  assert.match(output[0]!, /Omar/);
  assert.match(output[0]!, /01012345678/);
  assert.doesNotMatch(output[0]!, /secret/);
});
