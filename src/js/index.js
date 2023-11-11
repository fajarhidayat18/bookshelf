document.querySelector(".btn-close").addEventListener("click", () => {
  toggleFormContainer();
});
document.querySelector(".button-form").addEventListener("click", () => {
  toggleFormContainer();
});
let btnDelete;
let btnDoneRead;
let btnReRead;
// ==============================================================

const doneReading = document.querySelector(".done-reading");
const unRead = document.querySelector(".unread");
const form = document.querySelector("#bookForm");

let books = [];

form.addEventListener("submit", addBook);

// menjalankan fungsi saat halaman di kunjungi atau dibuka
loadDataFromLocalStorage();

// membuka form input data baru
function toggleFormContainer() {
  document.querySelector(".form-container").classList.toggle("active");
}

// fungsi menambah buku baru
function addBook(e) {
  e.preventDefault();

  if (isBookExists(form.title.value, form.author.value, form.year.value)) {
    alert("Buku sudah ada ada di rak");
    return;
  }
  if (form.title.value && form.author.value && form.year.value) {
    const newBook = {
      id: "_" + Math.random().toString(36).substr(2, 9),
      title: form.title.value,
      author: form.author.value,
      year: parseInt(form.year.value),
      isComplete: form.isComplete.checked,
    };

    books.push(newBook);

    saveDataToLocalStorage();
    loadDataFromLocalStorage();
    toggleFormContainer();

    form.title.value = "";
    form.author.value = "";
    form.year.value = "";
    form.isComplete.checked = false;
  } else {
    alert("Dimohon untuk melengkapkan data buku");
  }
}

// fungsi untuk ngecek kalau data sudah ada
function isBookExists(title, author, year) {
  return dataBooks.find(
    (book) =>
      book.title === title &&
      book.author === author &&
      book.year === parseInt(year)
  );
}

// fungsi untuk menyimpan nilai dari variabel books ke dalam localStorage
function saveDataToLocalStorage() {
  const jsonData = JSON.stringify(books);
  localStorage.setItem("dataBooks", jsonData);
}

// fungsi untuk mengambil data daro localStorage dan menampilkannya ke UI
function loadDataFromLocalStorage() {
  const jsonData = localStorage.getItem("dataBooks");
  dataBooks = jsonData ? JSON.parse(jsonData) : [];

  unRead.innerHTML = "";
  doneReading.innerHTML = "";

  for (let i = 0; i < dataBooks.length; i++) {
    const dataBook = dataBooks[i];

    if (!dataBook.isComplete) {
      unRead.innerHTML += createCardHTML(dataBook, false);
    } else {
      doneReading.innerHTML += createCardHTML(dataBook, true);
    }
  }

  btnDelete = document.querySelectorAll(".delete");
  btnDoneRead = document.querySelectorAll(".finish-reading");
  btnReRead = document.querySelectorAll(".re-reading");

  for (let i = 0; i < btnDelete.length; i++) {
    btnDelete[i].addEventListener("click", () => {
      const currentId = btnDelete[i].parentElement.parentElement.id;
      dataBooks = removeBookById(dataBooks, currentId);

      localStorage.setItem("dataBooks", JSON.stringify(dataBooks));
      loadDataFromLocalStorage();
    });
  }

  for (let i = 0; i < btnReRead.length; i++) {
    btnReRead[i].addEventListener("click", () => {
      const currentId = btnReRead[i].parentElement.parentElement.id;
      updateBookStatus(dataBooks, currentId, false);

      localStorage.setItem("dataBooks", JSON.stringify(dataBooks));
      loadDataFromLocalStorage();
    });
  }

  for (let i = 0; i < btnDoneRead.length; i++) {
    btnDoneRead[i].addEventListener("click", () => {
      const currentId = btnDoneRead[i].parentElement.parentElement.id;
      updateBookStatus(dataBooks, currentId, true);

      localStorage.setItem("dataBooks", JSON.stringify(dataBooks));
      loadDataFromLocalStorage();
    });
  }
}
// fungsi membuat UI
function createCardHTML(dataBook, isComplete) {
  const statusButton = isComplete ? "re-reading" : "finish-reading";

  return `
    <article class="card" id="${dataBook.id}">
      <h4 class="book-title">${dataBook.title}</h4>
      <span class="publication-year">${dataBook.year}</span>
      <span class="author">${dataBook.author}</span>
      <div class="actions-button-wrapper">
        <button type="button" class="delete">
          <span class="material-icons-round">delete</span>
        </button>
        <button type="button" class="${statusButton}">
          <span class="material-icons-round">${
            isComplete ? "reply" : "done"
          }</span>
        </button>
      </div>
    </article>
  `;
}
// fungsi untuk menghapus data buku localStorage
function removeBookById(books, id) {
  const updatedBooks = [];
  for (let i = 0; i < books.length; i++) {
    if (books[i].id !== id) {
      updatedBooks.push(books[i]);
    }
  }
  return updatedBooks;
}
// fungsi untuk memperbarui buku sudah dibaca dan untuk membaca ulang dari data buku
function updateBookStatus(books, id, isComplete) {
  for (let i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      books[i].isComplete = isComplete;
      break;
    }
  }
}
