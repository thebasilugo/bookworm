// Review-related functions
function getReviews() {
	return getFromStorage(REVIEWS_STORAGE_KEY);
}

function saveReviews(reviews) {
	saveToStorage(REVIEWS_STORAGE_KEY, reviews);
}

function addReview(bookId, content, rating) {
	const reviews = getReviews();
	const newReview = {
		id: reviews.length > 0 ? Math.max(...reviews.map((r) => r.id)) + 1 : 1,
		bookId,
		content,
		rating,
		date: new Date().toISOString(),
	};
	reviews.push(newReview);
	saveReviews(reviews);
}

function editReview(id, updatedReview) {
	let reviews = getReviews();
	const index = reviews.findIndex((review) => review.id === parseInt(id));
	if (index !== -1) {
		reviews[index] = { ...reviews[index], ...updatedReview };
		saveReviews(reviews);
	}
}

function deleteReview(id) {
	let reviews = getReviews();
	reviews = reviews.filter((review) => review.id !== parseInt(id));
	saveReviews(reviews);
}

function renderRatingEmojis(rating) {
	return [1, 2, 3, 4, 5]
		.map(
			(i) =>
				`<span class="text-2xl">${i <= rating ? getRatingEmoji(i) : "☆"}</span>`
		)
		.join("");
}

function updateRatingEmojis(rating, prefix = "") {
	document.querySelectorAll(`.${prefix}ratingEmoji`).forEach((emoji) => {
		const emojiRating = parseInt(emoji.getAttribute("data-rating"));
		emoji.textContent = getRatingEmoji(emojiRating);
		emoji.classList.toggle("opacity-50", emojiRating > rating);
	});
}

function getRatingEmoji(rating) {
	const emojis = ["😞", "😐", "🙂", "😊", "😃"];
	return emojis[rating - 1];
}
