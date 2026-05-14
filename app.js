// DOM elements
const showFormBtn = document.getElementById('showFormBtn') //show add book
const saveBookBtn = document.getElementById('saveBookBtn') //save added book
const cancelAddBook = document.getElementById('cancelAddBook') //cancel adding new book
const inputBookForm = document.getElementById('input-form') //input form for adding
const submitRatingBtn = document.getElementById('submit-rating-btn') // submit book rating 
const closeReviewBtn = document.getElementById('closeReviewBtn')
const editReviewBtn = document.getElementById('editReviewBtn')
const ratingModalWindow = document.getElementById('ratingModal')
const reviewModalWindow = document.getElementById('reviewModal')
const userReviewText = document.getElementById('reviewFullText')

const titleBook = document.getElementById('titleBook') // title
const bookAuthor = document.getElementById('bookAuthor') // author
const pagesCount = document.getElementById('pagesCount') // total pages
const bookStatus = document.getElementById('bookStatus') // plans/reading/completed
const completedBookReview = document.getElementById('book-review') //user's review

let totalBooksNumber = document.getElementById('total-count')
let progressBooksNumber = document.getElementById('progress-count')
let inPlansBooksNumber = document.getElementById('plans-count')
let completeBooksNumber = document.getElementById('complete-count')

const libraryBooksDiv = document.getElementById('total-books') // library for cards
const currentlyReadingDiv = document.getElementById('read-books-cards') // currently reading for cards
const currentlyReadingBlock = document.getElementById('read-block')

let currentFilter = 'all';
let ratingCurrentBook = null;
let selectedRating = 0;
// adding new book
showFormBtn.addEventListener('click', () =>{
    clearInputForm()
    inputBookForm.style.display = 'flex';
});

cancelAddBook.addEventListener('click', () => {
    inputBookForm.style.display = 'none';
})

saveBookBtn.addEventListener('click', ()=>{
    if(!checkIfInputRight()){
        return;
    }
    const newBook = {
        id: Date.now(),
        title: titleBook.value.trim(),
        author: bookAuthor.value.trim(),
        pages: pagesCount.value,
        status: bookStatus.value,
        readPages: (bookStatus.value === 'reading') ? 0 : null,
        review: '',
        rating: 0
    }
    books.push(newBook)
    updateBookNumber()
    updateBookLibrary()
    updateCurrentlyReading();
    clearInputForm();
    inputBookForm.style.display = 'none';
})

function clearInputForm(){
    titleBook.value='';
    bookAuthor.value='';
    pagesCount.value='';
    bookStatus.value='plans';
    
    titleBook.classList.remove('error');
    bookAuthor.classList.remove('error');
    pagesCount.classList.remove('error');
    bookStatus.classList.remove('error');
}

function checkIfInputRight(){
    let isValid = true;
    // checking the title
    if (!titleBook.value.trim()) {
        titleBook.classList.add('error');
        isValid = false;
    } else {
        titleBook.classList.remove('error');
    }
    // checking the author
    if (!bookAuthor.value.trim()){
        bookAuthor.classList.add('error');
        isValid = false;
    } else {
        bookAuthor.classList.remove('error')
    }
    // checking the pages
    if (!pagesCount.value){
        pagesCount.classList.add('error');
        isValid = false;
    } else {
        pagesCount.classList.remove('error')
    }
    return isValid;
}

// updating the stats
function updateBookNumber(){
    totalBooksNumber.textContent = books.length;
    inPlansBooksNumber.textContent = books.filter(book => book.status === 'plans').length;
    progressBooksNumber.textContent = books.filter(book => book.status === 'reading').length
    completeBooksNumber.textContent = books.filter(book => book.status === 'completed').length;
    console.log(`Total: ${totalBooksNumber.textContent}, In Plans: ${inPlansBooksNumber.textContent}, Completed: ${completeBooksNumber.textContent}`)
}
// updating the library
function updateBookLibrary(){
    let filteredBooks = [];
    if (currentFilter==='all'){
        filteredBooks = books;
    } else {
        filteredBooks = books.filter(book => book.status === currentFilter)
    }
    libraryBooksDiv.innerHTML = '';
    if (filteredBooks.length === 0){
        libraryBooksDiv.innerHTML = '<p style="padding: 1.5rem; text-align: center;">No books in this section yet.</p>'
        return;
    }
    filteredBooks.forEach(book=>{
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        let statusEmoji = { plans: '📌', reading: '📖', completed: '✅' }[book.status] || '';
        let ratingHtml = '';
        if (book.status === 'completed' && book.rating > 0) {
            let stars = '';
            for (let i=1; i<=5; i++) stars += i <= book.rating ? '★' : '☆';
            ratingHtml = `<div class="rating-stars">⭐ ${stars}</div>`;
        }
        let reviewBtnHtml = '';
        if (book.status === 'completed' && book.review && book.review.trim() !== '') {
            reviewBtnHtml = `<div><button class="review-btn" data-id="${book.id}">📖 View review</button></div>`;
        } else if (book.status === 'completed' && book.review===''){
            reviewBtnHtml = `<div><button class="add-review-btn" data-id="${book.id}">📖 Add review</button></div>`;
        }
        bookCard.innerHTML = `
            <p style="font-size:19px;">${statusEmoji} ${book.title}</p>
            <p style="font-size:17px;">✍️ ${book.author}</p>
            <p>📄 ${book.pages} pages</p>
            ${ratingHtml}
            ${reviewBtnHtml}
            <div>
                <button class="remove-btn" data-id="${book.id}">🗑 Remove</button>
                ${book.status !== 'reading' ? `<button class="read-start-btn" data-id="${book.id}">📖 Read start</button>` : ''}
                ${book.status !== 'completed' ? `<button class="complete-btn" data-id="${book.id}">✅ Complete</button>` : ''}
            </div>
        `;
        libraryBooksDiv.appendChild(bookCard);
    })
    //working buttons in book card
    const removeBookBtn = document.querySelectorAll('.remove-btn')
    const readStartBtn = document.querySelectorAll('.read-start-btn')
    const completeBookBtn = document.querySelectorAll('.complete-btn')
    const viewReview = document.querySelectorAll('.review-btn')
    const addReviewBtn = document.querySelectorAll('.add-review-btn')
    // removing book
    removeBookBtn.forEach(button => {
       button.addEventListener('click', () => {
            const bookId = parseInt(button.getAttribute('data-id'));
            const currentBook = books.find(b => b.id === bookId);
            const confirmRemoval = confirm(`Are you sure you want to remove "${currentBook.title}"?`)
            if (confirmRemoval){
                books = books.filter(b => b.id !== bookId);
                updateBookLibrary();
                updateBookNumber();
                updateCurrentlyReading()
                console.log(`Removed ${currentBook.title}.`)
            }
       }) 
    })
    // start reading book
    readStartBtn.forEach(button => {
        button.addEventListener('click', () => {
            const bookId = parseInt(button.getAttribute('data-id'));
            const currentBook = books.find(b => b.id === bookId);
            if (currentBook && currentBook.status !== 'reading'){
                currentBook.status = 'reading';
                currentBook.readPages = 0;
                updateBookLibrary();
                updateBookNumber();
                updateCurrentlyReading()
                console.log(`Started reading ${currentBook.title}`)
            }
        })
    })
    // completing book 
    completeBookBtn.forEach(button => {
        button.addEventListener('click', () => {
            const bookId = parseInt(button.getAttribute('data-id'));
            const currentBook = books.find(b => b.id === bookId);
            if (currentBook && currentBook.status !== 'completed'){
                currentBook.status = 'completed';
                updateBookLibrary();
                updateBookNumber();
                updateCurrentlyReading()
                console.log(`Completed ${currentBook.title}`)
            }
        })
    })
    // reading the review
    viewReview.forEach(button => {
        button.addEventListener('click', ()=>{
            const bookId = parseInt(button.getAttribute('data-id'));
            const currentBook = books.find(b => b.id === bookId);
            if (currentBook && currentBook.review){
                userReviewText.innerHTML = `${currentBook.title}<br><br>${currentBook.review.replace(/\n/g, '<br>')}`;
                reviewModalWindow.style.display = 'flex';
            }
        })
    })
    addReviewBtn.forEach(button => {
        button.addEventListener('click', () => {
            const bookId = parseInt(button.getAttribute('data-id'));
            const currentBook = books.find(b => b.id === bookId);
            if (currentBook){
                ratingCurrentBook = currentBook;
                document.getElementById('finishedBookTitle').textContent = `${currentBook.title} by ${currentBook.author}`;
                ratingModalWindow.style.display = 'flex';
            }
        })
    })
}
// currently reading books
function updateCurrentlyReading(){
    let booksInProgress = books.filter(book => book.status === 'reading')
    currentlyReadingDiv.innerHTML = '';
    if (booksInProgress.length === 0){
        currentlyReadingBlock.style.display = 'none';
        console.log('no currently reading books');
        return
    }
    currentlyReadingBlock.style.display = 'block';
    booksInProgress.forEach(book => {
        const progressBookCard = document.createElement('div')
        progressBookCard.className = 'progress-book-card';
        const readPages = book.readPages || 0;
        const progressPercentage = (readPages/book.pages)*100;
        progressBookCard.innerHTML = `
            <p style="font-size:19px;">📖"${book.title}"</p>
            <p>✍️ by ${book.author}</p>
            <p>📄 Total pages: ${book.pages}</p>
            <div class="progress-container">
                <input type="range" min="0" max="${book.pages}" value="${readPages}" 
                    class="progress-slider" data-id="${book.id}">
                <div class="progress-stats">
                    <span>📖 ${readPages} / ${book.pages} pages</span>
                    <span>${Math.round(progressPercentage)}%</span>
                </div>
            </div>
            <button class="back-to-plans">Read later</button>
        `; 
        currentlyReadingDiv.appendChild(progressBookCard);
        // slider for adding pages
        const slider = progressBookCard.querySelector('.progress-slider');
        const bookId = book.id;
        slider.addEventListener('input', function(e){
            const inputPages = parseInt(e.target.value);
            const currentBook = books.find(b => b.id === bookId);
            if (currentBook){
                currentBook.readPages = inputPages;
                const statsDiv = progressBookCard.querySelector('.progress-stats');
                statsDiv.innerHTML = `
                    <span>📖 ${inputPages} / ${book.pages} pages</span>
                    <span>${Math.round(progressPercentage)}%</span>
                `;
                if (inputPages >= currentBook.pages){
                    ratingCurrentBook = currentBook;
                    document.getElementById('finishedBookTitle').textContent = `${currentBook.title} by ${currentBook.author}`;
                    ratingModalWindow.style.display = 'flex';
                }
            }
        })
        const backToPlans = progressBookCard.querySelectorAll('.back-to-plans')
        backToPlans.forEach(button => {
            button.addEventListener('click', () => {
                const bookId = parseInt(button.getAttribute('data-id'));
                const currentBook = books.find(b => b.id === bookId);
                const confirmRemoval = confirm(`Return "${book.title}" back to plans?`)
                if (confirmRemoval){
                    book.status = 'plans'
                    booksInProgress = books.filter(b => b.id !== bookId);
                    updateBookLibrary();
                    updateBookNumber();
                    updateCurrentlyReading()
                    console.log(`Removed ${book.title}.`)
                }
            })
        })
    })
}

// stars rating prettier
const starSpans = document.querySelectorAll('#starRatingWidget span')
starSpans.forEach(star =>{
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.rating);
        starSpans.forEach((s,idx) => {
            if (idx < selectedRating) s.classList.add('active');
            else s.classList.remove('active');
        })
    })
})

// submit rating form
submitRatingBtn.addEventListener('click', () => {
    const reviewText = completedBookReview.value.trim();
    if (selectedRating === 0){
        alert('Please select a rating (1-5 stars)');
        return
    }
    const currentBook = books.find(b => b.id === ratingCurrentBook.id);
    if (currentBook){
        currentBook.status = 'completed';
        currentBook.review = reviewText || 'No review';
        currentBook.rating = selectedRating;
        currentBook.readPages = currentBook.pages;
    }
    ratingModalWindow.style.display = 'none';
    completedBookReview.value = '';
    selectedRating = 0;
    starSpans.forEach(s=>s.classList.remove('active'));
    currentRatingBook = null;
    updateBookLibrary();
    updateBookNumber();
    updateCurrentlyReading();
})

closeReviewBtn.addEventListener('click', () => {
    reviewModalWindow.style.display = 'none';
})

editReviewBtn.addEventListener('click', () => {
    reviewModalWindow.style.display = 'none';
    ratingModalWindow.style.display = 'flex';
})

// goals setupping


// working filters
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'))
            btn.classList.add('active')
            currentFilter = btn.getAttribute('data-filter');
            updateBookLibrary();
        })
    })
}

// ========== initiating ==========
function init() {
    if (books.length === 0) {
        books = [
            { id: 101, title: "Martin Eden", author: "Jack London", pages: 456, status: "completed", readPages: 456, review: "Excellent!", rating: 5 },
            { id: 102, title: "Wuthering Heights", author: "Emily Bronte", pages: 298, status: "plans", readPages: null, review: "", rating: 0 },
            { id: 103, title: "Misery", author: "Stephen King", pages: 321, status: "reading", readPages: 150, review: "", rating: 0 },
        ];
        console.log("📚 Demo books loaded!");
    }
    updateBookNumber()
    updateBookLibrary()
    setupFilters()
    updateCurrentlyReading()
}
init();