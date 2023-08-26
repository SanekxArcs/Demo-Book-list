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
import { Pencil, ChevronLeft, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogClose } from "@radix-ui/react-dialog";

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

interface EditBookProps {
  editBook: {
    id: string;
    title: string;
    author: string;
    category: string;
    isbn: string;
    createdAt: string;
    modifiedAt: string | null;
    isActive: boolean;
  };
  bookErrors: {
    titleError: boolean;
    authorError: boolean;
    categoryError: boolean;
    isbnError: boolean;
  };
  categories: Record<string, string[]>;
  books: Book;
  handleChangeEditBookState: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditCategory: (e: string) => void;
  handleEditBook: () => void;
  btnEdit: boolean;
  setEditBook: React.Dispatch<
    React.SetStateAction<{
      id: string;
      title: string;
      author: string;
      category: string;
      isbn: string;
      createdAt: string;
      modifiedAt: string;
      isActive: boolean;
    }>
  >;
  setBookErrors: React.Dispatch<
    React.SetStateAction<{
      titleError: boolean;
      authorError: boolean;
      categoryError: boolean;
      isbnError: boolean;
    }>
  >;
}

const EditBook: React.FC<EditBookProps> = ({
  editBook,
  bookErrors,
  categories,
  books,
  handleChangeEditBookState,
  handleEditCategory,
  handleEditBook,
  btnEdit,
  setEditBook,
  setBookErrors,
}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    setEditBook({
                      id: books.id,
                      title: books.title,
                      author: books.author,
                      category: books.category,
                      isbn: books.isbn,
                      createdAt: books.createdAt,
                      modifiedAt: books.modifiedAt || "-",
                      isActive: books.isActive,
                    });
                    setBookErrors({
                      titleError: false,
                      authorError: false,
                      categoryError: false,
                      isbnError: false,
                    });
                  }}
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
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently change your
              book on our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="title"
              className={`${
                bookErrors.titleError ? "text-red-500" : ""
              } text-right`}
              title="Please write at least a 3 characters"
            >
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={editBook.title}
              className="col-span-3"
              onChange={(e) => handleChangeEditBookState(e)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="author"
              className={`${
                bookErrors.authorError ? "text-red-500" : ""
              } text-right`}
              title="Please write at least a 3 characters"
            >
              Author
            </Label>
            <Input
              id="author"
              name="author"
              value={editBook.author}
              className="col-span-3"
              onChange={(e) => handleChangeEditBookState(e)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="category"
              className="text-right"
              title="Chose one from list"
            >
              Category
            </Label>
            <Select
              onValueChange={(e) => handleEditCategory(e)}
              defaultValue={editBook.category || books.category}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chose one from list" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="rounded-md  w-full h-[30svh]">
                  <SelectGroup>
                    {Object.entries(categories).map(
                      ([categoryName, subCategories]) => {
                        return (
                          <SelectLabel
                            className="text-muted-foreground"
                            key={categoryName}
                          >
                            {categoryName}
                            {subCategories.map((subCategory) => (
                              <SelectItem
                                className="text-foreground"
                                key={subCategory}
                                value={subCategory}
                              >
                                {subCategory}
                              </SelectItem>
                            ))}
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
              className={`${
                bookErrors.isbnError ? "text-red-500" : ""
              } text-right`}
              title="Please enter 13 numbers of ISBN number"
            >
              ISBN
            </Label>
            <Input
              id="isbn"
              name="isbn"
              value={editBook.isbn}
              className="col-span-3"
              onChange={(e) => handleChangeEditBookState(e)}
            />
          </div>

          <DialogFooter>
            <div className="flex justify-end gap-2">
              <DialogClose>
                <Button variant="secondary">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to dashboard
                </Button>
              </DialogClose>
              {!btnEdit ? (
                <Button
                  variant="ghost"
                  onClick={() => handleEditBook()}
                  type="submit"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save changes
                </Button>
              ) : (
                <DialogClose>
                  <Button onClick={() => handleEditBook()} type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save changes
                  </Button>
                </DialogClose>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditBook;
