import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { BookTable } from '@/components/Book/BookTable';
import { BookForm } from '@/components/Book/BookForm';
import { Button } from '@/components/ui/button';
import { Book } from '@/types';
import { Plus } from 'lucide-react';
import { toast } from '@/lib/toast';

export default function Books() {
  const [bookFormOpen, setBookFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);

  const handleAddBook = () => {
    setSelectedBook(undefined);
    setBookFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setBookFormOpen(true);
  };

  const handleSaveBook = (book: Partial<Book>) => {
    // In production this would save to Supabase
    console.log('Saving book:', book);
    
    if (selectedBook) {
      toast.success('Book updated successfully');
    } else {
      toast.success('Book added successfully');
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Book Inventory</h1>
        <Button onClick={handleAddBook}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>
      
      <BookTable onEdit={handleEditBook} />
      
      <BookForm
        book={selectedBook}
        isOpen={bookFormOpen}
        onClose={() => setBookFormOpen(false)}
        onSave={handleSaveBook}
      />
    </MainLayout>
  );
}
