const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    clearFormInputBook();
  });

const isComplete = document.getElementById("inputBookIsComplete");
const isRead = document.getElementById("isRead");
isRead.innerText = "Belum selesai dibaca";

isComplete.addEventListener("click", function () {
  if (isComplete.checked) {
    isRead.innerText = "Selesai dibaca";
  } else {
    isRead.innerText = "Belum selesai dibaca";
  }
});

const searchForm = document.getElementById("searchBook");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchBook();
});

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generateBookID = generateId();
  const book = generateBookObject(generateBookID, title, author, year, isComplete);
  books.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

function generateId() {
  return +new Date();
};

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

function createBook (book) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = book.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = book.year;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(bookTitle, bookAuthor, bookYear);
  container.setAttribute("id", `book-${book.id}`);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const isNotCompletedButton = document.createElement("button");
  isNotCompletedButton.classList.add("green");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "Hapus buku";

  deleteButton.addEventListener("click", function () {
    removeBookFromCompleted(book.id)
  });

  deleteButton.addEventListener("click", function () {
    alert("Buku dihapus dari daftar");
  });

  if (book.isCompleted) {
    isNotCompletedButton.innerText = "Belum selesai";

    isNotCompletedButton.addEventListener("click", function () {
      undoBookFromCompleted(book.id);
    });

    isNotCompletedButton.addEventListener("click", function () {
      alert("Buku berhasil dipindahkan ke daftar belum selesai dibaca");
    });

    buttonContainer.append(isNotCompletedButton, deleteButton);
    container.append(buttonContainer);
  } else {
    isNotCompletedButton.innerText = "Selesai dibaca";

    isNotCompletedButton.addEventListener("click", function () {
      addBookToCompleted(book.id);
    });

    isNotCompletedButton.addEventListener("click", function () {
      alert("Buku berhasil dipindahkan ke daftar selesai dibaca");
    });

    buttonContainer.append(isNotCompletedButton, deleteButton);
    container.append(buttonContainer);
  }

  return container;
};

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBook = document.getElementById("incompleteBookshelfList");
  incompleteBook.innerHTML = "";

  const completeBook = document.getElementById("completeBookshelfList");
  completeBook.innerHTML = "";

  for (const book of books) {
    const bookEl = createBook(book);
    if (!book.isCompleted) incompleteBook.append(bookEl);
    else completeBook.append(bookEl);
  }
});

function addBookToCompleted(id) {
  const bookTarget = findBook(id);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

function findBook(id) {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
};

function removeBookFromCompleted(id) {
  const bookTarget = findBookIndex(id);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

function undoBookFromCompleted(id) {
  const bookTarget = findBook(id);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

function findBookIndex(id) {
  for (const index in books) {
    if (books[index].id === id) {
      return index;
    }
  }

  return -1;
};

function clearFormInputBook() {
  const bookTitle = document.getElementById("inputBookTitle");
  const bookAuthor = document.getElementById("inputBookAuthor");
  const bookYear = document.getElementById("inputBookYear");
  const bookIsComplete = document.getElementById("inputBookIsComplete");

  bookTitle.value = "";
  bookAuthor.value = "";
  bookAuthor.value = "";
  bookYear.value = "";
  bookIsComplete.value = false;
};

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

function searchBook() {
  const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();

  for (i = 0; i < books.length; i++) {
    const inner = books[i].title;
    const bookIdElement = document.getElementById(`book-${books[i].id}`);

    if (inner.toLowerCase().indexOf(searchInput) > -1) {
      bookIdElement.style.display = "";
    } else {
      bookIdElement.style.display = "none";
    }
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
}