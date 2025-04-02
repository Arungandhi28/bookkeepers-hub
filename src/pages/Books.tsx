
import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { BookTable } from '@/components/Book/BookTable';
import { BookForm } from '@/components/Book/BookForm';
import { Button } from '@/components/ui/button';
import { Book } from '@/types';
import { Plus } from 'lucide-react';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';

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

  const handleSaveBook = async (book: Partial<Book>) => {
    try {
      if (selectedBook) {
        // Update existing book
        const { error } = await supabase
          .from('books')
          .update(book)
          .eq('id', selectedBook.id);

        if (error) {
          throw error;
        }
        
        toast.success('Book updated successfully');
      } else {
        // Insert new book
        const { error } = await supabase
          .from('books')
          .insert([book]);

        if (error) {
          throw error;
        }
        
        toast.success('Book added successfully');
      }
      
      setBookFormOpen(false);
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error('Failed to save book');
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
