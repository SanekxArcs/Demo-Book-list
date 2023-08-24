import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchBooks } from './api';
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Pencil, Minus, Trash2 } from "lucide-react";


export function TableDemo({
  showAll: boolean,
  showActive: boolean,
  showDeactivated: boolean,
}) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await fetchBooks();
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchData();
  }, []);

    const filteredBooks = books.filter((book) => {
      if (showAll === 'all') return true;
      if (showActive === 'active') return book.isActive;
      if (showDeactivated === 'deactive') return book.isActive;
      return !book.isActive;
    });

  return (
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
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredBooks.map((books: any) => (
          <TableRow key={books.id}>
            <TableCell>{books.title}</TableCell>
            <TableCell>{books.author}</TableCell>
            <TableCell>{books.category}</TableCell>
            <TableCell>{books.isbn}</TableCell>
            <TableCell>{books.createdAt}</TableCell>
            <TableCell className="text-start">
              {books.modifiedAt ? books.modifiedAt : "-"}
            </TableCell>
            <TableCell className="flex gap-1 justify-center">
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
              {books.isActive ? (
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : (
                ""
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// import React, { useState, useEffect } from 'react';
// import { fetchBooks } from './api';  // This will be our utility module for CRUD operations
// import BookRow from './BookRow';

// const Dashboard: React.FC = () => {
//   const [books, setBooks] = useState([]);
//   const [filter, setFilter] = useState('active');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const booksData = await fetchBooks();
//         setBooks(booksData);
//       } catch (error) {
//         console.error("Error fetching books:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const filteredBooks = books.filter(book => {
//     if (filter === 'all') return true;
//     return filter === 'active' ? book.isActive : !book.isActive;
//   });

//   return (
//     <div className="container mx-auto py-4">
//       <div className="mb-4">
//         <label
//           htmlFor="filter"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Filter:
//         </label>
//         <select
//           id="filter"
//           name="filter"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value as any)}
//           className="mt-1 p-2 border rounded"
//         >
//           <option value="all">Show All</option>
//           <option value="active">Show Active</option>
//           <option value="deactivated">Show Deactivated</option>
//         </select>
//       </div>

//       <div className="mb-2">
//         Showing {filteredBooks.length} of {books.length}
//       </div>

//       <table className="min-w-full bg-white">
//         <thead>Table headers</thead>
//         <tbody>
//           {filteredBooks.map((book) => (
//             <BookRow
//               key={book.id}
//               book={book}
//               onEdit={updateBook}
//               onDelete={deleteBook}
//               onToggleActive={updateBook}
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from 'react';

// type Book = {
//   id: number;
//   title: string;
//   author: string;
//   category: string;
//   isbn: string;
//   createdAt: string;
//   modifiedAt: string | null;
//   isActive: boolean;
// };

// const Dashboard: React.FC = () => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [filter, setFilter] = useState<'all' | 'active' | 'deactivated'>('active');

//   useEffect(() => {
//     // Fetch the books from the backend (json-server)
//     // For now, let's use a mock data
//     const mockData: Book[] = [
//       {
//         id: 1,
//         title: 'Book 1',
//         author: 'Author 1',
//         category: 'Category 1',
//         isbn: '1234567890',
//         createdAt: new Date().toISOString(),
//         modifiedAt: null,
//         isActive: true,
//       },
//       // ... add more mock books
//     ];
//     setBooks(mockData);
//   }, []);

//   const filteredBooks = books.filter((book) => {
//     if (filter === 'all') return true;
//     if (filter === 'active') return book.isActive;
//     return !book.isActive;
//   });

//   return (
//     <div className="container mx-auto py-4">
//       <div className="mb-4">
//         <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
//           Filter:
//         </label>
//         <select
//           id="filter"
//           name="filter"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value as any)}
//           className="mt-1 p-2 border rounded"
//         >
//           <option value="all">Show All</option>
//           <option value="active">Show Active</option>
//           <option value="deactivated">Show Deactivated</option>
//         </select>
//       </div>

//       <table className="min-w-full bg-white">
//         <thead>
//           {/* Table headers... */}
//         </thead>
//         <tbody>
//           {filteredBooks.map((book) => (
//             // Render each book row...
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Dashboard;
