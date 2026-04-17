docReady(function () {

	// --- DOM Elements ---
	const fromDateInput = document.getElementById('fromDate');
	const toDateInput = document.getElementById('toDate');
	const fromCurrentTimeCheckbox = document.getElementById('fromCurrentTime');
	const toCurrentTimeCheckbox = document.getElementById('toCurrentTime');
	const mainResultContainer = document.getElementById('mainResultContainer');
	const detailedResultsContainer = document.getElementById('detailedResultsContainer');
	const mainResultDiv = document.getElementById('mainResult');
	const detailedResultsDiv = document.getElementById('detailedResults');

	let fromTimer, toTimer; // For updating current time

	// --- Core Functions ---

	/**
	 * Sets the "From" date input to the current date and time.
	 */
	function setFromCurrentDateTime() {
		if (fromCurrentTimeCheckbox.checked) {
			const now = new Date();
			// Offset the timezone to get the correct local time for the input
			now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
			fromDateInput.value = now.toISOString().slice(0, 16);
			calculateAndDisplay();
		}
	}

	/**
	 * Sets the "To" date input to the current date and time.
	 */
	function setToCurrentDateTime() {
		if (toCurrentTimeCheckbox.checked) {
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
		const fromDate = fromCurrentTimeCheckbox.checked ? new Date() : new Date(fromDateInput.value);
		const toDate = toCurrentTimeCheckbox.checked ? new Date() : new Date(toDateInput.value);

		if (!fromDateInput.value || isNaN(fromDate) || !toDateInput.value || isNaN(toDate)) {
			// Hide results if either 'from' or 'to' date is invalid
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
		const totalSeconds = Math.ceil(diff / 1000);
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

	fromCurrentTimeCheckbox.addEventListener('change', () => {
		if (fromCurrentTimeCheckbox.checked) {
			toCurrentTimeCheckbox.disabled = true;
			fromDateInput.disabled = true;
			fromTimer = setInterval(setFromCurrentDateTime, 1000);
			setFromCurrentDateTime();
		} else {
			toCurrentTimeCheckbox.disabled = false;
			fromDateInput.disabled = false;
			clearInterval(fromTimer);
		}
	});

	toCurrentTimeCheckbox.addEventListener('change', () => {
		if (toCurrentTimeCheckbox.checked) {
			fromCurrentTimeCheckbox.disabled = true;
			toDateInput.disabled = true;
			toTimer = setInterval(setToCurrentDateTime, 1000);
			setToCurrentDateTime();
		} else {
			fromCurrentTimeCheckbox.disabled = false;
			toDateInput.disabled = false;
			clearInterval(toTimer);
		}
	});

	// --- Initialization ---
	function initialize() {
		// Initialize the "from" date
		if (fromCurrentTimeCheckbox.checked) {
			toCurrentTimeCheckbox.disabled = true;
			fromDateInput.disabled = true;
			fromTimer = setInterval(setFromCurrentDateTime, 1000);
			setFromCurrentDateTime();
		}

		// Initialize the "to" date
		if (toCurrentTimeCheckbox.checked) {
			fromCurrentTimeCheckbox.disabled = true;
			toDateInput.disabled = true;
			toTimer = setInterval(setToCurrentDateTime, 1000);
			setToCurrentDateTime();
		}

		calculateAndDisplay();
	}

	initialize();

});