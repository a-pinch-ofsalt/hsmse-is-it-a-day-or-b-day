fetch('./next-days.json')
    .then(response => response.json())
    .then(data => {
        const day1Title = document.querySelector('.one h2'); // Change this selector to match your HTML
        const day1Date = document.querySelector('.one p');
        const day2Title = document.querySelector('.two h2'); // Change this selector to match your HTML
        const day2Date = document.querySelector('.two p');

        let today = new Date('2024-10-25');
        let tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Normalize the date to YYYY-MM-DD format for consistent comparison
        function formatDateToYMD(date) {
            return date.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
        }

        const formattedToday = formatDateToYMD(today);
        const formattedTomorrow = formatDateToYMD(tomorrow);

        function formatDayText(date, summary) {
            const formattedDate = formatDateToYMD(date); // Normalize event date as well
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

            let aDayRegex = /\ba day\b/i;
            let bDayRegex = /\bb day\b/i;
            let sDayRegex = /\bs day\b/i;
            let cDayRegex = /\bc-day\b/i;

            let dayType;
            let article;

            if (aDayRegex.test(summary)) {
                dayType = 'A';
                article = 'an';
            } else if (bDayRegex.test(summary)) {
                dayType = 'B';
                article = 'a';
            } else if (sDayRegex.test(summary)) {
                dayType = 'S';
                article = 'an';
            } else if (cDayRegex.test(summary)) {
                dayType = 'C';
                article = 'a';
            }

            console.log(`Comparing Date: ${formattedDate}, Today: ${formattedToday}, Tomorrow: ${formattedTomorrow}`);  // Log the date comparisons

            if (formattedDate === formattedToday) {
                return `Today is ${article} ${dayType} day.`;
            } else if (formattedDate === formattedTomorrow) {
                return `Tomorrow is ${article} ${dayType} day.`;
            } else {
                return `${dayOfWeek} is ${article} ${dayType} day.`;
            }
        }

        function formatDateText(date) {
            return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        }

        if (data.length > 0) {
            const firstDate = new Date(data[0].date);
            day1Title.textContent = formatDayText(firstDate, data[0].summary);
            day1Date.textContent = formatDateText(firstDate);
        }

        if (data.length > 1) {
            const secondDate = new Date(data[1].date);
            day2Title.textContent = formatDayText(secondDate, data[1].summary);
            day2Date.textContent = formatDateText(secondDate);
        }
    })
    .catch(error => {
        console.error('Error fetching the JSON data:', error);
    });