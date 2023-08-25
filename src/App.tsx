import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { fetchBooks } from "./components/api";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Pencil, Trash2, Star, ChevronLeft, Save } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollArea } from "./components/ui/scroll-area";
import { Plus, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";

function App() {
  const [showAll, setShowAll] = useState<boolean>(true);
  const [showActive, setShowActive] = useState<boolean>(false);
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

  useEffect(() => {
    setFilteredBooksNumber(filteredBooks.length);
  }, [showActive, showDeactivated, showAll, books]);

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
  }, []);

  const filteredBooks = books.filter((book) => {
    if (showAll) {
      return true;
    }
    if (showActive) {
      return book.isActive === true;
    }
    if (showDeactivated) {
      return book.isActive === false;
    }
    return false;
  });

  const handleToggleActive = async (bookId: any) => {
    try {
      const bookIndex = books.findIndex((book) => book.id === bookId);
      if (bookIndex === -1) {
        console.error(`Book with id ${bookId} not found.`);
        toast({
          title: `Book not found.`,
          description: "Try again later.",
        });
        return;
      }
      const updatedIsActive = !books[bookIndex].isActive;
      const response = await fetch(`http://localhost:5000/books/${bookId}`, {
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
          } favorite successfully!`,
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
    return btn(false);}
    btn(true);
  }
  const handleEditBook = async (
    bookId: any,
    tit: string,
    aut: string,
    cat: string,
    isb: number
  ) => {

    if (btnEdit) {
      try {
        setBtnEdit(false);
        const editBook = {
          id: bookId,
          title: tit,
          author: aut,
          category: cat,
          isbn: isb,
          modifiedAt: moment().format("D MMMM YYYY, hh:mm a"),
        };
        const response = await fetch(`http://localhost:5000/books/${bookId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editBook),
        });
        if (response.ok) {
          const editedBook = await response.json();
          setBooks((prevBooks) =>
            prevBooks.map((book) =>
              book.id === bookId ? { ...book, ...editedBook } : book
            )
          );
          setTitleEdit("");
          setAuthorEdit("");
          setCategoryEdit("");
          setISBNEdit("");
          toast({
            title: `Book edit successfully.`,
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

  const handleAddBook = async (
    tit: string,
    aut: string,
    cat: string,
    isb: number
  ) => {
    if (btnAdd) {
      try {
        setBtnAdd(false);
        const newBook = {
          id: uuidv4(),
          title: tit,
          author: aut,
          category: cat,
          isbn: isb,
          createdAt: moment().format("Do MMMM YYYY, hh:mm, a"),
          modifiedAt: null,
          isActive: false,
        };
        const response = await fetch(`http://localhost:5000/books`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBook),
        });
        if (response.ok) {
          const createdBook = await response.json();
          setBooks((prevBooks) => [...prevBooks, createdBook]);
          setTitleAdd("");
          setAuthorAdd("");
          setCategoryAdd("");
          setISBNAdd();
          toast({
            title: `Book added successfully.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: `Error adding book.`,
            description: "Try again later.",
          });
          console.error("Error adding book:", response.status);
        }
      } catch (error) {
        console.error("Error adding book:", error);
      }
    }
  };

  const handleDeleteClick = async (bookId: any) => {
    try {
      const response = await fetch(`http://localhost:5000/books/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));

        toast({
          title: `Book delete successfully.`,
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

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="grid grid-rows-[10rem_1fr_5rem] h-screen">
        <header className="container flex justify-between items-center py-5 px-10">
          <div>
            <h1 className="text-3xl font-black">Demo Book List</h1>
            <h2>
              Showing {filteredBooksNumber} of <span>{booksNumber}</span>
            </h2>
          </div>

          <div className="flex gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>
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
                  <Input
                    id="category"
                    value={categoryAdd}
                    className="col-span-3"
                    onChange={(e) => {
                      handleValidationInput(
                        categoryAdd,
                        setCategoryError,
                        setCategoryAdd,
                        e.target.value,
                        setBtnAdd
                      );
                    }}
                  />
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
        <section>
          <ScrollArea className="rounded-md border p-4 w-full h-[74vh]">
            <Table>
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
                    <TableCell className="grid place-content-center grid-cols-3">
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
                            <Input
                              id="category"
                              value={
                                categoryEdit ? categoryEdit : books.category
                              }
                              className="col-span-3"
                              onChange={(e) => {
                                setCategoryEdit(e.target.value);
                              }}
                            />
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="hover:text-yellow-200"
                              variant="outline"
                              size="icon"
                            >
                              <Star
                                onClick={() => handleToggleActive(books.id)}
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
