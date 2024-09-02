document.addEventListener('DOMContentLoaded', function() {
    const calendarDates = document.getElementById('calendarDates');
    const monthYear = document.getElementById('monthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const activityModal = document.getElementById('activityModal');
    const closeModal = document.getElementById('closeModal');
    const activityForm = document.getElementById('activityForm');
    const activityTitle = document.getElementById('activityTitle');
    const activityDate = document.getElementById('activityDate');
    const activityDescription = document.getElementById('activityDescription');
    const saveActivity = document.getElementById('saveActivity');
    const deleteActivity = document.getElementById('deleteActivity');
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let activities = JSON.parse(localStorage.getItem('activities')) || [];

    function renderCalendar(month, year) {
        calendarDates.innerHTML = '';
        monthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
        const firstDay = new Date(year, month).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty');
            calendarDates.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateCell = document.createElement('div');
            dateCell.textContent = day;
            dateCell.dataset.date = new Date(year, month, day).toISOString().split('T')[0];
            dateCell.addEventListener('click', openModal);
            calendarDates.appendChild(dateCell);
        }

        highlightActivities();
    }

    function openModal(event) {
        const date = event.target.dataset.date;
        const activity = activities.find(activity => activity.date === date);
        activityTitle.value = activity ? activity.title : '';
        activityDate.value = date;
        activityDescription.value = activity ? activity.description : '';
        deleteActivity.style.display = activity ? 'inline-block' : 'none';
        activityModal.style.display = 'block';
    }

    function closeModalHandler() {
        activityModal.style.display = 'none';
    }

    function saveActivityHandler(event) {
        event.preventDefault();
        const date = activityDate.value;
        const existingActivityIndex = activities.findIndex(activity => activity.date === date);
        const newActivity = {
            title: activityTitle.value,
            date: date,
            description: activityDescription.value
        };

        if (existingActivityIndex > -1) {
            activities[existingActivityIndex] = newActivity;
        } else {
            activities.push(newActivity);
        }

        localStorage.setItem('activities', JSON.stringify(activities));
        closeModalHandler();
        renderCalendar(currentMonth, currentYear);
    }

    function deleteActivityHandler() {
        const date = activityDate.value;
        activities = activities.filter(activity => activity.date !== date);
        localStorage.setItem('activities', JSON.stringify(activities));
        closeModalHandler();
        renderCalendar(currentMonth, currentYear);
    }

    function highlightActivities() {
        const dateCells = calendarDates.querySelectorAll('div[data-date]');
        dateCells.forEach(cell => {
            const date = cell.dataset.date;
            const activity = activities.find(activity => activity.date === date);
            if (activity) {
                cell.classList.add('active');
                cell.innerHTML = `<strong>${cell.textContent}</strong><br>${activity.title}`;
            } else {
                cell.classList.remove('active');
                cell.innerHTML = `${cell.textContent}`;
            }
        });
    }

    prevMonth.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonth.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    closeModal.addEventListener('click', closeModalHandler);
    activityForm.addEventListener('submit', saveActivityHandler);
    deleteActivity.addEventListener('click', deleteActivityHandler);

    renderCalendar(currentMonth, currentYear);
});

