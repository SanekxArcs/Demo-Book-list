const API_URL = "http://localhost:5000/books";

export const fetchBooks = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch books");
  return await response.json();
};

export const addBook = async (book: unknown) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Failed to add book");
  }
};

export const updateBook = async (bookId: unknown, updatedBook: unknown) => {
  const response = await fetch(`${API_URL}/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedBook),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Failed to update book");
  }
};

export const deleteBook = async (bookId: unknown) => {
  const response = await fetch(`${API_URL}/${bookId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Failed to delete book");
  }
};

// // List Books:
// try {
//   const books = await fetchBooks();
//   // Do something with the books...
// } catch (error) {
//   console.error("Error fetching books:", error);
// }

// // Add Book:
// const newBook = {
//   title: "New Book Title",
//   author: "Author Name",
//   // ... other fields ...
// };

// try {
//   const addedBook = await addBook(newBook);
//   // Do something with the addedBook...
// } catch (error) {
//   console.error("Error adding book:", error);
// }

// // Update Book:
// const bookId = 1; // Replace with actual ID
// const updatedData = {
//   title: "Updated Book Title",
//   // ... other updated fields ...
// };

// try {
//   const updatedBook = await updateBook(bookId, updatedData);
//   // Do something with the updatedBook...
// } catch (error) {
//   console.error("Error updating book:", error);
// }

// // Delete Book:
// const bookId = 1; // Replace with actual ID

// try {
//   await deleteBook(bookId);
//   // Maybe remove the book from UI or fetch the updated list...
// } catch (error) {
//   console.error("Error deleting book:", error);
// }
