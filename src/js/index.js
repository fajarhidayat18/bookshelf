const body = document.querySelector("body");
const doneReading = document.querySelector(".done-reading");
const unRead = document.querySelector(".unread");
const form = document.querySelector("#bookForm");
const formContainer = document.querySelector(".form-container");

formContainer.addEventListener("click", (e) => {
  const isFormGroup =
    e.target.classList.contains("form-group") ||
    e.target.closest(".form-group");
  const isBtnClose = e.target.classList.contains("btn-close");

  if (!isFormGroup || isBtnClose) {
    toggleFormContainer();
  }
});
document.querySelector(".button-form").addEventListener("click", () => {
  toggleFormContainer();
});
document
  .querySelector(".nav-button.delete-nav")
  .addEventListener("click", () => {
    toggleClass("active-delete");
  });
document.querySelector(".nav-button.edit-nav").addEventListener("click", () => {
  toggleClass("active-edit");
});
document.querySelector("#search").addEventListener("keyup", (e) => {
  loadDataFromLocalStorage(e.target.value);
});
form.addEventListener("submit", addBook);

let btnDelete;
let btnDoneRead;
let btnReRead;
let btnEdit;
let books = [];

// menjalankan fungsi saat halaman di kunjungi atau dibuka
loadDataFromLocalStorage();
// ==============================================================

function toggleClass(className) {
  const isActive = body.classList.contains(className);
  body.classList.remove("active-delete", "active-edit");
  if (!isActive) {
    body.classList.add(className);
  }
}

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
// Fungsi untuk mengedit buku
function editBook(e, dataBook) {
  e.preventDefault();
  const formData = e.target;
  const jsonData = localStorage.getItem("dataBooks");
  let dataBooks = jsonData ? JSON.parse(jsonData) : [];

  if (formData.title.value && formData.author.value && formData.year.value) {
    const updatedBook = {
      id: dataBook.id,
      title: formData.title.value,
      author: formData.author.value,
      year: parseInt(formData.year.value),
      isComplete: formData.isComplete.checked,
    };

    let bookFound = false;

    // Loop untuk mencari buku dan memperbarui datanya
    for (let i = 0; i < dataBooks.length; i++) {
      if (dataBooks[i].id === updatedBook.id) {
        dataBooks[i] = updatedBook;
        bookFound = true;
        break;
      }
    }

    if (bookFound) {
      //console.log("Data buku yang akan diubah:", dataBook);
      //console.log("Data buku yang diperbarui:", updatedBook);
      alert("buku telah diperbarui");
      // Simpan data ke localStorage
      localStorage.setItem("dataBooks", JSON.stringify(dataBooks));

      // Tampilkan kembali data terbaru
      loadDataFromLocalStorage();

      // Tutup form edit
      document.querySelector("#containerEditForm").remove();
    } else {
      console.error("Data buku tidak ditemukan");
    }
  } else {
    alert("Dimohon untuk melengkapkan data buku");
  }
}

// fungsi untuk ngecek kalau data sudah ada
function isBookExists(title, author, year) {
  const jsonData = localStorage.getItem("dataBooks");
  let dataBooks = jsonData ? JSON.parse(jsonData) : [];
  for (let i = 0; i < dataBooks.length; i++) {
    const book = dataBooks[i];
    if (
      book.title === title &&
      book.author === author &&
      book.year === parseInt(year)
    ) {
      return true; // Buku ditemukan
    }
  }
  return false; // Buku tidak ditemukan
}

// fungsi untuk menyimpan nilai dari variabel books ke dalam localStorage
function saveDataToLocalStorage() {
  const jsonData = JSON.stringify(books);
  localStorage.setItem("dataBooks", jsonData);
}

// fungsi untuk mengambil data daro localStorage dan menampilkannya ke UI
function loadDataFromLocalStorage(search) {
  const jsonData = localStorage.getItem("dataBooks");
  let dataBooks = jsonData ? JSON.parse(jsonData) : [];

  unRead.innerHTML = "";
  doneReading.innerHTML = "";

  for (let i = 0; i < dataBooks.length; i++) {
    const dataBook = dataBooks[i];

    if (search) {
      const titleIncludesSearch = dataBook.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const authorIncludesSearch = dataBook.author
        .toLowerCase()
        .includes(search.toLowerCase());

      if (titleIncludesSearch || authorIncludesSearch) {
        if (!dataBook.isComplete) {
          unRead.innerHTML += createCardHTML(dataBook, false);
        } else {
          doneReading.innerHTML += createCardHTML(dataBook, true);
        }
      }
    } else {
      if (!dataBook.isComplete) {
        unRead.innerHTML += createCardHTML(dataBook, false);
      } else {
        doneReading.innerHTML += createCardHTML(dataBook, true);
      }
    }
  }

  btnDoneRead = document.querySelectorAll(".finish-reading");
  btnReRead = document.querySelectorAll(".re-reading");

  btnDelete = document.querySelectorAll(".delete");
  btnEdit = document.querySelectorAll(".edit");
  btnEdit = document.querySelectorAll(".edit");

  for (let i = 0; i < btnDelete.length; i++) {
    btnDelete[i].addEventListener("click", () => {
      const currentId = btnDelete[i].parentElement.parentElement.id;
      dataBooks = removeBookById(dataBooks, currentId);

      localStorage.setItem("dataBooks", JSON.stringify(dataBooks));
      loadDataFromLocalStorage();
    });
  }

  for (let i = 0; i < btnEdit.length; i++) {
    btnEdit[i].addEventListener("click", () => {
      const bookElement = btnEdit[i].closest(".card");

      if (bookElement) {
        const bookId = bookElement.id;

        let currentData;
        for (let j = 0; j < dataBooks.length; j++) {
          if (dataBooks[j].id === bookId) {
            currentData = dataBooks[j];
            break;
          }
        }

        if (currentData) {
          createFormHTML(currentData);
        } else {
          console.error("Data buku tidak ditemukan");
        }
      } else {
        console.error("Elemen buku tidak ditemukan");
      }
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
      <div class="card-body">
        <h4 class="book-title">${dataBook.title}</h4>
        <p class="author">${dataBook.author}</p>
        <span class="publication-year">${dataBook.year}</span>
      </div>
      <div class="card-footer">
        <button type="button" class="delete">
          <span class="material-icons-round">delete</span>
        </button>
        <button type="button" class="edit">
          <span class="material-icons-round">edit</span>
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

function createFormHTML(dataBook) {
  const mainContainer = document.querySelector("main");
  const formHTML = `
    <section class="form-container active" id="containerEditForm">
      <form class="form-group" id="editBook">
        <div class="input-group">
          <label htmlFor="title">Judul Buku</label>
          <input type="text" name="title" id="title" autoComplete="off" value="${
            dataBook.title
          }" />
        </div>
        <div class="input-group">
          <label htmlFor="author">Penulis</label>
          <input type="text" name="author" id="author" autoComplete="off" value="${
            dataBook.author
          }" />
        </div>
        <div class="input-group">
          <label htmlFor="year">Tahun Terbit</label>
          <input type="number" name="year" id="year" autoComplete="off" value="${
            dataBook.year
          }" />
        </div>
        <div class="checkbox-group">
          <input type="checkbox" name="isComplete" id="isComplete" ${
            dataBook.isComplete ? "checked" : ""
          }/>
          <label htmlFor="isComplete">Sudah Dibaca</label>
        </div>
        <button type="submit" class="btn-submit">Simpan</button>
        <button type="button" class="btn-close">Batal</button>
      </form>
    </section>
  `;

  mainContainer.insertAdjacentHTML("beforeend", formHTML);

  const formEdit = document.querySelector("#editBook");
  const formEditContainer = document.querySelector("#containerEditForm");

  formEdit.addEventListener("submit", (e) => {
    e.preventDefault();
    editBook(e, dataBook);
    // Add your form submission logic here
  });

  formEditContainer.addEventListener("click", (e) => {
    const isFormGroup =
      e.target.classList.contains("form-group") ||
      e.target.closest(".form-group");
    const isBtnClose = e.target.classList.contains("btn-close");

    if (!isFormGroup || isBtnClose) {
      formEditContainer.remove();
    }
  });
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
