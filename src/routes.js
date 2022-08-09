const {
  addBook, getBook, getBookDetail, editBook, deleteBook,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBook,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookDetail,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBook,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: () => 'Halaman tidak bisa diakses',
  },

];
module.exports = routes;
