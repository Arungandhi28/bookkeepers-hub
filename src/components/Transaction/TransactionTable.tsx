
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
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
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Search, Calendar, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data - would come from Supabase in production
const mockTransactions: Transaction[] = [
  {
    id: '1',
    user_id: 'u1',
    user_name: 'Alice Johnson',
    book_id: '1',
    book_title: 'Introduction to Human Biology',
    borrow_date: '2023-05-15T10:00:00Z',
    due_date: '2023-05-29T10:00:00Z',
    return_date: null,
    status: 'borrowed',
    fine_amount: 0,
    created_at: '2023-05-15T10:00:00Z',
    updated_at: '2023-05-15T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'u2',
    user_name: 'Bob Smith',
    book_id: '2',
    book_title: 'Advanced Calculus',
    borrow_date: '2023-05-10T14:30:00Z',
    due_date: '2023-05-24T14:30:00Z',
    return_date: null,
    status: 'overdue',
    fine_amount: 5,
    created_at: '2023-05-10T14:30:00Z',
    updated_at: '2023-05-25T09:00:00Z',
  },
  {
    id: '3',
    user_id: 'u3',
    user_name: 'Charlie Brown',
    book_id: '4',
    book_title: 'Quantum Physics Explained',
    borrow_date: '2023-05-05T09:15:00Z',
    due_date: '2023-05-19T09:15:00Z',
    return_date: '2023-05-18T11:30:00Z',
    status: 'returned',
    fine_amount: 0,
    created_at: '2023-05-05T09:15:00Z',
    updated_at: '2023-05-18T11:30:00Z',
  },
  {
    id: '4',
    user_id: 'u4',
    user_name: 'David Miller',
    book_id: '5',
    book_title: 'Pride and Prejudice',
    borrow_date: '2023-05-01T13:45:00Z',
    due_date: '2023-05-15T13:45:00Z',
    return_date: null,
    status: 'overdue',
    fine_amount: 10,
    created_at: '2023-05-01T13:45:00Z',
    updated_at: '2023-05-16T10:00:00Z',
  },
  {
    id: '5',
    user_id: 'u5',
    user_name: 'Eva García',
    book_id: '3',
    book_title: 'Organic Chemistry Fundamentals',
    borrow_date: '2023-05-12T08:30:00Z',
    due_date: '2023-05-26T08:30:00Z',
    return_date: null,
    status: 'borrowed',
    fine_amount: 0,
    created_at: '2023-05-12T08:30:00Z',
    updated_at: '2023-05-12T08:30:00Z',
  },
];

interface TransactionTableProps {
  onRecordReturn: (transaction: Transaction) => void;
}

export function TransactionTable({ onRecordReturn }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);

  useEffect(() => {
    const results = transactions.filter(transaction => 
      transaction.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.book_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(results);
  }, [searchTerm, transactions]);

  const handleRecordReturn = (transaction: Transaction) => {
    onRecordReturn(transaction);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'borrowed': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Borrowed</Badge>;
      case 'returned': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Returned</Badge>;
      case 'overdue': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Overdue</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Manage book borrowing and returns</CardDescription>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
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
                <TableHead>User</TableHead>
                <TableHead>Book</TableHead>
                <TableHead className="hidden md:table-cell">Borrow Date</TableHead>
                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.user_name}</TableCell>
                    <TableCell>{transaction.book_title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(transaction.borrow_date)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(transaction.due_date)}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-right">
                      {transaction.status !== 'returned' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRecordReturn(transaction)}
                        >
                          Record Return
                        </Button>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No transactions found. Try adjusting your search.
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
