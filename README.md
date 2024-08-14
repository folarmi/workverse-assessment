# Real-Time Collaborative To-Do List

This project is a real-time collaborative to-do list application that allows multiple users to interact with the same task list. Users can create, update, and delete tasks, with all changes reflected in real time across all users' interfaces. The application also tracks who created each task and who last updated it.

## Features

- **Real-Time Updates:** Task creation, updates, and deletions are broadcast in real time to all users via WebSockets using Pusher.
- **User Tracking:** The application stores the current user in local storage upon login. This information is used to track who created or updated each task.
- **Local Storage:** Task data is initially stored in local storage on login, allowing for user-specific task management.
- **Login Page:** A simple login page is included to simulate user authentication. On login, the current user and default tasks are pushed to local storage.

## Technologies Used

- **Next.js:** The React framework used to build the application.
- **TypeScript:** Ensures type safety throughout the application.
- **Pusher:** Used for real-time WebSocket communication to synchronize tasks across users.
- **Tailwind CSS:** Utility-first CSS framework used for styling the application.

## Setup and Installation

1. **Clone the Repository:**

- git clone https://github.com/folarmi/workverse-assessment.git
- cd real-time-todo-list

2. **Install Dependencies:**
   npm install

3. **Configure Env:**
   I'll provide an env file for this step

4. **Run the Development Server:**
   npm run dev

5. **Access the Application:**
   Open your browser and go to http://localhost:3000 to use the application.

## Usage

### Login

- Upon loading the application, you will be presented with a login page. Enter a username to log in.
- The current user and a set of default tasks are stored in local storage.

### Adding a Task

- Use the task input field and submit button to add a new task.
- The task will be created under the current user’s name and broadcast in real time to other users.

### Updating a Task

- Toggle the completion status of a task by clicking on it.
- The task’s updated status and the user who last updated it will be broadcast in real time.

### Deleting a Task

- Use the delete button next to a task to remove it.
- The task will be deleted and this change will be broadcast in real time.

## Notes

- The login page is a placeholder and does not include authentication logic.
- Task data is initially stored in local storage; this allows for user-specific task management and tracking.

## Contributing

If you would like to contribute to this project, feel free to open an issue or submit a pull request.

## License

This project is open-source and available under the MIT License.
