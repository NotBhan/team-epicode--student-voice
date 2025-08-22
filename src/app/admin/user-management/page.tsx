
'use client';

import withAuth from '@/components/auth/with-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { UserProfile } from '@/lib/types';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { getAllUsers } from '@/services/user-service';


function UserManagementPage() {
    const { userProfile } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserProfile[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await getAllUsers();
            setUsers(allUsers.filter(u => u.role === 'admin' && u.post !== 'Faculty Head'));
        };
        fetchUsers();
    }, []);

    if (userProfile?.post !== 'Faculty Head') {
        router.push('/admin/dashboard');
        return null;
    }

    const handleAccessChange = (uid: string, newAccess: boolean) => {
        // In a real app, you'd call an API here.
        // For now, we just log it.
        console.log(`User ${uid} access changed to ${newAccess}`);
    }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
         <div>
             <h1 className="text-3xl font-bold text-foreground">User Management</h1>
             <p className="text-muted-foreground">Grant or revoke access for faculty members.</p>
         </div>
          <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Faculty
          </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Joined On</TableHead>
                <TableHead className="text-right">Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                      <Badge variant="outline">{user.post}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(user.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Switch
                      defaultChecked={true} // In a real app, this would be based on user's actual status
                      onCheckedChange={(checked) => handleAccessChange(user.uid, checked)}
                      aria-label={`${user.fullName} access switch`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(UserManagementPage, ['admin']);
