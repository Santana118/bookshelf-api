const { nanoid } = require('nanoid');

const bookDatabase = [];

const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  try {
    bookDatabase.push({
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
    });
  } catch {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getInfoBook = (Books) => {
  const listBook = [];
  for (let index = 0; index < Books.length; index += 1) {
    listBook.push({
      id: Books[index].id,
      name: Books[index].name,
      publisher: Books[index].publisher,
    });
  }
  return listBook;
};

const getBook = (request, h) => {
  const { query } = request;

  if (JSON.stringify(query).length === 2) {
    const response = h.response({
      status: 'success',
      data: {
        books: getInfoBook(bookDatabase),
      },
    });
    response.code(200);
    return response;
  }
  let result = bookDatabase;
  if (query.name !== undefined) {
    const lowerName = query.name.toLowerCase();
    result = bookDatabase.filter((book) => book.name.toLowerCase().match(lowerName) !== null);
  } else if (query.reading !== undefined) {
    const check = query.reading === 1;

    result = bookDatabase.filter((book) => book.reading === check);
  } else if (query.finished !== undefined) {
    const flag = query.finished === '1';
    result = bookDatabase.filter((book) => book.finished === flag);
  } else {
    const response = h.response({
      status: 'success',
      data: {
        books: getInfoBook(bookDatabase),
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: getInfoBook(result),
    },
  });
  response.code(200);
  return response;
};

const getBookDetail = (request, h) => {
  const { bookId } = request.params;
  for (let index = 0; index < bookDatabase.length; index += 1) {
    if (bookId === bookDatabase[index].id) {
      const response = h.response({
        status: 'success',
        data: {
          book: bookDatabase[index],
        },
      });
      response.code(200);
      return response;
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBook = (request, h) => {
  const { bookId } = request.params;
  const index = bookDatabase.findIndex(((idx) => idx.id === bookId));
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  bookDatabase[index].name = name;
  bookDatabase[index].year = year;
  bookDatabase[index].author = author;
  bookDatabase[index].summary = summary;
  bookDatabase[index].publisher = publisher;
  bookDatabase[index].pageCount = pageCount;
  bookDatabase[index].readPage = readPage;
  bookDatabase[index].reading = reading;
  bookDatabase[index].updatedAt = new Date().toISOString();

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;
  const index = bookDatabase.findIndex(((idx) => idx.id === bookId));
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  bookDatabase.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBook, getBook, getBookDetail, editBook, deleteBook,
};
