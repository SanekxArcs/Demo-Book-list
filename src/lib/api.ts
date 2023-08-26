export const API_URL_BOOKS = "http://192.168.0.212:5000/books";
const API_URL_CATEGOIES = "http://192.168.0.212:5000/categories";

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

