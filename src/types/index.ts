
export type UserRole = 'admin' | 'librarian';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  total_copies: number;
  available_copies: number;
  isbn?: string;
  published_year?: number;
  publisher?: string;
  created_at: string;
  updated_at: string;
}

export type BookCategory = 
  | 'Human Science' 
  | 'Maths' 
  | 'Chemistry' 
  | 'Physics' 
  | 'Novels'
  | 'Other';

export interface Transaction {
  id: string;
  user_id: string;
  user_name: string;
  book_id: string;
  book_title: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
  fine_amount: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_books: number;
  books_borrowed: number;
  books_overdue: number;
  books_available: number;
}
