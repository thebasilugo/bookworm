// UI-related functions
function showModal(content) {
	const modal = document.getElementById("modal");
	const modalContent = document.getElementById("modalContent");
	modalContent.innerHTML = content;
	modal.classList.remove("hidden");
	modal.classList.add("flex");
}

function hideModal() {
	const modal = document.getElementById("modal");
	modal.classList.remove("flex");
	modal.classList.add("hidden");
}

function showFirstTimeUserModal() {
	const modalContent = `
      <h2 class="text-2xl font-bold mb-4">Welcome to BookWorm!</h2>
      <p class="mb-4">Let's personalize your experience.</p>
      <form id="userPreferencesForm" class="space-y-4">
          <div>
              <label for="userName" class="block mb-1">Your Name:</label>
              <input type="text" id="userName" class="w-full p-2 border rounded" required>
          </div>
          <div>
              <label for="userTheme" class="block mb-1">Choose a Theme:</label>
              <select id="userTheme" class="w-full p-2 border rounded" required>
                  <option value="mystery">Mystery</option>
                  <option value="romance">Romance</option>
                  <option value="horror">Horror</option>
                  <option value="action">Action</option>
                  <option value="thriller">Thriller</option>
              </select>
          </div>
          <button type="submit" class="w-full bg-primary text-primary-content px-4 py-2 rounded hover:bg-secondary transition duration-300">Get Started</button>
      </form>
  `;
	showModal(modalContent);

	document
		.getElementById("userPreferencesForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			const name = document.getElementById("userName").value;
			const theme = document.getElementById("userTheme").value;
			updateUserPreferences(name, theme);
			setTheme(theme);
			hideModal();
			renderHome();
		});
}

function showSettingsPanel() {
	const user = getFromStorage(USER_STORAGE_KEY);
	const content = `
      <h2 class="text-3xl font-bold mb-6">Settings</h2>
      <form id="settingsForm" class="space-y-4">
          <div>
              <label for="settingsName" class="block mb-1">Your Name:</label>
              <input type="text" id="settingsName" value="${
								user.name
							}" class="w-full p-2 border rounded" required>
          </div>
          <div>
              <label for="settingsTheme" class="block mb-1">Theme:</label>
              <select id="settingsTheme" class="w-full p-2 border rounded" required>
                  <option value="mystery" ${
										user.theme === "mystery" ? "selected" : ""
									}>Mystery</option>
                  <option value="romance" ${
										user.theme === "romance" ? "selected" : ""
									}>Romance</option>
                  <option value="horror" ${
										user.theme === "horror" ? "selected" : ""
									}>Horror</option>
                  <option value="action" ${
										user.theme === "action" ? "selected" : ""
									}>Action</option>
                  <option value="thriller" ${
										user.theme === "thriller" ? "selected" : ""
									}>Thriller</option>
              </select>
          </div>
          <button type="submit" class="w-full bg-primary text-primary-content px-4 py-2 rounded hover:bg-secondary transition duration-300 border">Save Changes</button>
      </form>
  `;
	document.getElementById("content").innerHTML = content;

	document
		.getElementById("settingsForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			const name = document.getElementById("settingsName").value;
			const theme = document.getElementById("settingsTheme").value;
			updateUserPreferences(name, theme);
			setTheme(theme);
			showToast("Settings saved successfully!");
			renderHome();
		});
}

function showToast(message) {
	const toast = document.createElement("div");
	toast.className =
		"fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300";
	toast.textContent = message;
	document.body.appendChild(toast);
	setTimeout(() => {
		toast.classList.add("opacity-0");
		setTimeout(() => {
			document.body.removeChild(toast);
		}, 300);
	}, 3000);
}

function showAddBookModal() {
	const modalContent = `
      <h3 class="text-lg font-bold mb-4">Add New Book</h3>
      <form id="addBookForm" class="space-y-4">
          <input type="text" id="bookTitle" placeholder="Book Title" class="w-full p-2 border rounded" required>
          <input type="text" id="bookAuthor" placeholder="Author" class="w-full p-2 border rounded" required>
          <input type="text" id="bookGenre" placeholder="Genre" class="w-full p-2 border rounded">
          <input type="number" id="bookPages" placeholder="Number of Pages" class="w-full p-2 border rounded">
          <select id="bookStatus" class="w-full p-2 border rounded" required>
              <option value="to-read">To Read</option>
              <option value="reading">Currently Reading</option>
              <option value="read">Read</option>
          </select>
          <button type="submit" class="w-full bg-primary text-primary-content px-4 py-2 rounded hover:bg-secondary transition duration-300">Add Book</button>
      </form>
  `;
	showModal(modalContent);

	document
		.getElementById("addBookForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			const title = document.getElementById("bookTitle").value;
			const author = document.getElementById("bookAuthor").value;
			const genre = document.getElementById("bookGenre").value;
			const pages = parseInt(document.getElementById("bookPages").value) || 0;
			const status = document.getElementById("bookStatus").value;
			addBook(title, author, genre, pages, status);
			hideModal();
			renderBooks();
			showToast("Book added successfully!");
		});
}

function showEditBookModal(id) {
	const books = getBooks();
	const book = books.find((b) => b.id === parseInt(id));
	if (book) {
		const modalContent = `
        <h3 class="text-lg font-bold mb-4">Edit Book</h3>
        <form id="editBookForm" class="space-y-4">
            <input type="text" id="editBookTitle" value="${
							book.title
						}" class="w-full p-2 border rounded" required>
            <input type="text" id="editBookAuthor" value="${
							book.author
						}" class="w-full p-2 border rounded" required>
            <input type="text" id="editBookGenre" value="${
							book.genre || ""
						}" class="w-full p-2 border rounded">
            <input type="number" id="editBookPages" value="${
							book.pages
						}" class="w-full p-2 border rounded">
            <select id="editBookStatus" class="w-full p-2 border rounded" required>
                <option value="to-read" ${
									book.status === "to-read" ? "selected" : ""
								}>To Read</option>
                <option value="reading" ${
									book.status === "reading" ? "selected" : ""
								}>Currently Reading</option>
                <option value="read" ${
									book.status === "read" ? "selected" : ""
								}>Read</option>
            </select>
            <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Book</button>
        </form>
    `;
		showModal(modalContent);

		document
			.getElementById("editBookForm")
			.addEventListener("submit", function (e) {
				e.preventDefault();
				const updatedBook = {
					title: document.getElementById("editBookTitle").value,
					author: document.getElementById("editBookAuthor").value,
					genre: document.getElementById("editBookGenre").value,
					pages: parseInt(document.getElementById("editBookPages").value) || 0,
					status: document.getElementById("editBookStatus").value,
				};
				editBook(id, updatedBook);
				hideModal();
				renderBooks();
			});
	}
}

function showEditReviewModal(id) {
	const reviews = getReviews();
	const review = reviews.find((r) => r.id === parseInt(id));
	if (review) {
		const modalContent = `
        <h3 class="text-lg font-bold mb-4">Edit Review</h3>
        <form id="editReviewForm" class="space-y-4">
            <textarea id="editReviewContent" class="w-full p-2 border rounded" required>${
							review.content
						}</textarea>
            <div>
                <label for="editReviewRating" class="block mb-2">Rating:</label>
                <div id="editRatingEmojis" class="flex space-x-2">
                    ${[1, 2, 3, 4, 5]
											.map(
												(rating) => `
                        <button type="button" class="editRatingEmoji text-3xl" data-rating="${rating}">
                            ${getRatingEmoji(rating)}
                        </button>
                    `
											)
											.join("")}
                </div>
                <input type="hidden" id="editReviewRating" value="${
									review.rating
								}">
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Review</button>
        </form>
    `;
		showModal(modalContent);

		updateRatingEmojis(review.rating, "edit");

		document.querySelectorAll(".editRatingEmoji").forEach((emoji) => {
			emoji.addEventListener("click", function () {
				const rating = parseInt(this.getAttribute("data-rating"));
				document.getElementById("editReviewRating").value = rating;
				updateRatingEmojis(rating, "edit");
			});
		});

		document
			.getElementById("editReviewForm")
			.addEventListener("submit", function (e) {
				e.preventDefault();
				const updatedReview = {
					content: document.getElementById("editReviewContent").value,
					rating: parseInt(document.getElementById("editReviewRating").value),
				};
				editReview(id, updatedReview);
				hideModal();
				renderReviews();
			});
	}
}

function showEditChallengeModal(id) {
	const challenges = getChallenges();
	const challenge = challenges.find((c) => c.id === parseInt(id));
	if (challenge) {
		const modalContent = `
        <h3 class="text-lg font-bold mb-4">Edit Challenge</h3>
        <form id="editChallengeForm" class="space-y-4">
            <input type="text" id="editChallengeName" value="${
							challenge.name
						}" class="w-full p-2 border rounded" required>
            <input type="number" id="editChallengeTarget" value="${
							challenge.target
						}" class="w-full p-2 border rounded" required>
            <input type="date" id="editChallengeEndDate" value="${
							challenge.endDate.split("T")[0]
						}" class="w-full p-2 border rounded" required>
            <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Challenge</button>
        </form>
    `;
		showModal(modalContent);

		document
			.getElementById("editChallengeForm")
			.addEventListener("submit", function (e) {
				e.preventDefault();
				const updatedChallenge = {
					name: document.getElementById("editChallengeName").value,
					target: parseInt(
						document.getElementById("editChallengeTarget").value
					),
					endDate: document.getElementById("editChallengeEndDate").value,
				};
				editChallenge(id, updatedChallenge);
				hideModal();
				renderChallenges();
			});
	}
}

function showDeleteConfirmationModal(id, type) {
	let item;
	let deleteFunction;

	switch (type) {
		case "book":
			item = getBooks().find((b) => b.id === parseInt(id));
			deleteFunction = deleteBook;
			break;
		case "review":
			item = getReviews().find((r) => r.id === parseInt(id));
			deleteFunction = deleteReview;
			break;
		case "challenge":
			item = getChallenges().find((c) => c.id === parseInt(id));
			deleteFunction = deleteChallenge;
			break;
	}

	if (item) {
		const modalContent = `
        <h3 class="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p>Are you sure you want to delete this ${type}?</p>
        <p class="font-semibold mt-2">Type the ${type} name to confirm:</p>
        <input type="text" id="confirmDelete" class="w-full p-2 border rounded mt-2" placeholder="Enter ${type} name">
        <div class="flex justify-end mt-4">
            <button id="cancelDelete" class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 mr-2">Cancel</button>
            <button id="confirmDeleteBtn" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" disabled>Delete</button>
        </div>
    `;
		showModal(modalContent);

		const confirmInput = document.getElementById("confirmDelete");
		const confirmBtn = document.getElementById("confirmDeleteBtn");

		confirmInput.addEventListener("input", function () {
			confirmBtn.disabled =
				this.value !== item.title && this.value !== item.name;
		});

		document
			.getElementById("cancelDelete")
			.addEventListener("click", hideModal);

		confirmBtn.addEventListener("click", function () {
			deleteFunction(id);
			hideModal();
			switch (type) {
				case "book":
					renderBooks();
					break;
				case "review":
					renderReviews();
					break;
				case "challenge":
					renderChallenges();
					break;
			}
		});
	}
}

function showBookDetailsModal(id) {
	const books = getBooks();
	const book = books.find((b) => b.id === parseInt(id));
	if (book) {
		const reviews = getReviews().filter((r) => r.bookId === book.id);
		const modalContent = `
        <h3 class="text-lg font-bold mb-4">${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre || "N/A"}</p>
        <p><strong>Pages:</strong> ${book.pages}</p>
        <p><strong>Status:</strong> ${book.status}</p>
        <p><strong>Date Added:</strong> ${moment(book.dateAdded).format(
					"MMMM D, YYYY"
				)}</p>
        ${
					book.dateRead
						? `<p><strong>Date Read:</strong> ${moment(book.dateRead).format(
								"MMMM D, YYYY"
						  )}</p>`
						: ""
				}
        <h4 class="font-semibold mt-4">Reviews:</h4>
        ${
					reviews.length > 0
						? `
            <ul class="mt-2 space-y-2">
                ${reviews
									.map(
										(review) => `
                    <li>
                        <div class="flex items-center">
                            ${renderRatingEmojis(review.rating)}
                        </div>
                        <p>${review.content}</p>
                        <p class="text-sm text-gray-500">${moment(
													review.date
												).fromNow()}</p>
                    </li>
                `
									)
									.join("")}
            </ul>
        `
						: "<p>No reviews yet.</p>"
				}
        <div class="flex justify-end mt-4">
            <button id="editBookBtn" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">Edit</button>
            <button id="deleteBookBtn" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
        </div>
    `;
		showModal(modalContent);

		document.getElementById("editBookBtn").addEventListener("click", () => {
			hideModal();
			showEditBookModal(id);
		});

		document.getElementById("deleteBookBtn").addEventListener("click", () => {
			hideModal();
			showDeleteConfirmationModal(id, "book");
		});
	}
}
