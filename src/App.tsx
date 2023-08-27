import { useEffect, useState, ChangeEvent } from "react";
import { Trash2, EyeOff, Eye } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { fetchBooks, fetchCategories, API_URL_BOOKS } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditBook from "./components/EditBook";
import AddBook from "./components/AddBook";
import FilterBTN from "./components/FilterBTN";
import Footer from "./components/Footer";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  createdAt: string;
  modifiedAt: string | null;
  isActive: boolean;
}
type Categories = Record<string, string[]>;

interface FilterBtn {
  all: boolean;
  active: boolean;
  deactivated: boolean;
}

const initialCategories: Categories = {
  Fiction: ["error load"],
  "Non-Fiction": ["error load"],
  Children: ["error load"],
  Poetry: ["error load"],
  Classics: ["error load"],
  Religious: ["error load"],
  Academic: ["error load"],
  Comics: ["error load"],
};
const clearBook = {
  id: "",
  title: "",
  author: "",
  category: "",
  isbn: "",
  createdAt: "",
  modifiedAt: null,
  isActive: false,
};

function App() {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([clearBook]);
  const [addBook, setAddBooks] = useState<Book>(clearBook);
  const [btnAdd, setBtnAdd] = useState<boolean>(false);
  const [editBook, setEditBook] = useState<Book>(clearBook);
  const [btnEdit, setBtnEdit] = useState<boolean>(false);
  const [filteredBooksNumber, setFilteredBooksNumber] = useState<number>(0);
  const [booksNumber, setBooksNumber] = useState<number>(0);
  const [categories, setCategories] = useState<Categories>(initialCategories);
  const [filterBtn, setFilterBtn] = useState<FilterBtn>({
    all: false,
    active: true,
    deactivated: false,
  });
  const [bookErrors, setBookErrors] = useState({
    titleError: true,
    authorError: true,
    categoryError: true,
    isbnError: true,
  });
  // Loadr books data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await fetchBooks();
        setBooks(booksData);
        setBooksNumber(booksData.length);
        toast({
          title: `Your books are loaded.`,
        });
      } catch (error) {
        console.error("Error fetching books:", error);
        toast({
          variant: "destructive",
          title: `Error fetching books.`,
          description: "Try again later.",
        });
      }
    };
    fetchData();

    setFilteredBooksNumber(filteredBooks.length);
    setBooksNumber(books.length);
  }, []);
  // Loadr categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categoies:", error);
        setCategories({
          Fiction: ["error load"],
          "Non-Fiction": ["error load"],
          Children: ["error load"],
          Poetry: ["error load"],
          Classics: ["error load"],
          Religious: ["error load"],
          Academic: ["error load"],
          Comics: ["error load"],
        });
        toast({
          variant: "destructive",
          title: `Error fetching categoies.`,
          description: "Try again later.",
        });
      }
    };

    fetchData();
  }, []);
  // use filter, default option: show only active.
  const filteredBooks = books.filter((book) => {
    if (filterBtn.all) {
      return true;
    }

    return filterBtn.active ? book.isActive : !book.isActive;
  });
  // update UI when Filtered Books are changed
  useEffect(() => {
    setFilteredBooksNumber(filteredBooks.length);
  }, [filteredBooks]);
  // update UI when Books are changed
  useEffect(() => {
    setBooksNumber(books.length);
  }, [books]);
  // update UI when we adding book to check Errors
  useEffect(() => {
    if (
      addBook.title.length > 2 &&
      addBook.author.length > 2 &&
      addBook.category.length > 2 &&
      addBook.isbn.length > 2
    ) {
      setBtnAdd(true);
    } else {
      setBtnAdd(false);
    }
  }, [addBook]);
  // update UI when we editing book to check Errors
  useEffect(() => {
    if (
      editBook.title.length > 2 &&
      editBook.author.length > 2 &&
      editBook.category.length > 2 &&
      editBook.isbn.length > 2
    ) {
      setBtnEdit(true);
    } else {
      setBtnEdit(false);
    }
  }, [editBook]);

  // Filter Actions show: all, active or deactivated
  // All
  const handleShowAllClick = () => {
    setFilterBtn({ all: true, active: false, deactivated: false });
  };
  // Active
  const handleShowActiveClick = () => {
    setFilterBtn({ all: false, active: true, deactivated: false });
  };
  // Deactivated
  const handleShowDeactivatedClick = () => {
    setFilterBtn({ all: false, active: false, deactivated: true });
  };
  // Actions to Add book:
  // Update the addBook state, validate
  const handleChangeAddBookState = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the addBook state
    setAddBooks((prev) => {
      return { ...prev, [name]: value };
    });

    // Validate the input length and update the bookErrors state
    setBookErrors((prev) => {
      const isError = !value || value.length <= 2; // Check if the value is empty or its length is <= 3
      return { ...prev, [`${name}Error`]: isError }; // Use the dynamic key to set the error (e.g., titleError, authorError, etc.)
    });
  };
  // Update the addBook state for categories, validate
  const handleAddCategory = (e: string) => {
    // Update the addBook state
    setAddBooks((prev) => {
      return { ...prev, category: e };
    });
    // Validate the input length and update the bookErrors state
    setBookErrors((prev) => {
      const isError = !e || e.length <= 2; // Check if the value is empty or its length is <= 3
      return { ...prev, [`categoryError`]: isError }; // Use the dynamic key to set the error (e.g., titleError, authorError, etc.)
    });
  };
  // Validate and call function to send book to server
  const handleAddBook = () => {
    let errors = {
      titleError: addBook.title.length <= 2,
      authorError: addBook.author.length <= 2,
      categoryError: addBook.category.length <= 2,
      isbnError: addBook.isbn.length <= 2,
    };

    if (
      !addBook.title ||
      !addBook.author ||
      !addBook.category ||
      !addBook.isbn ||
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
      handleAddBookToDB(
        addBook.title,
        addBook.author,
        addBook.category,
        addBook.isbn
      );
    }
  };
  // Send book to server
  const handleAddBookToDB = async (
    titleDb: string,
    authorDb: string,
    categoryDb: string,
    isbnDb: string
  ) => {
    if (btnAdd) {
      try {
        const newBook = {
          id: uuidv4(), // Generate a unique ID for the new book.
          title: titleDb,
          author: authorDb,
          category: categoryDb,
          isbn: isbnDb,
          createdAt: moment().format("Do MMMM YYYY, hh:mm, a"), // Set the current date and time as the creation timestamp.
          modifiedAt: null, // No modifications at the time of creation.
          isActive: false, // The book is set to inactive by default.
        };

        const response = await fetch(`${API_URL_BOOKS}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBook),
        });

        if (response.ok) {
          const createdBook = await response.json();
          setBooks((prevBooks) => [...prevBooks, createdBook]);

          toast({
            title: `Book added successfully.`,
          });
          setAddBooks(clearBook);
        } else {
          // If the POST request fails, display an error notification.
          toast({
            variant: "destructive",
            title: `Error adding book.`,
            description: "Try again later.",
          });
          console.error("Error adding book:", response.status);
        }
      } catch (error) {
        // Log any other errors that might occur during the process.
        console.error("Error adding book:", error);
      }
    }
  };

  // Actions to Edit book:
  // Update the addBook state, validate
  const handleChangeEditBookState = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the EditBook state
    setEditBook((prev) => {
      return { ...prev, [name]: value };
    });

    // Validate the input length and update the bookErrors state
    setBookErrors((prev) => {
      const isError = !value || value.length <= 2; // Check if the value is empty or its length is <= 3
      return { ...prev, [`${name}Error`]: isError }; // Use the dynamic key to set the error (e.g., titleError, authorError, etc.)
    });
  };
  // Update the editBook state for categories, validate
  const handleEditCategory = (e: string) => {
    setEditBook((prev) => {
      return { ...prev, category: e };
    });
    setBookErrors((prev) => {
      const isError = !e || e.length <= 2; // Check if the value is empty or its length is <= 3
      return { ...prev, [`categoryError`]: isError }; // Use the dynamic key to set the error (e.g., titleError, authorError, etc.)
    });
  };
  // Validate and call function to send edited book to server
  const handleEditBook = () => {
    let errors = {
      titleError: editBook.title.length <= 2,
      authorError: editBook.author.length <= 2,
      categoryError: editBook.category.length <= 2,
      isbnError: editBook.isbn.length <= 2,
    };

    if (
      !editBook.title ||
      !editBook.author ||
      !editBook.category ||
      !editBook.isbn ||
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
      setBtnEdit(true);
      handleEditBookToDB(
        editBook.id,
        editBook.title,
        editBook.author,
        editBook.category,
        editBook.isbn
      );
    }
  };
  // Send edited book to server
  const handleEditBookToDB = async (
    bookId: string,
    tit: string,
    aut: string,
    cat: string,
    isb: string
  ) => {
    // Check if the 'btnEdit' state (or variable) is true before proceeding.
    if (btnEdit) {
      try {
        // Construct an edited book object with the provided parameters.
        const editBook = {
          id: bookId,
          title: tit,
          author: aut,
          category: cat,
          isbn: isb,
          modifiedAt: moment().format("D MMMM YYYY, hh:mm a"), // Set the current date and time as the modification timestamp.
        };

        // Send a PATCH request to the backend to update the book's details.
        const response = await fetch(`${API_URL_BOOKS}/${bookId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editBook),
        });

        // If the PATCH request is successful, update the local state with the edited book details.
        if (response.ok) {
          const editedBook = await response.json();
          setBooks((prevBooks) =>
            prevBooks.map((book) =>
              book.id === bookId ? { ...book, ...editedBook } : book
            )
          );

          // Clear the edit input fields.
          setEditBook(clearBook);

          // Display a success notification to the user.
          toast({
            title: `Book edited successfully.`,
          });
        } else {
          // If the PATCH request fails, display an error notification.
          toast({
            variant: "destructive",
            title: `Error editing book.`,
            description: "Try again later.",
          });
          console.error("Error editing book:", response.status);
        }
      } catch (error) {
        // Log any other errors that might occur during the process.
        console.error("Error editing book:", error);
      }
    }
  };
  // Delete a book from DB ( work only when book deactivated )
  const handleDeleteClick = async (bookId: string) => {
    try {
      // Send a DELETE request to the backend to remove the book with the specified ID.
      const response = await fetch(`${API_URL_BOOKS}/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If the DELETE request is successful:
      if (response.ok) {
        // Update the local state by filtering out the deleted book.
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));

        // Display a success notification to the user.
        toast({
          title: `Book deleted successfully.`,
        });
      } else {
        // If the DELETE request fails, display an error notification.
        toast({
          variant: "destructive",
          title: `Error deleting book.`,
          description: "Try again later.",
        });
        // Log the status code of the failed request for debugging purposes.
        console.error("Error deleting book:", response.status);
      }
    } catch (error) {
      // Catch any other errors that might occur during the process and log them.
      console.error("Error deleting book:", error);
    }
  };
  // Toogle status of the book: active or deactivated
  const handleToggleActive = async (bookId: string) => {
    // Start a try block to catch potential errors during the async operations.
    try {
      // Find the index of the book with the provided ID.
      const bookIndex = books.findIndex((book) => book.id === bookId);

      // If no book is found with the provided ID, log an error and show a toast notification.
      if (bookIndex === -1) {
        console.error(`Book with id ${bookId} not found.`);
        toast({
          title: `Book not found.`,
          description: "Try again later.",
        });
        return;
      }

      // Get the opposite of the current 'isActive' status for the book.
      const updatedIsActive = !books[bookIndex].isActive;

      // Make an API request to update the 'isActive' status of the book.
      const response = await fetch(`${API_URL_BOOKS}/${bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: updatedIsActive }),
      });

      // If the API request is successful, update the local state of books.
      if (response.ok) {
        setBooks((prevBooks) =>
          prevBooks.map((book, index) =>
            index === bookIndex ? { ...book, isActive: updatedIsActive } : book
          )
        );

        // Show a toast notification indicating the action performed (added to or deleted from actives).
        toast({
          title: `Your book ${
            updatedIsActive ? "added to" : "deleted from"
          } active successfully!`,
        });
      } else {
        // If the API request fails, log an error and show a toast notification.
        toast({
          variant: "destructive",
          title: "Error toggling book status!",
          description: "Try again later.",
        });
        console.error("Error toggling book status:", response.status);
      }
    } catch (error) {
      // Catch any errors during the try block and log them.
      console.error("Error toggling book status:", error);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="grid grid-rows-[20svh_75svh_5svh]  h-[100svh]">
        <header className=" flex justify-between items-center py-5 px-10">
          <div>
            <h1 className="text-3xl font-bold">Demo Book List</h1>
            <h2>
              Showing {filteredBooksNumber} of <span>{booksNumber}</span>
            </h2>
          </div>
          <div className="flex gap-5">
            {/* Dropdown filter */}
            <FilterBTN
              all={filterBtn.all}
              active={filterBtn.active}
              deactivated={filterBtn.deactivated}
              handleShowAllClick={handleShowAllClick}
              handleShowActiveClick={handleShowActiveClick}
              handleShowDeactivatedClick={handleShowDeactivatedClick}
            />
            {/* Modal window for add book */}
            <AddBook
              addBook={addBook}
              bookErrors={bookErrors}
              categories={categories}
              handleChangeAddBookState={handleChangeAddBookState}
              handleAddCategory={handleAddCategory}
              handleAddBook={handleAddBook}
              btnAdd={btnAdd}
            />
          </div>
        </header>

        {/* Section with a table */}
        <section>
          <ScrollArea className="rounded-md border p-4 w-full h-[74svh]">
            <Table>
              <TableCaption>End list of books from fake DB.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-start">Modified At</TableHead>
                  <TableHead className="text-center w-44">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((books: Book) => (
                  <TableRow key={books.id}>
                    <TableCell className="font-medium">
                      {books.title ? books.title : "-"}
                    </TableCell>
                    <TableCell>{books.author ? books.author : "-"}</TableCell>
                    <TableCell>
                      {books.category ? books.category : "-"}
                    </TableCell>
                    <TableCell>{books.isbn ? books.isbn : "-"}</TableCell>
                    <TableCell>
                      {books.createdAt ? books.createdAt : "-"}
                    </TableCell>
                    <TableCell className="text-start">
                      {books.modifiedAt ? books.modifiedAt : "-"}
                    </TableCell>
                    <TableCell className="grid gap-1 place-items-center grid-cols-3 min-w-[160px]">
                      {/* Edit book modal window */}
                      <EditBook
                        editBook={editBook}
                        bookErrors={bookErrors}
                        categories={categories}
                        books={books}
                        handleChangeEditBookState={handleChangeEditBookState}
                        handleEditCategory={handleEditCategory}
                        handleEditBook={handleEditBook}
                        btnEdit={btnEdit}
                        setEditBook={setEditBook}
                        setBookErrors={setBookErrors}
                      />

                      {/* Add to active  */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleToggleActive(books.id)}
                              className="hover:text-yellow-200"
                              variant="outline"
                              size="icon"
                            >
                              {books.isActive ? (
                                <Eye className={`h-4 w-4 text-yellow-400`} />
                              ) : (
                                <EyeOff className={`h-4 w-4`} />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {books.isActive ? "Delete from " : "Add to "}
                              active
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Delete btn show when book.isActive: true */}
                      {books.isActive ? (
                        <Button disabled variant="outline" size="icon">
                          <Trash2 className=" h-4 w-4" />
                        </Button>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="hover:text-red-500 text-red-200"
                                onClick={() => {
                                  handleDeleteClick(books.id);
                                }}
                                variant="outline"
                                size="icon"
                              >
                                <Trash2 className=" h-4 w-4 " />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete book</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <Dialog />
        </section>
        <Footer />
        <Toaster />
      </main>
    </ThemeProvider>
  );
}

export default App;
