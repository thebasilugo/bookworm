// Local storage keys
const BOOKS_STORAGE_KEY = "bookworm_books";
const REVIEWS_STORAGE_KEY = "bookworm_reviews";
const CHALLENGES_STORAGE_KEY = "bookworm_challenges";
const USER_STORAGE_KEY = "bookworm_user";

// Helper functions for localStorage
function getFromStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}

function saveToStorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

// Initialize local storage with sample data if empty
function initializeStorage() {
	if (!localStorage.getItem(BOOKS_STORAGE_KEY)) {
		const sampleBooks = [
			{
				id: 1,
				title: "To Kill a Mockingbird",
				author: "Harper Lee",
				genre: "Classic",
				pages: 281,
				dateAdded: "2023-01-15",
				dateRead: "2023-02-20",
				status: "read",
			},
			{
				id: 2,
				title: "1984",
				author: "George Orwell",
				genre: "Dystopian",
				pages: 328,
				dateAdded: "2023-02-01",
				dateRead: null,
				status: "to-read",
			},
			{
				id: 3,
				title: "Pride and Prejudice",
				author: "Jane Austen",
				genre: "Romance",
				pages: 432,
				dateAdded: "2023-03-10",
				dateRead: "2023-04-15",
				status: "read",
			},
		];
		saveToStorage(BOOKS_STORAGE_KEY, sampleBooks);
	}

	if (!localStorage.getItem(REVIEWS_STORAGE_KEY)) {
		const sampleReviews = [
			{
				id: 1,
				bookId: 1,
				rating: 5,
				content: "A classic that everyone should read.",
				date: "2023-02-21",
			},
			{
				id: 2,
				bookId: 3,
				rating: 4,
				content: "Beautifully written romance with witty dialogue.",
				date: "2023-04-16",
			},
		];
		saveToStorage(REVIEWS_STORAGE_KEY, sampleReviews);
	}

	if (!localStorage.getItem(CHALLENGES_STORAGE_KEY)) {
		const sampleChallenges = [
			{
				id: 1,
				name: "Read 20 books in 2023",
				target: 20,
				progress: 2,
				startDate: "2023-01-01",
				endDate: "2023-12-31",
			},
			{
				id: 2,
				name: "Explore 5 new genres",
				target: 5,
				progress: 1,
				startDate: "2023-01-01",
				endDate: "2023-12-31",
			},
		];
		saveToStorage(CHALLENGES_STORAGE_KEY, sampleChallenges);
	}

	if (!localStorage.getItem(USER_STORAGE_KEY)) {
		const sampleUser = {
			name: "Book Lover",
			joinDate: "2023-01-01",
			totalBooksRead: 2,
			favoriteGenre: "Classic",
		};
		saveToStorage(USER_STORAGE_KEY, sampleUser);
	}
}

// Initialize storage on load
initializeStorage();

