
import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Calendar, Download, FileText } from 'lucide-react';

// Mock data - would come from Supabase in production
const borrowingData = [
  { month: 'Jan', count: 24 },
  { month: 'Feb', count: 32 },
  { month: 'Mar', count: 45 },
  { month: 'Apr', count: 37 },
  { month: 'May', count: 48 },
  { month: 'Jun', count: 35 },
];

const categoryData = [
  { name: 'Human Science', value: 25 },
  { name: 'Maths', value: 38 },
  { name: 'Chemistry', value: 32 },
  { name: 'Physics', value: 42 },
  { name: 'Novels', value: 18 },
];

const overdueData = [
  { category: 'Human Science', count: 5 },
  { category: 'Maths', count: 8 },
  { category: 'Chemistry', count: 3 },
  { category: 'Physics', count: 7 },
  { category: 'Novels', count: 2 },
];

const popularBooksData = [
  { title: 'Introduction to Human Biology', count: 15 },
  { title: 'Advanced Calculus', count: 12 },
  { title: 'Organic Chemistry Fundamentals', count: 10 },
  { title: 'Quantum Physics Explained', count: 9 },
  { title: 'Pride and Prejudice', count: 8 },
];

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('usage');

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Filter Dates
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="usage" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="usage">Usage Reports</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Borrowing Trends</CardTitle>
                <CardDescription>Number of books borrowed per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={borrowingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4299e1" name="Books Borrowed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Books</CardTitle>
                <CardDescription>Top 5 most borrowed books</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={popularBooksData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="title" 
                        width={150}
                        tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                      />
                      <Tooltip />
                      <Bar dataKey="count" fill="#9f7aea" name="Times Borrowed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Overdue Books by Category</CardTitle>
                <CardDescription>Distribution of overdue books by subject</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="mt-2 md:mt-0">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overdueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f56565" name="Overdue Books" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Overdue Summary</CardTitle>
              <CardDescription>Summary of all overdue books and fines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">Total Overdue Books</p>
                  <p className="text-2xl font-bold text-red-800">25</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700">Pending Fines</p>
                  <p className="text-2xl font-bold text-amber-800">$125.00</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">Collected Fines (Month)</p>
                  <p className="text-2xl font-bold text-green-800">$75.00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Books by Category</CardTitle>
                <CardDescription>Distribution of books across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current inventory statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Total Books</p>
                    <p className="text-2xl font-bold text-blue-800">155</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">Available Books</p>
                    <p className="text-2xl font-bold text-green-800">107</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-700">Borrowed Books</p>
                    <p className="text-2xl font-bold text-amber-800">48</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
