import { API_URL } from "./api";

export const deleteAction = async (bookId: string, setBooks: any, toast: any) => {
  try {
    const response = await fetch(`${API_URL}books/${bookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setBooks((prevBooks: any) =>
        prevBooks.filter((book: any) => book.id !== bookId)
      );

      toast({
        title: `Book deleted successfully.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: `Error deleting book.`,
        description: "Try again later.",
      });
      console.error("Error deleting book:", response.status);
    }
  } catch (error) {
    console.error("Error deleting book:", error);
  }
};