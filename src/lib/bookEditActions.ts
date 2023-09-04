import moment from "moment";
import { API_URL } from "@/lib/api";

export const editBookAction = (
  bookState: any,
  clearBook: any,
  btnDisabled: any,
  setBooks: any,
  setBookErrors: any,
  setBookState: any,
  toast: any
) => {
  const errors = {
    titleError: bookState.title.length <= 2,
    authorError: bookState.author.length <= 2,
    categoryError: bookState.category.length <= 2,
    isbnError: bookState.isbn.length <= 2,
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
  )
    return setBookErrors(errors);

  if (
    !errors.titleError ||
    !errors.authorError ||
    !errors.categoryError ||
    !errors.isbnError
  ) {
     console.log(bookState.id);
    
    handleEditBookToDB(
      bookState,
      btnDisabled,
      setBooks,
      setBookState,
      clearBook,
      toast
    );
  }
};

const handleEditBookToDB = async (
  bookState: any,
  btnDisabled: boolean,
  setBooks: any,
  setBookState: any,
  clearBook: any,
  toast: any
) => {
  if (btnDisabled) {
    try {
      const editBook = {
        id: bookState.id,
        title: bookState.title,
        author: bookState.author,
        category: bookState.category,
        isbn: bookState.isbn,
        modifiedAt: moment().format("D MMMM YYYY, h:mm a"),
      };
      

      const response = await fetch(`${API_URL}books/${bookState.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editBook),
      });

      if (response.ok) {
        const editedBook = await response.json();
        console.log(editedBook);
        

        setBooks((prev: any) =>
          prev.map((book: any) =>
            book.id === bookState.id ? { ...book, ...editedBook } : book
          )
        );

        setBookState(clearBook);

        toast({
          title: `Book edited successfully.`,
        });
      } else {

        toast({
          variant: "destructive",
          title: `Error editing book.`,
          description: "Try again later.",
        });
        console.error("Error editing book:", response.status);
      }
    } catch (error) {
      console.error("Error editing book:", error);
    }
  }
};
