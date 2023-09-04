import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "@/lib/api";

export const addBookAction = (
  bookState: any,
  setBookErrors: any,
  setBooks: any,
  toast: any,
  btnDisabled: any,
  setBookState: any,
  clearBook: any
) => {
  const errors = {
    titleError: bookState.title.length <= 2,
    authorError: bookState.author.length <= 2,
    categoryError: bookState.category.length <= 2,
    isbnError: bookState.isbn.length === 13,
  };

  if (
    !bookState.title ||
    !bookState.author ||
    !bookState.category ||
    !bookState.isbn ||
    errors.titleError ||
    errors.authorError ||
    errors.categoryError ||
    errors.isbnError
  ) {
    return setBookErrors(errors);
  }

  if (
    !errors.titleError ||
    !errors.authorError ||
    !errors.categoryError ||
    !errors.isbnError
  ) {
    handleBookStateToDB(
      bookState.title,
      bookState.author,
      bookState.category,
      bookState.isbn,
      btnDisabled,
      setBooks,
      setBookState,
      clearBook,
      toast
    );
  }
};

export const handleBookStateToDB = async (
  titleDb: string,
  authorDb: string,
  categoryDb: string,
  isbnDb: string,
  btnDisabled: boolean,
  setBooks: any,
  setBookState: any,
  clearBook: any,
  toast: any
) => {
  try {
    if (btnDisabled) {
      const newBook = {
        id: uuidv4(),
        title: titleDb,
        author: authorDb,
        category: categoryDb,
        isbn: isbnDb,
        createdAt: moment().format("Do MMMM YYYY, hh:mm, a"),
        modifiedAt: null,
        isActive: false,
      };

      const response = await fetch(`${API_URL}books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const createdBook = await response.json();
        
        setBooks((prevBooks: any) => [...prevBooks, createdBook]);

        setBookState(clearBook);
        toast({ title: "Book added successfully." });
      } else {
        toast({
          variant: "destructive",
          title: "Error adding book.",
        });
        console.error("Error adding book:", response.status);
      }
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error adding book.",
    });
    console.error("Error adding book:", error);
  }
};
