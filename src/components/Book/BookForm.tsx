import { useState, useEffect } from 'react';
import { Book, BookCategory } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/lib/toast';

const BOOK_CATEGORIES: BookCategory[] = [
  'Human Science',
  'Maths',
  'Chemistry',
  'Physics',
  'Novels',
  'Other'
];

interface BookFormProps {
  book?: Book;
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Partial<Book>) => void;
}

export function BookForm({ book, isOpen, onClose, onSave }: BookFormProps) {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    category: 'Other',
    total_copies: 1,
    available_copies: 1,
    isbn: '',
    published_year: undefined,
    publisher: '',
  });

  const isEditing = !!book;

  useEffect(() => {
    if (book) {
      setFormData({ ...book });
    } else {
      setFormData({
        title: '',
        author: '',
        category: 'Other',
        total_copies: 1,
        available_copies: 1,
        isbn: '',
        published_year: undefined,
        publisher: '',
      });
    }
  }, [book, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert number fields
    if (name === 'total_copies' || name === 'available_copies' || name === 'published_year') {
      const numValue = value === '' ? undefined : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as BookCategory }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title?.trim()) {
      toast.error('Book title is required');
      return;
    }
    
    if (!formData.author?.trim()) {
      toast.error('Author name is required');
      return;
    }

    if (formData.total_copies === undefined || formData.total_copies < 1) {
      toast.error('Total copies must be at least 1');
      return;
    }

    // Make sure available copies doesn't exceed total
    const availableCopies = Math.min(
      formData.available_copies || 0,
      formData.total_copies
    );

    onSave({
      ...formData,
      available_copies: availableCopies,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the book information in your library inventory.' 
                : 'Add a new book to your library inventory.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                name="author"
                value={formData.author || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {BOOK_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="total_copies">Total Copies *</Label>
                <Input
                  id="total_copies"
                  name="total_copies"
                  type="number"
                  min="1"
                  value={formData.total_copies || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="available_copies">Available Copies *</Label>
                <Input
                  id="available_copies"
                  name="available_copies"
                  type="number"
                  min="0"
                  max={formData.total_copies}
                  value={formData.available_copies || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="published_year">Published Year</Label>
                <Input
                  id="published_year"
                  name="published_year"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={formData.published_year || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                name="publisher"
                value={formData.publisher || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{isEditing ? 'Update Book' : 'Add Book'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
