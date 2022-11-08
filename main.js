const books = [];
const RENDER_EVENT = 'render-book';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }

    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id == bookId) {
            return index;
        }
    }

    return -1;
}

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;

    let checkbox = document.getElementById('inputBookIsComplete');
    let isCompletedRead;

    if (checkbox.checked == true) {
        isCompletedRead = true;
    } else {
        isCompletedRead = false;
    }

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, isCompletedRead);

    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function bookshelf(bookObject) {

    const textBookItem = document.createElement('article');
    textBookItem.classList.add('book_item');

    const textBookTitle = document.createElement('h3');
    textBookTitle.innerText = bookObject.title;
    textBookTitle.classList.add('bookitem', 'h3');
    const textBookAuthor = document.createElement('p');
    textBookAuthor.innerText = bookObject.author;
    const textBookYear = document.createElement('p');
    textBookYear.innerText = bookObject.year;
    textBookItem.append(textBookTitle, textBookAuthor, textBookYear)

    const buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'action');

    if (bookObject.isCompleted) {
        const backToUncompletedButton = document.createElement('button');
        backToUncompletedButton.setAttribute('class', 'green');
        backToUncompletedButton.innerText = 'Kembali ke belum baca';
        backToUncompletedButton.classList.add('action', 'green');

        backToUncompletedButton.addEventListener('click', function() {
            undoBookFromCompleted(bookObject.id);
        })

        const deleteCompletedButton = document.createElement('button');
        deleteCompletedButton.setAttribute('class', 'red')
        deleteCompletedButton.innerText = 'Hapus buku';
        deleteCompletedButton.classList.add('action', 'red');

        deleteCompletedButton.addEventListener('click', function() {
            removeBookFromCompleted(bookObject.id);
        })

        buttonContainer.append(backToUncompletedButton, deleteCompletedButton);
        textBookItem.append(buttonContainer);

    } else {
        const goToCompletedButton = document.createElement('button');
        goToCompletedButton.setAttribute('class', 'green')
        goToCompletedButton.innerText = 'Sudah dibaca';

        goToCompletedButton.classList.add('action', 'green');

        goToCompletedButton.addEventListener('click', function() {
            addBookToCompleted(bookObject.id);
        })

        const deleteUncompletedButton = document.createElement('button');
        deleteUncompletedButton.setAttribute('class', 'red')
        deleteUncompletedButton.innerText = 'Hapus buku';
        deleteUncompletedButton.classList.add('action', 'red');

        deleteUncompletedButton.addEventListener('click', function() {
            removeBookFromCompleted(bookObject.id);
        })

        buttonContainer.append(goToCompletedButton, deleteUncompletedButton);
        textBookItem.append(buttonContainer);

    }

    return textBookItem;

}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);


    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    const searchSubmit = document.getElementById('searchSubmit');

    const changeState = document.getElementById('changeState');
    const checklist = document.getElementById('inputBookIsComplete');
    checklist.addEventListener('change', function() {
        if (checklist.checked) {
            changeState.innerText = 'Selesai dibaca';
        } else {
            changeState.innerText = 'Belum selesai dibaca';
        }
    })

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    })

    searchSubmit.addEventListener('click', function(event) {
        event.preventDefault();

        const inputTitle = document.getElementById('searchBookTitle').value.toLowerCase();
        const AllBookTitle = document.querySelectorAll('article.book_item h3')

        for (bookTitleItem of AllBookTitle) {
            if (bookTitleItem.innerText.toLowerCase().includes(inputTitle) == false) {
                bookTitleItem.parentElement.style.display = 'none';
            }

            if (bookTitleItem.innerText.toLowerCase().includes(inputTitle) == true) {
                bookTitleItem.parentElement.style.display = 'block';
            }
        }
    })
})

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');

    const completedBookList = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = bookshelf(bookItem);

        if (!bookItem.isCompleted) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
})

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert('Your browser does not support Local Storage');
        return false;
    }

    return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
})

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data != null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function() {
    if (isStorageExist()) {
        loadDataFromStorage();
    }
})