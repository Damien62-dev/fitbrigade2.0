# FitBrigade 2.0 🏋️

A workout and fitness goal tracking web application built with Flask and PostgreSQL.

## 🔗 Links

- **Live Demo:** https://fitbrigade2-0.onrender.com
- **GitHub Repository:** https://github.com/Damien62-dev/fitbrigade2.0

## About

FitBrigade 2.0 is a workout tracking application that allows users to create, edit, and manage their fitness workouts and goals. The application helps users plan training sessions, set fitness objectives, and monitor their progress through detailed statistics.

## What's New in v2.0

- **Goals Feature**: Set and track fitness goals with optional targets (weight, reps) and deadlines
- **Database Upgrade**: Migrated from JSON to PostgreSQL with SQLAlchemy ORM
- **Edit Functionality**: Edit existing workouts and goals
- **Improved Performance**: Better data relationships and persistent storage

## Features

- **Create & Edit Workouts**: Add workouts with custom names, dates, and exercises
- **Track Exercises**: Organize exercises by 12 muscle groups with sets and reps
- **Set Goals**: Create fitness objectives (strength, performance, transformation, etc.)
- **View Details**: See complete information about workouts and goals
- **Statistics Dashboard**: Monitor workout frequency and muscle group distribution
- **Responsive Design**: Mobile-friendly interface that works on all devices

## Technologies Used

### Backend
- **Python 3.x**: Programming language
- **Flask 3.1.2**: Web framework
- **SQLAlchemy 2.0.45**: ORM for database management
- **PostgreSQL**: Production database
- **Gunicorn 22.0.0**: Production server

### Frontend
- **HTML5/CSS3**: Structure and styling
- **JavaScript (ES6)**: Interactive features
- **Google Fonts**: Barlow & Oswald typography

### Hosting
- **Render.com**: Cloud deployment platform

## Installation

### Prerequisites

- Python 3.x installed on your computer
- Basic knowledge of command line/terminal

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Damien62-dev/fitbrigade2.0
   cd fitbrigade
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   
   Navigate to: `http://localhost:5000`

## Project Structure

```
FitBrigade/
├── app.py                  # Main Flask application with routes
├── models.py               # SQLAlchemy database models
├── config.py               # Configuration settings
├── requirements.txt        # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css      # Custom styling
│   ├── images/            # Image assets
│   └── js/
│       └── script.js      # Client-side interactivity
└── templates/
    ├── base.html          # Base template
    ├── index.html         # Homepage
    ├── create_workout.html    # Create workout form
    ├── edit_workout.html      # Edit workout form
    ├── workouts.html          # Workout list
    ├── workout_detail.html    # Workout details
    ├── create_goal.html       # Create goal form
    ├── edit_goal.html         # Edit goal form
    ├── goals.html             # Goal list
    ├── goal_detail.html       # Goal details
    ├── stats.html             # Statistics page
    └── about.html             # About page
```

## How to Use

### Creating a Workout

1. Click **"Create Workout"** in the navigation
2. Enter workout name and date
3. Select muscle groups to train
4. Choose exercises for each muscle group
5. Specify sets and reps for each exercise
6. Add optional notes
7. Click **"Save Workout"**

### Setting a Goal

1. Click **"Create Goal"** in the navigation
2. Enter goal name and description
3. (Optional) Select related exercise
4. (Optional) Set target weight and/or reps
5. (Optional) Set deadline
6. Click **"Save Goal"**

### Viewing Statistics

1. Click **"Statistics"** in the navigation
2. View total workout count
3. See most/least trained muscle groups
4. Review detailed frequency breakdown

## Database Design & Justification

### Why PostgreSQL?

**Migration from JSON to PostgreSQL** was driven by three key factors:

1. **Data Relationships**: The application requires complex many-to-many relationships between Workouts and MuscleGroups/Exercises. PostgreSQL with foreign keys ensures referential integrity.

2. **Performance**: As workout and goal data grows, relational database queries (with proper indexing) significantly outperform JSON file parsing.

3. **Persistence on Render**: Render's free tier has ephemeral filesystems. JSON files would be lost on restart. PostgreSQL provides persistent storage.

### User Object

The `User` model serves as the central entity for data ownership and future multi-user support:

```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)
```

**Why include User?**
- **Data Ownership**: Every Workout and Goal belongs to a specific user
- **Scalability**: Prepares the application for future authentication and multi-user functionality
- **Data Isolation**: Ensures users only see their own workouts and goals
- **Demo Mode**: Currently uses a single demo user (`user_id=1`) for simplicity

### Bridge Tables (Junction Tables)

The application uses **two bridge tables** to implement many-to-many relationships:

#### 1. WorkoutMuscleGroup

```python
class WorkoutMuscleGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'), nullable=False)
    muscle_group_id = db.Column(db.Integer, db.ForeignKey('muscle_group.id'), nullable=False)
```

**Purpose**: Links Workouts to MuscleGroups in a many-to-many relationship.

**Why needed?**
- A workout can target multiple muscle groups (e.g., "Leg Day" → Quadriceps + Glutes + Hamstrings)
- A muscle group appears in many workouts
- Without this bridge, we'd need redundant data or complex JSON structures

**Example**:
```
Workout "Upper Body Push" → [Chest, Shoulders, Triceps]
Workout "Pull Day" → [Back, Biceps, Forearms]
```

#### 2. WorkoutExercise

```python
class WorkoutExercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'), nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.String(20), nullable=False)  # "8-10", "12-15", etc.
```

**Purpose**: Links Workouts to Exercises with additional workout-specific data (sets, reps).

**Why needed?**
- A workout contains multiple exercises (e.g., "Leg Day" → Back Squat, Leg Press, Lunges)
- The same exercise appears in many workouts with different sets/reps
- **Critical**: Stores workout-specific data (sets, reps) that varies per workout

**Example**:
```
Workout "Leg Day":
  - Back Squat: 4 sets, 6-8 reps
  - Leg Press: 3 sets, 10-12 reps
  - Lunges: 3 sets, 12-15 reps
```

Without this bridge table, we couldn't store different sets/reps for the same exercise across different workouts.

### Database Normalization

The database follows **Third Normal Form (3NF)**:

- **1NF**: All attributes contain atomic values (no arrays in columns)
- **2NF**: No partial dependencies (all non-key attributes depend on the entire primary key)
- **3NF**: No transitive dependencies (no non-key attribute depends on another non-key attribute)

**Benefits**:
- Eliminates data redundancy
- Ensures data integrity through foreign keys
- Simplifies updates (e.g., changing an exercise name updates everywhere)
- Efficient queries with proper joins

### Entity Relationship Diagram

![Database ERD](docs/database_erd.png)

### Key Design Decisions

**1. MuscleGroup as Separate Table**
- Alternative: Store as ENUM or string
- Chosen approach: Separate table with foreign keys
- **Why**: Easier to add/modify muscle groups, ensures consistency, enables future features (e.g., muscle group descriptions, images)

**2. Exercise Linked to One MuscleGroup**
- Each exercise belongs to exactly one primary muscle group
- **Why**: Simplifies categorization and filtering, matches real-world fitness logic

**3. Reps as String (not Integer)**
- Stores ranges like "8-10", "12-15", "20+"
- **Why**: Real workouts use rep ranges, not exact numbers. Provides flexibility.

**4. Goal Exercise is Optional (nullable)**
- Goals can be exercise-specific OR general fitness goals
- **Why**: Supports diverse goal types (strength goals, weight loss, transformation, etc.)

**5. Demo User (user_id=1)**
- Single user for current implementation
- **Why**: Simplifies deployment while maintaining proper data structure for future multi-user expansion

### Data Seeding

The application includes a `seed_db_if_needed()` function that:
- Creates a demo user on first run
- Populates 12 muscle groups
- Adds 70+ exercises organized by muscle group
- Only runs if database is empty (idempotent)

This ensures the application works immediately without manual data entry.

## Database Tables Overview

**User**
- Stores user information (id, username, email, created_at)
- One-to-many with Workouts and Goals

**Workout**
- Workout sessions (id, user_id, name, date, notes, created_at)
- Links to User via foreign key
- Many-to-many with MuscleGroup (via WorkoutMuscleGroup)
- Many-to-many with Exercise (via WorkoutExercise)

**Goal**
- Fitness objectives (id, user_id, exercise_id, target_weight, target_reps, deadline, created_at)
- Links to User and optionally to Exercise
- Flexible: can be exercise-specific or general

**MuscleGroup**
- 12 predefined groups (id, name)
- One-to-many with Exercise

**Exercise**
- 70+ exercises (id, muscle_group_id, name)
- Belongs to one MuscleGroup
- Can be linked to Goals

**WorkoutMuscleGroup** (Junction Table)
- Links Workouts to MuscleGroups (id, workout_id, muscle_group_id)

**WorkoutExercise** (Junction Table)
- Links Workouts to Exercises with details (id, workout_id, exercise_id, sets, reps)
- Stores actual workout data (e.g., "3 sets", "8-10 reps")

## Muscle Groups

- Quadriceps
- Glutes
- Back
- Chest
- Shoulders
- Traps
- Hamstrings
- Biceps
- Triceps
- Forearms
- Calves
- Abs

## Author

Created by **Damien Mullet** as a student project for the Full Stack Developer course at UCD Professional Academy.

## License

This project is created for educational purposes.

## Acknowledgments

- Flask documentation: https://flask.palletsprojects.com/
- SQLAlchemy documentation: https://www.sqlalchemy.org/
- Google Fonts: https://fonts.google.com/
- Render.com: https://render.com/