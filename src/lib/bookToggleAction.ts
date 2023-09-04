import { API_URL } from "./api";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: number;
  createdAt: string;
  modifiedAt: string | null;
  isActive: boolean;
}

export const toggleActiveAction = async (
  bookId: string,
  books: Book[],
  toast: any,
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>
) => {
  try {
    const bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex === -1) {
      toast({
        title: `Book not found.`,
        description: "Try again later.",
      });
      console.error(`Book with id ${bookId} not found.`);
      return;
    }

    const updatedIsActive = !books[bookIndex].isActive;

    const response = await fetch(`${API_URL}books/${bookId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: updatedIsActive }),
    });

    if (response.ok) {
      setBooks((prevBooks) =>
        prevBooks.map((book, index) =>
          index === bookIndex ? { ...book, isActive: updatedIsActive } : book
        )
      );

      toast({
        title: `Your book ${
          updatedIsActive ? "added to" : "deleted from"
        } active successfully!`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error toggling book status!",
        description: "Try again later.",
      });
      console.error("Error toggling book status:", response.status);
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error toggling book status!",
      description: "Try again later.",
    });
    console.error("Error toggling book status:", error);
  }
};
