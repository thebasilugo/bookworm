const themes = {
	mystery: {
		primary: "#8B4513",
		secondary: "#D2691E",
		accent: "#CD853F",
		neutral: "#DEB887",
		"base-100": "#F4A460",
		"primary-content": "#FFFFFF",
		"secondary-content": "#FFFFFF",
		"accent-content": "#FFFFFF",
		"neutral-content": "#000000",
		"base-content": "#000000",
	},
	romance: {
		primary: "#FF69B4",
		secondary: "#6495ED",
		accent: "#DDA0DD",
		neutral: "#F0E6FA",
		"base-100": "#FFF0F5",
		"primary-content": "#FFFFFF",
		"secondary-content": "#FFFFFF",
		"accent-content": "#000000",
		"neutral-content": "#000000",
		"base-content": "#000000",
	},
	horror: {
		primary: "#8B0000",
		secondary: "#2F4F4F",
		accent: "#800000",
		neutral: "#696969",
		"base-100": "#000000",
		"primary-content": "#FFFFFF",
		"secondary-content": "#FFFFFF",
		"accent-content": "#FFFFFF",
		"neutral-content": "#FFFFFF",
		"base-content": "#FFFFFF",
	},
	action: {
		primary: "#FF4500",
		secondary: "#1E90FF",
		accent: "#FFD700",
		neutral: "#B0C4DE",
		"base-100": "#F5F5F5",
		"primary-content": "#FFFFFF",
		"secondary-content": "#FFFFFF",
		"accent-content": "#000000",
		"neutral-content": "#000000",
		"base-content": "#000000",
	},
	thriller: {
		primary: "#2F4F4F",
		secondary: "#8B0000",
		accent: "#4682B4",
		neutral: "#708090",
		"base-100": "#1C1C1C",
		"primary-content": "#FFFFFF",
		"secondary-content": "#FFFFFF",
		"accent-content": "#FFFFFF",
		"neutral-content": "#FFFFFF",
		"base-content": "#FFFFFF",
	},
};

function setTheme(themeName) {
	const theme = themes[themeName];
	if (!theme) return;

	const root = document.documentElement;
	Object.keys(theme).forEach((key) => {
		root.style.setProperty(`--color-${key}`, theme[key]);
	});

	localStorage.setItem("bookworm_theme", themeName);
}

function getTheme() {
	return localStorage.getItem("bookworm_theme") || "mystery";
}

function applyTheme() {
	const savedTheme = getTheme();
	setTheme(savedTheme);
}
