// adding new book
const showFormBtn = document.getElementById('showFormBtn');
const saveBookBtn = document.getElementById('saveBookBtn')
const cancelAddBook = document.getElementById('cancelAddBook')
const inputBookForm = document.getElementById('input-form')

const titleBook = document.getElementById('titleBook')
const bookAuthor = document.getElementById('bookAuthor')
const pagesCount = document.getElementById('pagesCount')
const bookStatus = document.getElementById('bookStatus')

const libraryBooksDiv = document.getElementById('total-books')

const readBooksDiv = document.getElementById('read-books-cards')
const currentReadDiv = document.getElementById('read-block')

showFormBtn.addEventListener('click', () => {
    inputBookForm.style.display = 'flex';
});
saveBookBtn.addEventListener('click', () => {
    if (titleBook.value.trim()===''){
        alert('Please, input the title of the book!')
        return
    } 
    const newBook = {
        id: Date.now(),
        title: titleBook.value.trim(),
        author: bookAuthor.value.trim() || 'Unknown',
        totalPages: pagesCount.value,
        status: bookStatus.value
    };
    books.push(newBook); 
    displayLibrary()
    displayCurrentRead()
    clearInput()
    inputBookForm.style.display = 'none';
    console.log(`✅ "${newBook.title}" added to library!`);
})
cancelAddBook.addEventListener('click', () => {
    inputBookForm.style.display = 'none';
    clearInput()
});
function clearInput(){
    titleBook.value = '';
    bookAuthor.value = '';
    pagesCount.value = '';
}
// saving books in library
function displayLibrary() {
    libraryBooksDiv.innerHTML = '';
    if (books.length === 0) {
        libraryBooksDiv.innerHTML = '<p>No books yet. Add your first book!</p>';
        return;
    }
    books.forEach((book, index) => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        let statusText = '';
        switch(book.status) {
            case 'completed':
                statusText = 'Completed';
                break;
            default:
                statusText = 'In Plans';
        }
        bookCard.innerHTML = `
            <p>📖 "${book.title}"</p>
            <p>Author: ${book.author}</p>
            <p>Total pages: ${book.totalPages}</p>
            <p>Status: ${statusText}</p>
            <button class="remove-book-btn" data-index="${index}">Remove</button>
            <button class="read-start-btn" data-index="${index}">Read start</button>
        `;
        libraryBooksDiv.appendChild(bookCard);
    });
    const removeButton = document.querySelectorAll('.remove-book-btn');
    removeButton.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            const bookTitle = books[index].title;
            const isConfirmed = confirm(`Are you sure you want to remove "${bookTitle}"?`);
            if (isConfirmed) {
                books.splice(index, 1);
                displayLibrary();
                updateBookStats();
                displayCurrentRead();
                console.log(`Removed "${bookTitle}" from library`);
            }
        });
    
    });
    const readStartBtn = document.querySelectorAll('.read-start-btn');
    readStartBtn.forEach(button => { 
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            const book = books[index];
            book.status = 'reading';
            displayCurrentRead();
            displayLibrary()
            console.log(`Started reading: ${book.title}`);
        });
    });
    updateBookStats()
}
displayLibrary();
displayCurrentRead();
updateBookStats();

// updating total count
function updateBookStats() {
    // Count books by status
    const totalBooks = books.length;
    const completedBooks = books.filter(book => book.status === 'completed').length;
    const readingBooks = books.filter(book => book.status === 'reading').length;
    const plansBooks = books.filter(book => book.status === 'plans').length;
    // Update the HTML elements
    document.getElementById('total-count').textContent = totalBooks;
    document.getElementById('complete-count').textContent = completedBooks;
    document.getElementById('plans-count').textContent = plansBooks;
    // Optional: Console log for debugging
    console.log(`Stats: Total:${totalBooks}, Completed:${completedBooks}, Plans:${plansBooks}`);
}

// updating currently reading
function displayCurrentRead() {
    const readingBooks = books.filter(book => book.status === 'reading');
    if (!readingBooks) return;
    readBooksDiv.innerHTML = '';
    if (readingBooks.length===0){
        currentReadDiv.style.display= 'none';
        console.log('no current reading books')
    }
    if (readingBooks!=0){
        currentReadDiv.style.display='flex';
    }
    readingBooks.forEach((book, idx) => {
        const readBookCard = document.createElement('div');
        readBookCard.className = 'read-book-card';
        readBookCard.innerHTML = `
            <p>📖"${book.title}"</p>
            <p>Author: ${book.author}</p>
            <p>Total pages: ${book.totalPages}</p>`
        readBooksDiv.appendChild(readBookCard);
    })}
