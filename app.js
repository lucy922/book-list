// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {}

// Show alert
UI.prototype.showAlert = function (message, className) {
  // Create div
  const div = document.createElement("div");
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const container = document.querySelector(".container");
  // Get form
  const form = document.querySelector("#book-form");
  // Insert alert
  container.insertBefore(div, form);
  // Time out after 3 sec
  setTimeout(function () {
    document.querySelector(".alert").remove();
  }, 3000);
};

// Delete book
UI.prototype.deleteBook = function (target) {
  if (target.className === "delete") {
    target.parentElement.parentElement.remove();
  }
};

// Add book to list
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById("book-list");
  // Create tr element
  const row = document.createElement("tr");
  // insert cols
  row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>
  `;
  list.appendChild(row);
};

// Clear fields
UI.prototype.clearFields = function () {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("isbn").value = "";
};

// Local storage
function Store() {}

Store.prototype.getBooks = function () {
  let books;
  if (localStorage.getItem("books") === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem("books"));
  }

  return books;
};

Store.prototype.displayBooks = function () {
  // Instantiate Store
  const store = new Store();

  const books = store.getBooks();

  books.forEach(function (book) {
    const ui = new UI();

    // Add book to UI
    ui.addBookToList(book);
  });
};

Store.prototype.addBook = function (book) {
  // Instantiate Store
  const store = new Store();

  const books = store.getBooks();

  books.push(book);

  localStorage.setItem("books", JSON.stringify(books));
};

Store.prototype.removeBook = function (isbn) {
  // Instantiate Store
  const store = new Store();

  const books = store.getBooks();

  books.forEach(function (book, index) {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });
  localStorage.setItem("books", JSON.stringify(books));
};

// Instantiate Store
const store = new Store();

// DOM load event
document.addEventListener("DOMContentLoaded", store.displayBooks());

// Event Listener for add book
document.getElementById("book-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form value
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // Instantiate Store
  const store = new Store();

  // Validate
  if (title === "" || author === "" || isbn === "") {
    // Error alert
    ui.showAlert("Please fill in all fields", "error");
  } else {
    //Clear fields
    ui.clearFields();

    // Add book to list
    ui.addBookToList(book);

    // Add to local storage
    store.addBook(book);

    // Show success
    ui.showAlert("Book Added!", "success");
  }
});

// Event listener for delete
document.getElementById("book-list").addEventListener("click", function (e) {
  e.preventDefault();

  // Instantiate UI
  ui = new UI();

  // Delete book
  ui.deleteBook(e.target);

  // Instantiate Store
  const store = new Store();

  // Delete from local storage
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show message
  ui.showAlert("Book Removed!", "success");
});
