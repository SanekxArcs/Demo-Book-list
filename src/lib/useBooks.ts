import { useState, useEffect } from "react";
import { fetchBooks } from "@/lib/api";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const booksData = await fetchBooks();
      setBooks(booksData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const newFilteredBooks = books.filter((book) => {
      if (filter === "all") return true;
      return filter === "active" ? book.isActive : !book.isActive;
    });
    setFilteredBooks(newFilteredBooks);
  }, [books, filter]);

  const addBook = (newBook) => {
    setBooks([...books, newBook]);
  };

  const editBook = (editedBook) => {
    setBooks(
      books.map((book) => (book.id === editedBook.id ? editedBook : book))
    );
  };

  const deleteBook = (bookId) => {
    setBooks(books.filter((book) => book.id !== bookId));
  };

  return { books, filteredBooks, addBook, editBook, deleteBook, setFilter };
};
