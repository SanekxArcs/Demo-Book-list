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
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useToast } from "@/components/ui/use-toast";
import { fetchBooks } from "./components/api";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Pencil,
  Trash2,
  Star,
  ChevronLeft,
  Save,
  ChevronUp,
} from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollArea } from "./components/ui/scroll-area";
import { Plus, Filter } from "lucide-react";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";

function App() {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showActive, setShowActive] = useState<boolean>(true);
  const [showDeactivated, setShowDeactivated] = useState<boolean>(false);
  const [books, setBooks] = useState([]);
  const [titleAdd, setTitleAdd] = useState<string>("");
  const [authorAdd, setAuthorAdd] = useState<string>("");
  const [categoryAdd, setCategoryAdd] = useState<string>("");
  const [isbnAdd, setISBNAdd] = useState<number>();
  const [titleEdit, setTitleEdit] = useState<string>("");
  const [authorEdit, setAuthorEdit] = useState<string>("");
  const [categoryEdit, setCategoryEdit] = useState<string>("");
  const [isbnEdit, setISBNEdit] = useState<number>();
  const [titleError, setTitleError] = useState<boolean>(false);
  const [authorError, setAuthorError] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<boolean>(false);
  const [isbnError, setISBNError] = useState<boolean>(false);
  const [btnAdd, setBtnAdd] = useState<boolean>(false);
  const [btnEdit, setBtnEdit] = useState<boolean>(false);
  const [filteredBooksNumber, setFilteredBooksNumber] = useState<number>(0);
  const [booksNumber, setBooksNumber] = useState<number>(0);
  const { toast } = useToast();

  const handleShowAllClick = () => {
    setShowAll(true);
    setShowActive(false);
    setShowDeactivated(false);
  };

  const handleShowActiveClick = () => {
    setShowAll(false);
    setShowActive(true);
    setShowDeactivated(false);
  };

  const handleToogleActiveClick = () => {
    setShowAll(false);
    setShowActive(false);
    setShowDeactivated(true);
  };

  // Update number of all and filtered books
  useEffect(() => {
    setFilteredBooksNumber(filteredBooks.length);
    setBooksNumber(books.length);
  }, [showActive, showDeactivated, showAll, books]);

  // Loading data from server is used to execute side-effects in functional components ones.
  useEffect(() => {
    // Define an asynchronous function to fetch book data.
    const fetchData = async () => {
      try {
        // Await the fetching of books from the fetchBooks function.
        const booksData = await fetchBooks();

        // Update the books state with the fetched data.
        setBooks(booksData);

        // Update the number of books state with the length of fetched data.
        setBooksNumber(booksData.length);

        // Display a toast notification indicating successful data fetching.
        toast({
          title: `Your books are loaded.`,
        });
      } catch (error) {
        // Log any errors that occur during the fetch.
        console.error("Error fetching books:", error);

        // Display a toast notification indicating an error occurred.
        toast({
          variant: "destructive",
          title: `Error fetching books.`,
          description: "Try again later.",
        });
      }
    };

    // Call the fetchData function to initiate the data fetch.
    fetchData();

    // Update the state for the number of filtered books.
    setFilteredBooksNumber(filteredBooks.length);

    // Empty dependency array means this useEffect will only run once, similar to componentDidMount in class components.
  }, []);

  // Define a new array called 'filteredBooks' by filtering through the 'books' array.
  const filteredBooks = books.filter((book) => {
    // If the 'showAll' flag is true, include all books without filtering.
    if (showAll) {
      return true;
    }

    // If the 'showActive' flag is true, only include books where the 'isActive' property is true.
    if (showActive) {
      return book.isActive === true;
    }

    // If the 'showDeactivated' flag is true, only include books where the 'isActive' property is false.
    if (showDeactivated) {
      return book.isActive === false;
    }

    // If none of the above conditions are met, exclude the book from the 'filteredBooks' array.
    return false;
  });

  const handleAddBook = async (
    tit: string,
    aut: string,
    cat: string,
    isb: number
  ) => {
    // Check if the 'btnAdd' state (or variable) is true before proceeding.
    if (btnAdd) {
      try {
        // Disable the 'Add' button to prevent multiple submissions.
        setBtnAdd(false);

        // Construct a new book object with the provided parameters and other default values.
        const newBook = {
          id: uuidv4(), // Generate a unique ID for the new book.
          title: tit,
          author: aut,
          category: cat,
          isbn: isb,
          createdAt: moment().format("Do MMMM YYYY, hh:mm, a"), // Set the current date and time as the creation timestamp.
          modifiedAt: null, // No modifications at the time of creation.
          isActive: false, // The book is set to inactive by default.
        };

        // Send a POST request to the backend to add the new book.
        const response = await fetch(`http://localhost:5000/books`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBook),
        });

        // If the POST request is successful, update the local state and clear the input fields.
        if (response.ok) {
          const createdBook = await response.json();
          setBooks((prevBooks) => [...prevBooks, createdBook]);
          setTitleAdd("");
          setAuthorAdd("");
          setCategoryAdd("");
          setISBNAdd();

          // Display a success notification to the user.
          toast({
            title: `Book added successfully.`,
          });
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

  const handleEditBook = async (
    bookId: any,
    tit: string,
    aut: string,
    cat: string,
    isb: number
  ) => {
    // Check if the 'btnEdit' state (or variable) is true before proceeding.
    if (btnEdit) {
      try {
        // Disable the 'Edit' button to prevent multiple submissions.
        setBtnEdit(false);

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
        const response = await fetch(`http://localhost:5000/books/${bookId}`, {
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
          setTitleEdit("");
          setAuthorEdit("");
          setCategoryEdit("");
          setISBNEdit("");

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

  const handleDeleteClick = async (bookId: any) => {
    try {
      // Send a DELETE request to the backend to remove the book with the specified ID.
      const response = await fetch(`http://localhost:5000/books/${bookId}`, {
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

  const handleToggleActive = async (bookId: any) => {
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
      const response = await fetch(`http://localhost:5000/books/${bookId}`, {
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

        // Show a toast notification indicating the action performed (added to or deleted from favorites).
        toast({
          title: `Your book ${
            updatedIsActive ? "added to" : "deleted from"
          } favorite successfully!`,
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

  const handleValidationInput = (checkData, setError, setData, data, btn) => {
    checkAdd(btn);
    setData(data);
    const regex = /^[A-Za-z0-9\.\-\_@]+$/;
    if (checkData.length <= 0 || !regex.test(checkData)) {
      setError(true);
      btn(false);
      toast({
        variant: "destructive",
        title: `Check if the input are fill in.`,
      });
      return;
    }
    setError(false);
    checkAdd(btn);
  };

  const checkAdd = (btn) => {
    if (titleError || authorError || categoryError || isbnError) {
      toast({
        variant: "destructive",
        title: `Check if the input are fill in.`,
      });
      return btn(false);
    }
    btn(true);
  };

  const bookCategories = {
    fiction: [
      "Literary",
      "Mystery",
      "Thriller",
      "Historical",
      "Romance",
      "Science Fiction",
      "Fantasy",
      "Horror",
    ],
    nonFiction: [
      "Biography",
      "Memoir",
      "Self-help",
      "Health",
      "True Crime",
      "History",
      "Science",
      "Travel",
    ],
    children: ["Picture Books", "Middle Grade", "Young Adult"],
    poetry: ["Contemporary", "Classic", "Epic", "Narrative", "Haiku"],
    classics: ["Ancient", "Medieval", "Renaissance", "Modern"],
    religious: ["Christianity", "Islam", "Hinduism", "Buddhism", "Judaism"],
    academic: ["Textbook", "Research", "Journal"],
    comics: ["Superhero", "Fantasy", "Manga", "Graphic Novels"],
  };
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="grid grid-rows-[10rem_1fr_5rem] h-screen">
        <header className=" flex flex-col md:flex-row justify-between items-center py-5 px-10">
          <div>
            <h1 className="text-3xl font-black">Demo Book List</h1>
            <h2>
              Showing {filteredBooksNumber} of <span>{booksNumber}</span>
            </h2>
          </div>

          <div className="flex gap-5">
            {/* Dropdown filter */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={showAll}
                    onCheckedChange={handleShowAllClick}
                  >
                    Show All
                  </DropdownMenuCheckboxItem>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={showActive}
                    onCheckedChange={handleShowActiveClick}
                  >
                    Show Active
                  </DropdownMenuCheckboxItem>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={showDeactivated}
                    onCheckedChange={handleToogleActiveClick}
                  >
                    Show Deactivated
                  </DropdownMenuCheckboxItem>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal window for add book */}
            <Dialog>
              <DialogTrigger>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add new Book</DialogTitle>
                  <DialogDescription>
                    This action will add new book on our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="title"
                    className={`${titleError ? "text-red-500" : ""} text-right`}
                  >
                    {`Title ${titleError ? "don`t fill corectly" : ""}`}
                  </Label>
                  <Input
                    id="title"
                    value={titleAdd}
                    className="col-span-3"
                    onChange={(e) => {
                      handleValidationInput(
                        titleAdd,
                        setTitleError,
                        setTitleAdd,
                        e.target.value,
                        setBtnAdd
                      );
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="author"
                    className={`${
                      authorError ? "text-red-500" : ""
                    } text-right`}
                  >
                    Author
                  </Label>
                  <Input
                    id="author"
                    value={authorAdd}
                    className="col-span-3"
                    onChange={(e) =>
                      handleValidationInput(
                        authorAdd,
                        setAuthorError,
                        setAuthorAdd,
                        e.target.value,
                        setBtnAdd
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="category"
                    className={`${
                      categoryError ? "text-red-500" : ""
                    } text-right`}
                  >
                    Category
                  </Label>

                  <Select
                    onValueChange={(e) => {
                      setCategoryAdd(e);
                    }}
                  >
                    <SelectTrigger className=" col-span-3">
                      <SelectValue placeholder="Chose one from list" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="rounded-md  w-full h-[30vh]">
                        <SelectGroup>
                          {Object.entries(bookCategories).map(
                            ([category, subCategories]) => {
                              return (
                                <SelectLabel
                                  className=" text-muted-foreground"
                                  key={category}
                                >
                                  {category}
                                  {subCategories.map((subCategory) => {
                                    return (
                                      <SelectItem
                                        className=" text-foreground"
                                        key={subCategory}
                                        value={subCategory}
                                      >
                                        {subCategory}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectLabel>
                              );
                            }
                          )}
                        </SelectGroup>
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="isbn"
                    className={`${isbnError ? "text-red-500" : ""} text-right`}
                  >
                    ISBN
                  </Label>
                  <Input
                    id="isbn"
                    value={isbnAdd}
                    className="col-span-3"
                    onChange={(e) => {
                      handleValidationInput(
                        isbnAdd,
                        setISBNError,
                        setISBNAdd,
                        e.target.value,
                        setBtnAdd
                      );
                    }}
                  />
                </div>

                <DialogFooter>
                  <DialogClose>
                    <Button variant="secondary">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back to dashboard
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={() =>
                      handleAddBook(titleAdd, authorAdd, categoryAdd, isbnAdd)
                    }
                    type="submit"
                  >
                    <Save className="mr-2 h-4 w-4" /> Add Book
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <section className="flex flex-col w-full rounded-md border overflow-auto">

          <ScrollArea  className=" w-full h-[68vh]">
            <Table className="">
              <TableCaption>A list of books from fake DB.</TableCaption>
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
                {filteredBooks.map((books: any) => (
                  <TableRow key={books.id}>
                    <TableCell>{books.title ? books.title : "-"}</TableCell>
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

                      <Dialog>
                        <DialogTrigger>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className="hover:text-blue-400"
                                  variant="outline"
                                  size="icon"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit book</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Are you sure absolutely sure?
                            </DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently change your book on our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="title"
                              value={titleEdit ? titleEdit : books.title}
                              className="col-span-3"
                              onChange={(e) => {
                                setTitleEdit(e.target.value);
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="author" className="text-right">
                              Author
                            </Label>
                            <Input
                              id="author"
                              value={authorEdit ? authorEdit : books.author}
                              className="col-span-3"
                              onChange={(e) => {
                                setAuthorEdit(e.target.value);
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                              Category
                            </Label>
                            <Select
                              onValueChange={(e) => {
                                setCategoryEdit(e);
                              }}
                              defaultValue={books.category}
                            >
                              <SelectTrigger className=" col-span-3">
                                <SelectValue placeholder="Chose one from list" />
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="rounded-md  w-full h-[30vh]">
                                  <SelectGroup>
                                    {Object.entries(bookCategories).map(
                                      ([category, subCategories]) => {
                                        return (
                                          <SelectLabel
                                            className=" text-muted-foreground"
                                            key={category}
                                          >
                                            {category}
                                            {subCategories.map(
                                              (subCategory) => {
                                                return (
                                                  <SelectItem
                                                    className=" text-foreground"
                                                    key={subCategory}
                                                    value={subCategory}
                                                  >
                                                    {subCategory}
                                                  </SelectItem>
                                                );
                                              }
                                            )}
                                          </SelectLabel>
                                        );
                                      }
                                    )}
                                  </SelectGroup>
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isbn" className="text-right">
                              ISBN
                            </Label>
                            <Input
                              id="isbn"
                              value={isbnEdit ? isbnEdit : books.isbn}
                              className="col-span-3"
                              onChange={(e) => {
                                setISBNEdit(e.target.value);
                              }}
                            />
                          </div>

                          <DialogFooter>
                            <DialogClose>
                              <Button variant="secondary">
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back to
                                dashboard
                              </Button>
                            </DialogClose>

                            <Button
                              onClick={() =>
                                handleAddBook(
                                  titleAdd,
                                  authorAdd,
                                  categoryAdd,
                                  isbnAdd
                                )
                              }
                              type="submit"
                            >
                              <Save className="mr-2 h-4 w-4" /> Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Add to favorite  */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleToggleActive(books.id)}
                              className="hover:text-yellow-200"
                              variant="outline"
                              size="icon"
                            >
                              <Star
                                className={`${
                                  books.isActive ? "text-yellow-400" : " "
                                } h-4 w-4`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {books.isActive ? "Delete from " : "Add to "}
                              favorite
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* delete btn show when favofit is active */}
                      {books.isActive ? (
                        ""
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="hover:text-red-400"
                                onClick={() => {
                                  handleDeleteClick(books.id);
                                }}
                                variant="outline"
                                size="icon"
                              >
                                <Trash2 className=" h-4 w-4" />
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

        {/* Footer with link */}
        <footer className="sticky bottom-o left-0 right-0 flex justify-center items-center gap-1">
          <p>Made by</p>
          <a
            className="hover:text-slate-400 transition-all"
            href="https://github.com/SanekxArcs"
            target="_blank"
          >
            Oleksandr Dzisiak
          </a>
        </footer>
        <Toaster />
      </main>
    </ThemeProvider>
  );
}

export default App;
