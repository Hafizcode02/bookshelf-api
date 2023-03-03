const { nanoid } = require('nanoid');
const books = require('./books');
const { capitalizeEachWord } = require('./helper');

// Function Add Book
const addNewBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Books Name cannot be null or empty
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  // property readPage cannot be greater than pageCount
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  // property reading must be a boolean
  if (typeof (reading) !== 'boolean') {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. property reading harus diisi dengan nilai boolean!',
    }).code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook); // Add to Object Books

  const latestIndex = books.length - 1;
  books[latestIndex].name = capitalizeEachWord(name);

  const isSuccess = books.filter((book) => book.id === id).length > 0; // Check Book is Exist
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku Gagal ditambahkan',
  });
};

// Function Get All Book
const getAllBooks = (request, h) => {
  const allBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: allBooks,
    },
  }).code(200);
};

// Function Get Book by Id
const getBookById = (request, h) => {
  const { bookId } = request.params;

  const bookIsExist = books.find((book) => book.id === bookId);
  if (bookIsExist) {
    return h.response({
      status: 'success',
      data: {
        book: bookIsExist,
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(400);
};

const editBookById = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Books Name cannot be null or empty
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  // property readPage cannot be greater than pageCount
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  // property reading must be a boolean
  if (typeof (reading) !== 'boolean') {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. property reading harus diisi dengan nilai boolean!',
    }).code(400);
  }

  const editedBookIndex = books.findIndex((book) => book.id === bookId);
  if (editedBookIndex >= 0) {
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    books[editedBookIndex] = {
      ...books[editedBookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };

    books[editedBookIndex].name = capitalizeEachWord(name);

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};
module.exports = {
  addNewBook, getAllBooks, getBookById, editBookById,
};
