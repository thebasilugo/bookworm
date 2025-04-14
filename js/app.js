// Main app logic and rendering functions
function renderHome() {
	const books = getBooks();
	const reviews = getReviews();
	const challenges = getChallenges();
	const user = getFromStorage(USER_STORAGE_KEY);

	const content = `
			<h2 class="text-3xl font-bold mb-6">Welcome back, ${user.name}!</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Reading Overview</h3>
							<canvas id="readingOverviewChart"></canvas>
					</div>
					<div class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Current Challenges</h3>
							<ul class="space-y-2">
									${challenges
										.map(
											(challenge) => `
											<li>
													<div class="flex justify-between items-center">
															<span>${challenge.name}</span>
															<span>${challenge.progress}/${challenge.target}</span>
													</div>
													<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
															<div class="bg-blue-600 h-2.5 rounded-full" style="width: ${
																(challenge.progress / challenge.target) * 100
															}%"></div>
													</div>
											</li>
									`
										)
										.join("")}
							</ul>
							<button id="addChallengeBtn" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add New Challenge</button>
					</div>
					<div class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Quick Add Book</h3>
							<form id="quickAddForm" class="space-y-4">
									<input type="text" id="quickAddTitle" placeholder="Book Title" class="w-full p-2 border rounded" required>
									<input type="text" id="quickAddAuthor" placeholder="Author" class="w-full p-2 border rounded" required>
									<button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Book</button>
							</form>
					</div>
			</div>
			<div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Recently Added Books</h3>
							<ul class="space-y-2">
									${books
										.slice(-5)
										.reverse()
										.map(
											(book) => `
											<li class="flex justify-between items-center">
													<a href="#" class="text-blue-600 hover:underline viewBook" data-id="${
														book.id
													}">${book.title} by ${book.author}</a>
													<span class="text-sm text-gray-500">${moment(book.dateAdded).fromNow()}</span>
											</li>
									`
										)
										.join("")}
							</ul>
							<button id="addBookBtn" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add New Book</button>
					</div>
					<div class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Latest Reviews</h3>
							<ul class="space-y-4">
									${reviews
										.slice(-3)
										.reverse()
										.map((review) => {
											const book = books.find((b) => b.id === review.bookId);
											return `
													<li>
															<h4 class="font-semibold">${book ? book.title : "Unknown Book"}</h4>
															<div class="flex items-center">
																	${renderRatingEmojis(review.rating)}
																	<span class="ml-2 text-sm text-gray-500">${moment(review.date).fromNow()}</span>
															</div>
															<p class="text-sm mt-1">${review.content.substring(0, 100)}${
												review.content.length > 100 ? "..." : ""
											}</p>
													</li>
											`;
										})
										.join("")}
							</ul>
					</div>
			</div>
	`;

	document.getElementById("content").innerHTML = content;

	// Initialize reading overview chart
	const ctx = document.getElementById("readingOverviewChart").getContext("2d");
	new Chart(ctx, {
		type: "doughnut",
		data: {
			labels: ["Read", "To Read", "Currently Reading"],
			datasets: [
				{
					data: [
						books.filter((b) => b.status === "read").length,
						books.filter((b) => b.status === "to-read").length,
						books.filter((b) => b.status === "reading").length,
					],
					backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: "bottom",
				},
			},
		},
	});

	// Add event listener for quick add form
	document
		.getElementById("quickAddForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			const title = document.getElementById("quickAddTitle").value;
			const author = document.getElementById("quickAddAuthor").value;
			addBook(title, author);
			renderHome();
		});

	// Add event listener for add challenge button
	document
		.getElementById("addChallengeBtn")
		.addEventListener("click", showAddChallengeModal);

	// Add event listener for add book button
	document
		.getElementById("addBookBtn")
		.addEventListener("click", showAddBookModal);

	// Add event listeners for view book links
	document.querySelectorAll(".viewBook").forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const bookId = e.target.getAttribute("data-id");
			showBookDetailsModal(bookId);
		});
	});
}

function renderBooks() {
	const books = getBooks();

	const content = `
			<h2 class="text-3xl font-bold mb-6">My Books</h2>
			<div class="mb-4 flex justify-between items-center">
					<input type="text" id="searchBooks" placeholder="Search books..." class="p-2 border rounded">
					<button id="addBookBtn" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add New Book</button>
			</div>
			<div class="overflow-x-auto">
					<table class="min-w-full bg-white">
							<thead class="bg-gray-100">
									<tr>
											<th class="py-2 px-4 text-left">Title</th>
											<th class="py-2 px-4 text-left">Author</th>
											<th class="py-2 px-4 text-left">Genre</th>
											<th class="py-2 px-4 text-left">Status</th>
											<th class="py-2 px-4 text-left">Actions</th>
									</tr>
							</thead>
							<tbody id="bookList">
									${books
										.map(
											(book) => `
											<tr>
													<td class="py-2 px-4">${book.title}</td>
													<td class="py-2 px-4">${book.author}</td>
													<td class="py-2 px-4">${book.genre || "N/A"}</td>
													<td class="py-2 px-4">${book.status}</td>
													<td class="py-2 px-4">
															<button class="editBook text-blue-500 hover:text-blue-700 mr-2" data-id="${
																book.id
															}">
																	<i class="fas fa-edit"></i>
															</button>
															<button class="deleteBook text-red-500 hover:text-red-700" data-id="${book.id}">
																	<i class="fas fa-trash"></i>
															</button>
													</td>
											</tr>
									`
										)
										.join("")}
							</tbody>
					</table>
			</div>
	`;

	document.getElementById("content").innerHTML = content;

	// Add event listener for search
	document
		.getElementById("searchBooks")
		.addEventListener("input", function (e) {
			const searchTerm = e.target.value.toLowerCase();
			const filteredBooks = books.filter(
				(book) =>
					book.title.toLowerCase().includes(searchTerm) ||
					book.author.toLowerCase().includes(searchTerm) ||
					(book.genre && book.genre.toLowerCase().includes(searchTerm))
			);
			renderBookList(filteredBooks);
		});

	// Add event listener for add book button
	document
		.getElementById("addBookBtn")
		.addEventListener("click", showAddBookModal);

	// Add event listeners for edit and delete buttons
	document.querySelectorAll(".editBook").forEach((button) => {
		button.addEventListener("click", () =>
			showEditBookModal(button.getAttribute("data-id"))
		);
	});

	document.querySelectorAll(".deleteBook").forEach((button) => {
		button.addEventListener("click", () =>
			showDeleteConfirmationModal(button.getAttribute("data-id"), "book")
		);
	});
}

function renderReviews(page = 1) {
	const books = getBooks();
	const reviews = getReviews();
	const reviewsPerPage = 5;
	const totalPages = Math.ceil(reviews.length / reviewsPerPage);
	const startIndex = (page - 1) * reviewsPerPage;
	const endIndex = startIndex + reviewsPerPage;
	const paginatedReviews = reviews.slice(startIndex, endIndex);

	const content = `
			<h2 class="text-3xl font-bold mb-6">Book Reviews</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Add New Review</h3>
							<form id="addReviewForm" class="space-y-4">
									<select id="reviewBookId" class="w-full p-2 border rounded" required>
											<option value="">Select a book</option>
											${books
												.filter(
													(book) =>
														!reviews.some((review) => review.bookId === book.id)
												)
												.map(
													(book) =>
														`<option value="${book.id}">${book.title}</option>`
												)
												.join("")}
									</select>
									<textarea id="reviewContent" placeholder="Write your review" class="w-full p-2 border rounded" required></textarea>
									<div>
											<label for="reviewRating" class="block mb-2">Rating:</label>
											<div id="ratingEmojis" class="flex space-x-2">
													${[1, 2, 3, 4, 5]
														.map(
															(rating) => `
															<button type="button" class="ratingEmoji text-3xl" data-rating="${rating}">
																	${getRatingEmoji(rating)}
															</button>
													`
														)
														.join("")}
											</div>
											<input type="hidden" id="reviewRating" value="0">
									</div>
									<button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Review</button>
							</form>
					</div>
					<div class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Review List</h3>
							<ul id="reviewList" class="space-y-4">
									${paginatedReviews
										.map((review) => {
											const book = books.find((b) => b.id === review.bookId);
											return `
													<li class="border-b pb-2">
															<h4 class="font-semibold">${book ? book.title : "Unknown Book"}</h4>
															<div class="flex items-center mb-2">
																	${renderRatingEmojis(review.rating)}
															</div>
															<p>${review.content}</p>
															<div class="flex justify-between items-center mt-2">
																	<span class="text-sm text-gray-500">${moment(review.date).fromNow()}</span>
																	<div>
																			<button class="editReview text-blue-500 hover:text-blue-700 mr-2" data-id="${
																				review.id
																			}">Edit</button>
																			<button class="deleteReview text-red-500 hover:text-red-700" data-id="${
																				review.id
																			}">Delete</button>
																	</div>
															</div>
													</li>
											`;
										})
										.join("")}
							</ul>
							<div class="mt-4 flex justify-between items-center">
									<button id="prevPage" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
										page === 1 ? "opacity-50 cursor-not-allowed" : ""
									}" ${page === 1 ? "disabled" : ""}>Previous</button>
									<span>Page ${page} of ${totalPages}</span>
									<button id="nextPage" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
										page === totalPages ? "opacity-50 cursor-not-allowed" : ""
									}" ${page === totalPages ? "disabled" : ""}>Next</button>
							</div>
					</div>
			</div>
	`;

	document.getElementById("content").innerHTML = content;

	// Add event listener for add review form
	document
		.getElementById("addReviewForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			const bookId = parseInt(document.getElementById("reviewBookId").value);
			const content = document.getElementById("reviewContent").value;
			const rating = parseInt(document.getElementById("reviewRating").value);
			addReview(bookId, content, rating);
			renderReviews();
		});

	// Add event listeners for rating emojis
	document.querySelectorAll(".ratingEmoji").forEach((emoji) => {
		emoji.addEventListener("click", function () {
			const rating = parseInt(this.getAttribute("data-rating"));
			document.getElementById("reviewRating").value = rating;
			updateRatingEmojis(rating);
		});
	});

	// Add event listeners for edit and delete buttons
	document.querySelectorAll(".editReview").forEach((button) => {
		button.addEventListener("click", () =>
			showEditReviewModal(button.getAttribute("data-id"))
		);
	});

	document.querySelectorAll(".deleteReview").forEach((button) => {
		button.addEventListener("click", () =>
			showDeleteConfirmationModal(button.getAttribute("data-id"), "review")
		);
	});

	// Add event listeners for pagination
	document.getElementById("prevPage").addEventListener("click", () => {
		if (page > 1) renderReviews(page - 1);
	});

	document.getElementById("nextPage").addEventListener("click", () => {
		if (page < totalPages) renderReviews(page + 1);
	});
}

function renderChallenges() {
	const challenges = getChallenges();
	const books = getBooks();

	const content = `
			<h2 class="text-3xl font-bold mb-6">Reading Challenges</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Current Challenges</h3>
							<ul id="challengeList" class="space-y-4">
									${challenges
										.map(
											(challenge) => `
											<li>
													<h4 class="font-semibold">${challenge.name}</h4>
													<div class="flex justify-between items-center">
															<span>Progress: ${challenge.progress}/${challenge.target}</span>
															<span>${moment(challenge.endDate).fromNow(true)} left</span>
													</div>
													<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
															<div class="bg-blue-600 h-2.5 rounded-full" style="width: ${
																(challenge.progress / challenge.target) * 100
															}%"></div>
													</div>
													<div class="mt-2">
															<button class="updateChallenge text-blue-500 hover:text-blue-700 mr-2" data-id="${
																challenge.id
															}">Update Progress</button>
															<button class="editChallenge text-green-500 hover:text-green-700 mr-2" data-id="${
																challenge.id
															}">Edit</button>
															<button class="deleteChallenge text-red-500 hover:text-red-700" data-id="${
																challenge.id
															}">Delete</button>
													</div>
											</li>
									`
										)
										.join("")}
							</ul>
					</div>
					<div class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Create New Challenge</h3>
							<form id="addChallengeForm" class="space-y-4">
									<input type="text" id="challengeName" placeholder="Challenge Name" class="w-full p-2 border rounded" required>
									<input type="number" id="challengeTarget" placeholder="Target (e.g., number of books)" class="w-full p-2 border rounded" required>
									<input type="date" id="challengeEndDate" class="w-full p-2 border rounded" required>
									<button type="submit" class="w-full bg-blue-required>
									<button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Challenge</button>
							</form>
					</div>
			</div>
	`;

	document.getElementById("content").innerHTML = content;

	// Add event listener for add challenge form
	document
		.getElementById("addChallengeForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			const name = document.getElementById("challengeName").value;
			const target = parseInt(document.getElementById("challengeTarget").value);
			const endDate = document.getElementById("challengeEndDate").value;
			addChallenge(name, target, endDate);
			renderChallenges();
		});

	// Add event listeners for update, edit, and delete challenge buttons
	document.querySelectorAll(".updateChallenge").forEach((button) => {
		button.addEventListener("click", () =>
			updateChallengeProgress(button.getAttribute("data-id"))
		);
	});

	document.querySelectorAll(".editChallenge").forEach((button) => {
		button.addEventListener("click", () =>
			showEditChallengeModal(button.getAttribute("data-id"))
		);
	});

	document.querySelectorAll(".deleteChallenge").forEach((button) => {
		button.addEventListener("click", () =>
			showDeleteConfirmationModal(button.getAttribute("data-id"), "challenge")
		);
	});
}

function renderDiscover() {
	const content = `
			<h2 class="text-3xl font-bold mb-6">Discover New Books</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Search for Books</h3>
							<form id="searchBooksForm" class="space-y-4">
									<input type="text" id="searchQuery" placeholder="Enter book title, author, or ISBN" class="w-full p-2 border rounded" required>
									<button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Search</button>
							</form>
					</div>
					<div id="searchResults" class="bg-white p-6 rounded-lg shadow-md">
							<h3 class="text-xl font-semibold mb-4">Search Results</h3>
							<div id="resultsContent"></div>
					</div>
			</div>
	`;

	document.getElementById("content").innerHTML = content;

	// Add event listener for search form
	document
		.getElementById("searchBooksForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			const query = document.getElementById("searchQuery").value;
			searchBooks(query).then((results) => {
				const resultsContent = document.getElementById("resultsContent");
				if (results.length > 0) {
					resultsContent.innerHTML = results
						.map(
							(book) => `
									<div class="mb-4 p-4 border rounded">
											<h4 class="font-semibold">${book.title}</h4>
											<p>Author: ${book.author}</p>
											<p>Published: ${book.publishedDate}</p>
											<button class="addToLibrary mt-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" data-book='${JSON.stringify(
												book.volumeInfo
											)}'>Add to Library</button>
									</div>
							`
						)
						.join("");

					// Add event listeners for "Add to Library" buttons
					document.querySelectorAll(".addToLibrary").forEach((button) => {
						button.addEventListener("click", function () {
							const bookInfo = JSON.parse(this.getAttribute("data-book"));
							addBook(
								bookInfo.title,
								bookInfo.authors ? bookInfo.authors[0] : "Unknown",
								bookInfo.categories ? bookInfo.categories[0] : "",
								bookInfo.pageCount || 0
							);
							alert("Book added to your library!");
						});
					});
				} else {
					resultsContent.innerHTML = "<p>No results found.</p>";
				}
			});
		});
}

// Navigation
function navigate(page) {
	switch (page) {
		case "home":
			renderHome();
			break;
		case "books":
			renderBooks();
			break;
		case "reviews":
			renderReviews();
			break;
		case "challenges":
			renderChallenges();
			break;
		case "discover":
			renderDiscover();
			break;
		default:
			renderHome();
	}
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
	// Navigation event listeners
	document.querySelectorAll("nav a").forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			navigate(e.target.getAttribute("data-page"));
		});
	});

	// Modal close event listener
	document.getElementById("modal").addEventListener("click", (e) => {
		if (e.target === document.getElementById("modal")) {
			hideModal();
		}
	});

	// Hamburger menu event listener
	document.getElementById("hamburger").addEventListener("click", () => {
		const mobileNav = document.getElementById("mobileNav");
		mobileNav.classList.toggle("hidden");
	});

	// Mobile navigation event listeners
	document.querySelectorAll("#mobileNav a").forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			navigate(e.target.getAttribute("data-page"));
			document.getElementById("mobileNav").classList.add("hidden");
		});
	});

	// Initial render
	renderHome();
});
