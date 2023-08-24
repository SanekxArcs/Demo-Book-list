import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
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
import { Pencil, Trash2, Star } from "lucide-react";
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

function App() {
  const [showAll, setShowAll] = useState<boolean>(true);
  const [showActive, setShowActive] = useState<boolean>(false);
  const [showDeactivated, setShowDeactivated] = useState<boolean>(false);
  const [books, setBooks] = useState([]);
  const { toast } = useToast();
  const [titleAdd, setTitleAdd] = useState<string>("");
  const [authorAdd, setAuthorAdd] = useState<string>("");
  const [categoryAdd, setCategoryAdd] = useState<string>("");
  const [isbnAdd, setISBNAdd] = useState<number>("");
  const [titleEdit, setTitleEdit] = useState<string>("");
  const [authorEdit, setAuthorEdit] = useState<string>("");
  const [categoryEdit, setCategoryEdit] = useState<string>("");
  const [isbnEdit, setISBNEdit] = useState<number>("");
  
  const [booksNumber, setBooksNumber] = useState<number>(0);

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
    const fetchData = async () => {
      try {
        const booksData = await fetchBooks();
        setBooks(booksData);
        setBooksNumber(booksData.length);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchData();
  }, [books]);

  const filteredBooks = books.filter((book) => {
    if (showAll) return true;
    if (showActive) return book.isActive === true;
    if (showDeactivated) return book.isActive === false;
    return false;
  });

  const toastShow = () => {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  };

  const handleToggleActive = async (bookId) => {
    try {
      console.log("click")
      const bookIndex = books.findIndex((book) => book.id === bookId);
      if (bookIndex === -1) {
        console.error(`Book with id ${bookId} not found.`);
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
      toastShow();

      if (response.ok) {
        setBooks((prevBooks) =>
          prevBooks.map((book, index) =>
            index === bookIndex ? { ...book, isActive: updatedIsActive } : book
          )
        );
        console.log("ok");
      } else {
        console.error("Error toggling book status:", response.status);
      }
    } catch (error) {
      console.error("Error toggling book status:", error);
    }
  };

  const handleEditBook = async (
    bookId: any,
    tit: string,
    aut: string,
    cat: string,
    isb: number
  ) => {
    try {
      const editBook = {
        title: tit,
        author: aut,
        category: cat,
        isbn: isb,
        modifiedAt: moment().format("Do MMMM YYYY, h:mm"),
        isActive: false,
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

        // Update the local state to include the new book
        setBooks((prevBooks) => [...prevBooks, editedBook]);
        console.log("Book added successfully");
        setTitleEdit("");
        setAuthorEdit("");
        setCategoryEdit("");
        setISBNEdit("");
      } else {
        console.error("Error editing book:", response.status);
      }
    } catch (error) {
      console.error("Error editing book:", error);
    }
  };

  const handleAddBook = async (
    tit: string,
    aut: string,
    cat: string,
    isb: number,
  ) => {
    try {
      const newBook = {
        id: books.length + 1,
        title: tit,
        author: aut,
        category: cat,
        isbn: isb,
        createdAt: moment().format('Do MMMM YYYY, h:mm'),
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

        // Update the local state to include the new book
        setBooks((prevBooks) => [...prevBooks, createdBook]);
        console.log("Book added successfully");
        setTitleAdd("");
        setAuthorAdd("");
        setCategoryAdd("");
        setISBNAdd("");
      } else {
        console.error("Error adding book:", response.status);
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleDeleteClick = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:5000/books/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("delete");
        toastShow();
      } else {
        console.error("Error deactivating book:", response.status);
      }
    } catch (error) {
      console.error("Error deactivating book:", error);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="grid grid-rows-[10rem_1fr_5rem] h-screen">
        <header className="container flex justify-between items-center py-5 px-10">
          <h1 className="text-3xl font-bold">
            Demo Book List <span>{booksNumber}</span>
          </h1>

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
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={titleAdd}
                    className="col-span-3"
                    onChange={(e) => setTitleAdd(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">
                    Author
                  </Label>
                  <Input
                    id="author"
                    value={authorAdd}
                    className="col-span-3"
                    onChange={(e) => setAuthorAdd(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={categoryAdd}
                    className="col-span-3"
                    onChange={(e) => setCategoryAdd(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isbn" className="text-right">
                    ISBN
                  </Label>
                  <Input
                    id="isbn"
                    value={isbnAdd}
                    className="col-span-3"
                    onChange={(e) => setISBNAdd(e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button
                    onClick={() =>
                      handleAddBook(titleAdd, authorAdd, categoryAdd, isbnAdd)
                    }
                    type="submit"
                  >
                    Save changes
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
                  <TableHead>№</TableHead>
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
                    <TableCell>{books.id + 1}</TableCell>
                    <TableCell>{books.title}</TableCell>
                    <TableCell>{books.author}</TableCell>
                    <TableCell>{books.category}</TableCell>
                    <TableCell>{books.isbn}</TableCell>
                    <TableCell>{books.createdAt}</TableCell>
                    <TableCell className="text-start">
                      {books.modifiedAt ? books.modifiedAt : "-"}
                    </TableCell>
                    <TableCell className="grid place-content-center grid-cols-3">
                      <Dialog>
                        <DialogTrigger>
                          <Button
                            className="hover:text-blue-400"
                            variant="outline"
                            size="icon"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
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
                            <Label htmlFor="username" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="username"
                              value={titleEdit ? titleEdit : books.title}
                              className="col-span-3"
                              onChange={(e) => {
                                setTitleEdit(e.target.value);
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Author
                            </Label>
                            <Input
                              id="username"
                              value={authorEdit ? authorEdit : books.author}
                              className="col-span-3"
                              onChange={(e) => {
                                setAuthorEdit(e.target.value);
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Category
                            </Label>
                            <Input
                              id="username"
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
                            <Label htmlFor="username" className="text-right">
                              Username
                            </Label>
                            <Input
                              id="username"
                              value={isbnEdit ? isbnEdit : books.isbn}
                              className="col-span-3"
                              onChange={(e) => {
                                setISBNEdit(e.target.value);
                              }}
                            />
                          </div>

                          <DialogFooter>
                            <Button
                              onClick={() =>
                                handleEditBook(
                                  books.id,
                                  titleEdit,
                                  authorEdit,
                                  categoryEdit,
                                  isbnEdit
                                )
                              }
                              type="submit"
                            >
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

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
                      {books.isActive ? (
                        ""
                      ) : (
                        <Button
                          className="hover:text-red-400"
                          onClick={() => handleDeleteClick(books.id)}
                          variant="outline"
                          size="icon"
                        >
                          <Trash2 className=" h-4 w-4" />
                        </Button>
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
      </main>
    </ThemeProvider>
  );
}

export default App;
