const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Express Ready.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(express.json());

let books = [];

// Create a Book
app.post('/books', (req, res) => {
  // Logic to add a book
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).send('Missing title or author.');
  }

  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.status(201).send(newBook);
});

// Get All Books
app.get('/books', (req, res) => {
  res.json(books);
});

// Get a Single Book
app.get('/books/:id', (req, res) => {
  // Logic to get a single book
  const book=books.find(item=>item.id===parseInt(req.params.id));
  if(!book){
    res.status(404).send('Book Not Found.');
  }

  res.json(book);
});

// Update a Book
app.put('/books/:id', (req, res) => {
  // Logic to update a book
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).send('Book Not Found.');
  }

  const { title, author } = req.body;
  book.title = title || book.title;         //title is not present (i.e., it's undefined or null), book.title will retain its original value.
  book.author = author || book.author;

  res.send(book);
});

// Delete a Book
app.delete('/books/:id', (req, res) => {
  // Logic to delete a book
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).send('Book Not Found.');
  }

  books.splice(bookIndex, 1);
  res.status(204).send();
});


// ..... Integration MongoDB .....

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dejavunerdprogrammer001:D75zndzplzrD5aK8@cluster0.kyb6b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


const Book=require('../models/book');

// Create new Book.
app.post('/mongoose/books',async (req,res)=>{

    let book=new Book({title:req.body.title,author:req.body.author});
    book=await book.save();
    res.send(book);
});

// Get ALL Books.
app.get('/mongoose/books',async (req,res)=>{

    const books=await Book.find();
    res.json(books);
});

// GET a Book
app.get('/mongoose/books/:id',async (req,res)=>{

    const book=await Book.findById(req.params.id);
    if(!book){
        res.status(404).send('Book NOT FOUND.');
    }
    res.send(book);
});

// Update a Book.
app.put('/mongoose/books/:id',async(req,res)=>{

    const book = await Book.findByIdAndUpdate(req.params.id, { title: req.body.title, author: req.body.author }, { new: true });
  if (!book) return res.status(404).send('Book not found.');
  res.send(book);
});

// Delete a book.
app.delete('/mongoose/books/:id',async(req,res)=>{

    const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).send('Book not found.');
  res.status(204).send('BOOK DELETED.');
});
