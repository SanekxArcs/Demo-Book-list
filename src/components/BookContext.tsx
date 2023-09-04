import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
// import { useBooks } from "@/lib/useBooks";
// import { useCategories } from "@/lib/useCategories";
// import useBooksNumber from "@/lib/useBooksNumber";
// import useFilteredNumber from "@/lib/useFilteredNumber";
// import useCheckErrors from "@/lib/useCheckErrors";
import { toggleActiveAction } from "@/lib/bookToggleAction";
import { deleteAction } from "@/lib/bookDeleteAction";
import { addBookAction } from "@/lib/bookAddActions";
import { editBookAction } from "@/lib/bookEditActions";
import { API_URL } from "@/lib/api";

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

type Categories = Record<string, string[]>;

interface FilterBtn {
  all: boolean;
  active: boolean;
  deactivated: boolean;
}
interface Errors {
  titleError: boolean;
  authorError: boolean;
  categoryError: boolean;
  isbnError: boolean;
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
  isbn: 0,
  createdAt: "",
  modifiedAt: null,
  isActive: false,
};

interface DefaultValue {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  categories: Categories;
  setCategories: React.Dispatch<React.SetStateAction<Categories>>;
  bookState: Book;
  setBookState: React.Dispatch<React.SetStateAction<Book>>;
  btnDisabled: boolean;
  setBtnDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  filteredNumber: number;
  setFilteredNumber: React.Dispatch<React.SetStateAction<number>>;
  booksNumber: number;
  setBooksNumber: React.Dispatch<React.SetStateAction<number>>;
  filterBtn: FilterBtn;
  setFilterBtn: React.Dispatch<React.SetStateAction<FilterBtn>>;
  bookErrors: Errors;
  setBookErrors: React.Dispatch<React.SetStateAction<Errors>>;
  filteredBooks: Book[];
  handleAddClick: () => void;
  handleEditClick: () => void;
  handleDeleteClick: (bookId: string) => void;
  handleToggleActiveClick: (bookId: string) => void;
}

const defaultValue: DefaultValue = {
  books: [clearBook],
  setBooks: () => {},
  categories: initialCategories,
  setCategories: () => {},
  bookState: clearBook,
  setBookState: () => {},
  btnDisabled: false,
  setBtnDisabled: () => {},
  filteredNumber: 0,
  setFilteredNumber: () => {},
  booksNumber: 0,
  setBooksNumber: () => {},
  filterBtn: {
    all: false,
    active: true,
    deactivated: false,
  },
  setFilterBtn: () => {},
  bookErrors: {
    titleError: false,
    authorError: false,
    categoryError: false,
    isbnError: false,
  },
  setBookErrors: () => {},
  filteredBooks: [clearBook],
  handleAddClick: () => {},
  handleEditClick: () => {},
  handleDeleteClick: () => {},
  handleToggleActiveClick: () => {},
};

const BookContext = createContext(defaultValue);
interface BookProviderProps {
  children: React.ReactNode;
}
export const useBookContext = () => useContext<DefaultValue>(BookContext);

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [bookState, setBookState] = useState<Book>(clearBook);
  const [categories, setCategories] = useState<Categories>(initialCategories);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [filteredNumber, setFilteredNumber] = useState(0);
  const [booksNumber, setBooksNumber] = useState(0);
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}books`);
      if (!response.ok) throw new Error("Failed to fetch books");

      const booksData = await response.json();
      setBooks(booksData);
      setBooksNumber(booksData.length);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}categories`);
        if (!response.ok) throw new Error("Failed to fetch Categorie");

        const categoriesData = await response.json();

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(initialCategories);
        toast({
          variant: "destructive",
          title: `Error fetching categories.`,
          description: "Try again later.",
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(books)) {
      const filtered = books.filter((book) => {
        if (filterBtn.all) {
          return true;
        }
        return filterBtn.active ? book.isActive : !book.isActive;
      });
      setFilteredBooks(filtered);
    }
  }, [books, filterBtn]);

  useEffect(() => {
    setFilteredNumber(filteredBooks.length);
  }, [filteredBooks]);

  useEffect(() => {
    setBooksNumber(books.length);
  }, [books]);

  useEffect(() => {
    if (
      bookState.title.length > 2 &&
      bookState.author.length > 2 &&
      bookState.category.length > 2 &&
      bookState.isbn?.toString().length > 2
    ) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [bookState]);

  const handleAddClick = () => {
    addBookAction(
      bookState,
      setBookErrors,
      setBooks,
      toast,
      btnDisabled,
      setBookState,
      clearBook
    );
  };

  const handleEditClick = () => {
    editBookAction(
      bookState,
      clearBook,
      btnDisabled,
      setBooks,
      setBookErrors,
      setBookState,
      toast
    );
  };

  const handleDeleteClick = (bookId: string) => {
    deleteAction(bookId, setBooks, toast);
  };

  const handleToggleActiveClick = (bookId: string) => {
    toggleActiveAction(bookId, books, toast, setBooks);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        setBooks,
        categories,
        setCategories,
        bookState,
        setBookState,
        btnDisabled,
        setBtnDisabled,
        filteredNumber,
        setFilteredNumber,
        booksNumber,
        setBooksNumber,
        filterBtn,
        setFilterBtn,
        bookErrors,
        setBookErrors,
        filteredBooks,
        handleAddClick,
        handleEditClick,
        handleDeleteClick,
        handleToggleActiveClick,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
