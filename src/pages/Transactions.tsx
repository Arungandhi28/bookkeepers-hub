
import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { TransactionTable } from '@/components/Transaction/TransactionTable';
import { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';
import { Plus } from 'lucide-react';

export default function Transactions() {
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');

  const handleRecordReturn = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsReturnDialogOpen(true);
  };

  const confirmReturn = () => {
    // In production, this would update the transaction in Supabase
    console.log('Recording return for transaction:', selectedTransaction?.id);
    toast.success('Book return recorded successfully');
    setIsReturnDialogOpen(false);
  };

  const handleCreateTransaction = () => {
    // In production, this would create a new transaction in Supabase
    if (!userId.trim() || !bookId.trim()) {
      toast.error('User ID and Book ID are required');
      return;
    }

    console.log('Creating transaction for User:', userId, 'Book:', bookId);
    toast.success('Book borrowing recorded successfully');
    setIsNewTransactionOpen(false);
    setUserId('');
    setBookId('');
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Transactions</h1>
        <Button onClick={() => setIsNewTransactionOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Borrowing
        </Button>
      </div>
      
      <TransactionTable onRecordReturn={handleRecordReturn} />
      
      {/* Return Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Book Return</DialogTitle>
            <DialogDescription>
              Record the return of this book to the library inventory.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p><strong>Book:</strong> {selectedTransaction?.book_title}</p>
            <p><strong>Borrower:</strong> {selectedTransaction?.user_name}</p>
            <p><strong>Due Date:</strong> {selectedTransaction?.due_date ? new Date(selectedTransaction.due_date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Status:</strong> {selectedTransaction?.status === 'overdue' ? 'Overdue' : 'Borrowed'}</p>
            {selectedTransaction?.status === 'overdue' && (
              <p className="text-red-500"><strong>Fine Amount:</strong> ${selectedTransaction.fine_amount.toFixed(2)}</p>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmReturn}>Confirm Return</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Transaction Dialog */}
      <Dialog open={isNewTransactionOpen} onOpenChange={setIsNewTransactionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Borrowing Transaction</DialogTitle>
            <DialogDescription>
              Record a new book borrowing transaction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="userId">User ID or Name</Label>
              <Input
                id="userId"
                placeholder="Enter user ID or name"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bookId">Book ID or Title</Label>
              <Input
                id="bookId"
                placeholder="Enter book ID or title"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateTransaction}>Record Borrowing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
