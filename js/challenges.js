// Challenge-related functions
function getChallenges() {
	return getFromStorage(CHALLENGES_STORAGE_KEY);
}

function saveChallenges(challenges) {
	saveToStorage(CHALLENGES_STORAGE_KEY, challenges);
}

function addChallenge(name, target, endDate) {
	const challenges = getChallenges();
	const newChallenge = {
		id:
			challenges.length > 0 ? Math.max(...challenges.map((c) => c.id)) + 1 : 1,
		name,
		target,
		progress: 0,
		startDate: new Date().toISOString(),
		endDate,
	};
	challenges.push(newChallenge);
	saveChallenges(challenges);
}

function editChallenge(id, updatedChallenge) {
	let challenges = getChallenges();
	const index = challenges.findIndex(
		(challenge) => challenge.id === parseInt(id)
	);
	if (index !== -1) {
		challenges[index] = { ...challenges[index], ...updatedChallenge };
		saveChallenges(challenges);
	}
}

function deleteChallenge(id) {
	let challenges = getChallenges();
	challenges = challenges.filter((challenge) => challenge.id !== parseInt(id));
	saveChallenges(challenges);
}

function updateChallengeProgress(id) {
	const challenges = getChallenges();
	const challenge = challenges.find((c) => c.id === parseInt(id));
	if (challenge) {
		const newProgress = prompt(
			`Enter new progress for "${challenge.name}" (current: ${challenge.progress}/${challenge.target}):`,
			challenge.progress
		);
		if (newProgress !== null) {
			challenge.progress = parseInt(newProgress);
			saveChallenges(challenges);
		}
	}
}

function updateChallenges() {
	const challenges = getChallenges();
	const books = getBooks();

	challenges.forEach((challenge) => {
		if (challenge.name.includes("books")) {
			challenge.progress = books.filter(
				(book) =>
					book.status === "read" &&
					new Date(book.dateRead) >= new Date(challenge.startDate) &&
					new Date(book.dateRead) <= new Date(challenge.endDate)
			).length;
		}
		// Add more challenge types here
	});

	saveChallenges(challenges);
}

