docReady(function () {

	// --- DOM Elements ---
	const fromDateInput = document.getElementById('fromDate');
	const toDateInput = document.getElementById('toDate');
	const useCurrentTimeCheckbox = document.getElementById('useCurrentTime');
	const mainResultContainer = document.getElementById('mainResultContainer');
	const detailedResultsContainer = document.getElementById('detailedResultsContainer');
	const mainResultDiv = document.getElementById('mainResult');
	const detailedResultsDiv = document.getElementById('detailedResults');

	let timer; // For updating current time

	// --- Core Functions ---

	/**
	 * Sets the "To" date input to the current date and time.
	 */
	function setCurrentDateTime() {
		if (useCurrentTimeCheckbox.checked) {
			const now = new Date();
			// Offset the timezone to get the correct local time for the input
			now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
			toDateInput.value = now.toISOString().slice(0, 16);
			calculateAndDisplay();
		}
	}

	/**
	 * Main calculation logic.
	 */
	function calculateAndDisplay() {
		const fromDate = new Date(fromDateInput.value);
		const toDate = new Date(toDateInput.value);

		if (!fromDateInput.value || isNaN(fromDate)) {
			// Hide results if 'from' date is invalid
			mainResultContainer.classList.add('hidden');
			detailedResultsContainer.classList.add('hidden');
			return;
		}

		if (toDate < fromDate) {
			mainResultDiv.innerHTML = `<p class="text-red-400 text-lg">"From" date must be earlier than "To" date.</p>`;
			mainResultContainer.classList.remove('hidden');
			detailedResultsContainer.classList.add('hidden');
			return;
		}

		// --- Calculation ---
		let diff = toDate.getTime() - fromDate.getTime();

		// Breakdown calculation (Years, Months, Days, etc.)
		let tempDate = new Date(fromDate);
		let years = toDate.getFullYear() - fromDate.getFullYear();
		let months = toDate.getMonth() - fromDate.getMonth();
		let days = toDate.getDate() - fromDate.getDate();
		let hours = toDate.getHours() - fromDate.getHours();
		let minutes = toDate.getMinutes() - fromDate.getMinutes();
		let seconds = toDate.getSeconds() - fromDate.getSeconds();

		if (seconds < 0) { minutes--; seconds += 60; }
		if (minutes < 0) { hours--; minutes += 60; }
		if (hours < 0) { days--; hours += 24; }
		if (days < 0) {
			months--;
			// Get the last day of the previous month
			const lastDayOfPrevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0).getDate();
			days += lastDayOfPrevMonth;
		}
		if (months < 0) { years--; months += 12; }

		// Total units calculation
		const totalSeconds = diff / 1000;
		const totalMinutes = totalSeconds / 60;
		const totalHours = totalMinutes / 60;
		const totalDays = totalHours / 24;
		const totalWeeks = totalDays / 7;
		const totalMonths = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());

		// --- Display ---
		displayMainResult({ years, months, days, hours, minutes, seconds });
		displayDetailedResults({ totalMonths, totalWeeks, totalDays, totalHours, totalMinutes, totalSeconds });
	}

	/**
	 * Formats a number with commas.
	 */
	function formatNumber(num) {
		return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
	}

	/**
	 * Renders the main result (Y/M/D/H/M/S).
	 */
	function displayMainResult(duration) {
		mainResultDiv.innerHTML = ''; // Clear previous results
		const units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];

		units.forEach(unit => {
			if (duration[unit] > 0 || mainResultDiv.children.length > 0) {
				const value = duration[unit];
				if (value >= 0) {
					const item = document.createElement('div');
					item.setAttribute('class', 'whitespace-nowrap');
					item.innerHTML = `
					<span class="text-3xl md:text-4xl font-bold text-white">${value}</span>
					<span class="text-sm text-gray-400">${unit}</span>
				`;
					mainResultDiv.appendChild(item);
				}
			}
		});

		if (mainResultDiv.children.length === 0) {
			mainResultDiv.innerHTML = `<div class="text-3xl md:text-4xl font-bold text-white">0 <span class="text-sm text-gray-400">seconds</span></div>`;
		}

		mainResultContainer.classList.remove('hidden');
	}

	/**
	 * Renders the detailed, single-unit results.
	 */
	function displayDetailedResults(totals) {
		detailedResultsDiv.innerHTML = `${createDetailCard('Month', formatNumber(totals.totalMonths))}
		${createDetailCard('Weeks', formatNumber(totals.totalWeeks))}
		${createDetailCard('Days', formatNumber(totals.totalDays))}
		${createDetailCard('Hours', formatNumber(totals.totalHours))}
		${createDetailCard('Minutes', formatNumber(totals.totalMinutes))}
		${createDetailCard('Seconds', formatNumber(totals.totalSeconds))}`;
		detailedResultsContainer.classList.remove('hidden');
	}

	function createDetailCard(label, value) {
		return `<div class="bg-gray-700/50 p-4 rounded-lg text-center">
			<div class="text-2xl font-semibold text-white">${value}</div>
			<div class="text-xs text-gray-400 uppercase tracking-wider">${label}</div>
		</div>`;
	}


	// --- Event Listeners ---
	fromDateInput.addEventListener('change', calculateAndDisplay);
	toDateInput.addEventListener('change', calculateAndDisplay);

	useCurrentTimeCheckbox.addEventListener('change', () => {
		if (useCurrentTimeCheckbox.checked) {
			toDateInput.disabled = true;
			timer = setInterval(setCurrentDateTime, 1000);
			setCurrentDateTime();
		} else {
			toDateInput.disabled = false;
			clearInterval(timer);
		}
	});

	// --- Initialization ---
	function initialize() {
		// Set a default "from" date (e.g., 20 years ago)
		const defaultFrom = new Date();
		defaultFrom.setFullYear(defaultFrom.getFullYear() - 20);
		defaultFrom.setMinutes(defaultFrom.getMinutes() - defaultFrom.getTimezoneOffset());
		fromDateInput.value = defaultFrom.toISOString().slice(0, 16);

		// Initialize the "to" date
		if (useCurrentTimeCheckbox.checked) {
			toDateInput.disabled = true;
			timer = setInterval(setCurrentDateTime, 1000);
			setCurrentDateTime();
		}

		calculateAndDisplay();
	}

	initialize();

});