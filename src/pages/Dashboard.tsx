
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardStats, Transaction } from '@/types';
import {
  BookOpen,
  BookCopy,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data - would come from Supabase in production
const mockStats: DashboardStats = {
  total_books: 152,
  books_borrowed: 48,
  books_overdue: 12,
  books_available: 104,
};

const mockOverdueBorrows: Transaction[] = [
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
];

const chartData = [
  { name: 'Jan', borrowed: 23, returned: 18 },
  { name: 'Feb', borrowed: 35, returned: 28 },
  { name: 'Mar', borrowed: 45, returned: 40 },
  { name: 'Apr', borrowed: 30, returned: 27 },
  { name: 'May', borrowed: 48, returned: 36 },
];

const categoryData = [
  { name: 'Maths', count: 45 },
  { name: 'Physics', count: 38 },
  { name: 'Chemistry', count: 32 },
  { name: 'Novels', count: 25 },
  { name: 'Human Science', count: 12 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [overdueItems, setOverdueItems] = useState<Transaction[]>(mockOverdueBorrows);

  // In production, would fetch real data from Supabase here
  useEffect(() => {
    // Mock fetching data
    console.log('Dashboard mounted - would fetch data from Supabase here');
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <MainLayout>
      <h1 className="page-title">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Books</p>
                <p className="text-2xl font-bold">{stats.total_books}</p>
              </div>
              <div className="rounded-full p-2 bg-blue-100">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Currently Borrowed</p>
                <p className="text-2xl font-bold">{stats.books_borrowed}</p>
              </div>
              <div className="rounded-full p-2 bg-green-100">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Overdue Books</p>
                <p className="text-2xl font-bold">{stats.books_overdue}</p>
              </div>
              <div className="rounded-full p-2 bg-red-100">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Available Books</p>
                <p className="text-2xl font-bold">{stats.books_available}</p>
              </div>
              <div className="rounded-full p-2 bg-indigo-100">
                <BookCopy className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Borrow & Return Trends</CardTitle>
            <CardDescription>Monthly book circulation statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="borrowed" fill="#3b82f6" name="Borrowed" />
                  <Bar dataKey="returned" fill="#10b981" name="Returned" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Books by Category</CardTitle>
            <CardDescription>Distribution across different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Books" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Overdue Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Overdue Items</CardTitle>
              <CardDescription>Books that need to be returned</CardDescription>
            </div>
            <Button variant="outline" className="mt-2 sm:mt-0">
              <Calendar className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {overdueItems.length > 0 ? (
              overdueItems.map(item => (
                <div key={item.id} className="py-3 flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.book_title}</p>
                    <p className="text-sm text-gray-500">
                      Borrowed by: {item.user_name}
                    </p>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-red-600 font-medium">
                        Due: {formatDate(item.due_date)}
                      </p>
                      <span className="mx-1">•</span>
                      <p className="text-xs font-medium">
                        Fine: ${item.fine_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Send Reminder</Button>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-gray-500">No overdue items</p>
            )}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
