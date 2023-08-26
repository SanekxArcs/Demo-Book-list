# Demo Book List Application

This repository contains the code for a React application designed to manage a list of books. The application provides a user-friendly interface for adding, editing, and managing books. It also includes features like filtering, deactivating/reactivating books, and displaying book details.

## Table of Contents

- [Live Demo](#live-demo)
- [Description](#description)
- [Dashboard Layout](#dashboard-layout)
- [Dashboard Functionality](#dashboard-functionality)
- [Add/Edit Book Layout](#addedit-book-layout)
- [Add/Edit Book Functionality](#addedit-book-functionality)
- [Backend](#backend)
- [Frontend](#frontend)
- [UI Requirements](#ui-requirements)
- [Instructions](#instructions)
- [Contact](#contact)

## Live Demo

Check out the live project on Netlify: [Demo Book List App](https://main--demo-book-list.netlify.app/)

Please note that there might be issues with loading books from server on the live demo.

## Description

This application is a React-based solution for managing a list of books. It allows users to perform various operations such as adding new books, editing existing ones, and managing the status of books (active or deactivated). The application is designed with user-friendly features and a responsive layout.

## Dashboard Layout

The main part of the dashboard screen features a table with the following columns:

- Book title
- Author name
- Category
- ISBN
- Created At (in the format: 12 March 2022, 8:35AM)
- Modified/Edited At (in the format: 13 March 2022, 1:48PM)
- Actions (Edit, Delete, Activate/Deactivate)

Above the table, there's a filter/dropdown with options to show all records, show active records, or show deactivated records. By default, the filter is set to "Show Active." The page also includes a link to the "Add a Book" page. A sticky footer is attached at the bottom of the viewport, containing a link to the GitHub account.

## Dashboard Functionality

- The table displays data retrieved from the database.
- Users can filter data based on the selected option (Show All, Show Active, Show Deactivated).
- "Created At" and "Modified/Edited At" timestamps are automatically generated and displayed according to the user's timezone.
- Clicking the "Edit" button redirects users to the edit page with pre-populated inputs.
- Clicking the "Activate" button activates a deactivated record.
- Clicking the "Deactivate" button highlights the record as deactivated and marks it in the database.
- Delete button is available only for deactivated records and removes the book from the database.

## Add/Edit Book Layout

The Add/Edit Book page features a form with the following fields:

- Book title (text, required)
- Author name (text, required)
- Category (required, options from a list sorted by category)
- ISBN (text, required)
- Submit button ("Add a Book" or "Edit Book")
- Link to the "Dashboard" page

## Add/Edit Book Functionality

- All fields (inputs, select) require validation to prevent empty submissions and 3 characters minimum.
- On submit, the form data is stored in a fake backend DB, and the new or updated record appears in the table list.

## Backend

The application uses a fake REST API provided by [json-server](https://github.com/typicode/json-server) for CRUD operations.

## Frontend

- The latest version of React is used.
- Functional components and TypeScript are employed.
- The UI is designed with [shadcn/ui](https://ui.shadcn.com/) components.
- Icons from the [lucide-react](https://lucide.dev/) library are used.
- [uuid](https://www.npmjs.com/package/uuid) is used for generating uniqueness.
- Time-related functionalities are managed using [moment.js](https://momentjs.com/).

## UI Requirements

The application follows an eye-friendly design and is responsive.

## Instructions

To run the project on your local machine:

1. Clone this repository: `git clone [repo-link]`
2. Navigate to the project directory: `cd [project-folder]`
3. Install dependencies: `npm install`
4. Run the Vite development server: `npm run dev`
5. In a new terminal window, run the JSON server: `json-server -H "your IP like this -  192.168.0.1" -p 5000 -w db.json`
6. Access the application in your browser at `http://localhost:3000` or link provided by vite

## Contact

For any inquiries or feedback, feel free to contact:

- Oleksandr Dzisiak
- GitHub: [@SanekxArcs](https://github.com/SanekxArcs)

Enjoy exploring the React application and its features!