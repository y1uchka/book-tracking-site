// adding new book
const showFormBtn = document.getElementById('showFormBtn');
const saveBookBtn = document.getElementById('saveBookBtn')
const cancelAddBook = document.getElementById('cancelAddBook')
const inputBookForm = document.getElementById('input-form')

const titleBook = document.getElementById('titleBook')
const bookAuthor = document.getElementById('bookAuthor')
const pagesCount = document.getElementById('pagesCount')
const bookStatus = document.getElementById('bookStatus')

showFormBtn.addEventListener('click', () => {
    inputBookForm.style.display = 'flex';
});
saveBookBtn.addEventListener('click', () => {
    const newBook = {
        title: titleBook.value,
        author: bookAuthor.value,
        totalPages: pagesCount.value,
        status: bookStatus.value
    };
    books.push(newBook); 
    displayLibrary()
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
const libraryBooksDiv = document.getElementById('total-books')
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
                console.log(`Removed "${bookTitle}" from library`);
            }
            if (currentReadDiv) {
                currentReadDiv.style.display = 'none';
            }
        });
    
    });
    const readStartBtn = document.querySelectorAll('.read-start-btn');
    readStartBtn.forEach(button => {  // 👈 Add forEach here!
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            const book = books[index];
            if (currentReadDiv) {
                currentReadDiv.style.display = 'flex';
            }
            book.status = 'reading';
            updateBookStats();
            
            console.log(`Started reading: ${book.title}`);
        });
    });
    updateBookStats()
}
displayLibrary();

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
const readBooksDiv = document.getElementById('read-books-cards')
const currentReadDiv = document.getElementById('read-block')
