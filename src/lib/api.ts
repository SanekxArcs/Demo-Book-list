export const API_URL_BOOKS =
  "https://inexperiencedwrathfulgui--sanekxarcs.repl.co/books";
const API_URL_CATEGOIES =
  "https://inexperiencedwrathfulgui--sanekxarcs.repl.co/categories";

export const fetchBooks = async () => {
  const response = await fetch(API_URL_BOOKS);
  if (!response.ok) throw new Error("Failed to fetch books");
  return await response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(API_URL_CATEGOIES);
  if (!response.ok) throw new Error("Failed to fetch Categorie");
  return await response.json();
};

