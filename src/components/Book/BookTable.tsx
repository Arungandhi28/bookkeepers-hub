
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

interface BookTableProps {
  onEdit: (book: Book) => void;
}

export function BookTable({ onEdit }: BookTableProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from Supabase
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('books')
          .select('*');

        if (error) {
          throw error;
        }

        setBooks(data || []);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();

    // Set up real-time listener for books table
    const channel = supabase
      .channel('books-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'books' },
        (payload) => {
          console.log('Change received:', payload);
          if (payload.eventType === 'INSERT') {
            setBooks((current) => [...current, payload.new as Book]);
          } else if (payload.eventType === 'UPDATE') {
            setBooks((current) =>
              current.map((book) =>
                book.id === payload.new.id ? payload.new as Book : book
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setBooks((current) =>
              current.filter((book) => book.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter books based on search term
  useEffect(() => {
    const results = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchTerm))
    );
    setFilteredBooks(results);
  }, [searchTerm, books]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const { error } = await supabase
          .from('books')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        toast.success('Book deleted successfully');
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
      }
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading books...
                  </TableCell>
                </TableRow>
              ) : filteredBooks.length > 0 ? (
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
