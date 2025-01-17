// Book-related functions
function getBooks() {
	return getFromStorage(BOOKS_STORAGE_KEY);
}

function saveBooks(books) {
	saveToStorage(BOOKS_STORAGE_KEY, books);
}

function addBook(title, author, genre = "", pages = 0, status = "to-read") {
	const books = getBooks();
	const newBook = {
		id: books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1,
		title,
		author,
		genre,
		pages,
		dateAdded: new Date().toISOString(),
		dateRead: null,
		status,
	};
	books.push(newBook);
	saveBooks(books);
	updateChallenges();
}

function editBook(id, updatedBook) {
	let books = getBooks();
	const index = books.findIndex((book) => book.id === parseInt(id));
	if (index !== -1) {
		books[index] = { ...books[index], ...updatedBook };
		saveBooks(books);
		updateChallenges();
	}
}

function deleteBook(id) {
	let books = getBooks();
	books = books.filter((book) => book.id !== parseInt(id));
	saveBooks(books);

	// Also delete associated reviews
	let reviews = getReviews();
	reviews = reviews.filter((review) => review.bookId !== parseInt(id));
	saveReviews(reviews);

	updateChallenges();
}

// Book search function (using Google Books API)
function searchBooks(query) {
	const apiKey = "YOUR_GOOGLE_BOOKS_API_KEY"; // Replace with your actual API key
	const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
		query
	)}&key=${apiKey}`;

	return fetch(url)
		.then((response) => response.json())
		.then((data) => {
			if (data.items && data.items.length > 0) {
				return data.items.map((book) => ({
					title: book.volumeInfo.title,
					author: book.volumeInfo.authors
						? book.volumeInfo.authors.join(", ")
						: "Unknown",
					publishedDate: book.volumeInfo.publishedDate || "Unknown",
					volumeInfo: book.volumeInfo,
				}));
			} else {
				return [];
			}
		})
		.catch((error) => {
			console.error("Error fetching books:", error);
			return [];
		});
}
