
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";

interface AddBookProps {
  addBook: {
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
  handleChangeAddBookState: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddCategory: (e: string) => void;
  handleAddBook: () => void;
  btnAdd: boolean;
}

const AddBook: React.FC<AddBookProps> = ({
  addBook,
  bookErrors,
  categories,
  handleChangeAddBookState,
  handleAddCategory,
  handleAddBook,
  btnAdd,
}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
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
          <div className="grid items-center grid-cols-4 gap-4">
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
              value={addBook.title}
              className="col-span-3"
              onChange={(e) => {
                handleChangeAddBookState(e);
              }}
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
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
              value={addBook.author}
              className="col-span-3"
              onChange={(e) => {
                handleChangeAddBookState(e);
              }}
            />
          </div>

          <div className="grid items-center grid-cols-4 gap-4">
            <Label
              htmlFor="category"
              className={`${
                bookErrors.categoryError ? "text-red-500" : ""
              } text-right`}
              title="Chose one from list"
            >
              Category
            </Label>

            <Select
              onValueChange={(e) => {
                handleAddCategory(e);
              }}
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
          <div className="grid items-center grid-cols-4 gap-4">
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
              type="number"
              id="isbn"
              name="isbn"
              value={addBook.isbn}
              className="col-span-3"
              onChange={(e) => {
                handleChangeAddBookState(e);
              }}
            />
          </div>

          <DialogFooter>
            <div className="flex justify-end gap-2">
              <DialogClose>
                <Button variant="secondary">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back to dashboard
                </Button>
              </DialogClose>
              {!btnAdd ? (
                <Button
                  variant="ghost"
                  onClick={() => handleAddBook()}
                  type="submit"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Add Book
                </Button>
              ) : (
                <DialogClose>
                  <Button onClick={() => handleAddBook()} type="submit">
                    <Save className="w-4 h-4 mr-2" /> Add Book
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

export default AddBook;
