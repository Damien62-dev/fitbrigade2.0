// update the muscle group counter display
function updateMuscleCount() {
    const selectedBoxes = document.querySelectorAll('input[name="muscle_groups"]:checked');
    const totalCount = selectedBoxes.length;
    const counterElement = document.getElementById('muscleCount');
    if (counterElement) {
        let displayText = '';
        if (totalCount === 1) {
            displayText = totalCount + ' muscle group selected';
        } else {
            displayText = totalCount + ' muscle groups selected';
        }
        counterElement.textContent = displayText;
    }
}

// show or hide exercise details
function toggleExerciseDetails(muscle, exercise, event) {
    const checkbox = event.target;
    const divId = 'details_' + muscle + '_' + exercise;
    const detailsDiv = document.getElementById(divId);
    if (checkbox.checked) {
        detailsDiv.style.display = 'flex';
    } else {
        detailsDiv.style.display = 'none';
    }
}

// toggle exercise section when muscle group is selected
function toggleExercises(muscle, event) {
    const checkbox = event.target;
    const sectionId = 'exercises_' + muscle;
    const exerciseSection = document.getElementById(sectionId);
    if (checkbox.checked === true) {
        exerciseSection.style.display = 'block';
    } else {
        exerciseSection.style.display = 'none';

        const allCheckboxes = exerciseSection.querySelectorAll('input[type="checkbox"]');
        for (let i = 0; i < allCheckboxes.length; i = i + 1) {
            allCheckboxes[i].checked = false;
        }

    }
    updateMuscleCount();
}

// get references to burger menu elements
const burgerMenu = document.getElementById('burgerMenu');
const mobileMenu = document.getElementById('mobileMenu');
burgerMenu.addEventListener('click', function () {
    mobileMenu.classList.toggle('active');
    burgerMenu.classList.toggle('active');
});
// get all navigation links
const navLinks = document.querySelectorAll('.mobile-menu a');
for (let i = 0; i < navLinks.length; i = i + 1) {
    navLinks[i].addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        burgerMenu.classList.remove('active');
    });
}

// Confirm before deleting a workout
const deleteWorkoutLinks = document.querySelectorAll('a[href*="/delete/"]');

deleteWorkoutLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        if (!confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
            event.preventDefault();
        }
    });
});

// Confirm before deleting a goal
const deleteGoalLinks = document.querySelectorAll('a[href*="/delete_goal/"]');

deleteGoalLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        if (!confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
            event.preventDefault();
        }
    });
});

