
import { useState, useEffect } from 'react';
import { Book } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreVertical, Trash2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data - would come from Supabase in production
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Introduction to Human Biology',
    author: 'Jane Smith',
    category: 'Human Science',
    total_copies: 5,
    available_copies: 3,
    isbn: '978-3-16-148410-0',
    published_year: 2020,
    publisher: 'Science Press',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Advanced Calculus',
    author: 'John Doe',
    category: 'Maths',
    total_copies: 8,
    available_copies: 5,
    isbn: '978-1-4028-9462-6',
    published_year: 2018,
    publisher: 'Math Publications',
    created_at: '2023-02-10T14:30:00Z',
    updated_at: '2023-02-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'Organic Chemistry Fundamentals',
    author: 'Robert Johnson',
    category: 'Chemistry',
    total_copies: 10,
    available_copies: 0,
    isbn: '978-0-7645-7018-7',
    published_year: 2019,
    publisher: 'Chemistry House',
    created_at: '2023-01-05T09:15:00Z',
    updated_at: '2023-03-12T11:20:00Z',
  },
  {
    id: '4',
    title: 'Quantum Physics Explained',
    author: 'Maria Garcia',
    category: 'Physics',
    total_copies: 4,
    available_copies: 2,
    isbn: '978-3-642-11934-7',
    published_year: 2021,
    publisher: 'Physics World',
    created_at: '2023-02-28T13:45:00Z',
    updated_at: '2023-02-28T13:45:00Z',
  },
  {
    id: '5',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Novels',
    total_copies: 15,
    available_copies: 10,
    isbn: '978-0-141-43951-8',
    published_year: 1813,
    publisher: 'Classic Reads',
    created_at: '2023-01-20T08:30:00Z',
    updated_at: '2023-01-20T08:30:00Z',
  },
];

interface BookTableProps {
  onEdit: (book: Book) => void;
}

export function BookTable({ onEdit }: BookTableProps) {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(mockBooks);

  useEffect(() => {
    const results = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchTerm))
    );
    setFilteredBooks(results);
  }, [searchTerm, books]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      // In production this would be a Supabase delete operation
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Human Science': return 'bg-green-100 text-green-800';
      case 'Maths': return 'bg-blue-100 text-blue-800';
      case 'Chemistry': return 'bg-purple-100 text-purple-800';
      case 'Physics': return 'bg-yellow-100 text-yellow-800';
      case 'Novels': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Book Inventory</CardTitle>
          <CardDescription>Manage your library's book collection</CardDescription>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Available</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(book.category)} variant="outline">
                        {book.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={book.available_copies > 0 ? "outline" : "destructive"}>
                        {book.available_copies}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{book.total_copies}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(book)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(book.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No books found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
