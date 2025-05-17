
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, MoreVertical, UserPlus, Shield, ShieldAlert, UserX } from "lucide-react";
import { apiService } from "@/services/api/ApiService";
import { useToast } from "@/components/ui/use-toast";

// User type definition
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2025-05-15T10:30:00Z",
    createdAt: "2024-12-01T08:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    lastLogin: "2025-05-16T14:20:00Z",
    createdAt: "2025-01-15T09:30:00Z",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "manager",
    status: "inactive",
    lastLogin: "2025-04-30T11:45:00Z",
    createdAt: "2025-02-10T15:20:00Z",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "user",
    status: "suspended",
    lastLogin: "2025-05-10T09:15:00Z",
    createdAt: "2025-03-05T13:10:00Z",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "user",
    status: "active",
    lastLogin: "2025-05-17T08:45:00Z",
    createdAt: "2025-03-20T11:00:00Z",
  },
];

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as User["role"],
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // In a real application, fetch users from API
    const fetchUsers = async () => {
      try {
        if (!apiService.isOfflineMode()) {
          // const fetchedUsers = await apiService.get<User[]>("/api/users");
          // setUsers(fetchedUsers);
          setUsers(mockUsers); // For now, use mock data even in online mode
        } else {
          setUsers(mockUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Using mock data.",
          variant: "destructive",
        });
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    
    toast({
      title: "Status Updated",
      description: `User status has been changed to ${newStatus}.`,
    });
  };

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    
    toast({
      title: "Role Updated",
      description: `User role has been changed to ${newRole}.`,
    });
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      });
      return;
    }

    const newUserWithId: User = {
      id: `${users.length + 1}`,
      ...newUser,
      status: "active",
      lastLogin: "-",
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUserWithId]);
    setIsAddUserDialogOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "user",
    });
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`,
    });
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    
    toast({
      title: "User Deleted",
      description: "User has been removed from the system.",
    });
  };

  const bulkDelete = () => {
    if (selectedUsers.length === 0) return;
    
    setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
    
    toast({
      title: "Users Deleted",
      description: `${selectedUsers.length} users have been removed.`,
    });
  };

  const getStatusBadgeVariant = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "outline";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "manager":
        return "warning";
      case "user":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === "-") return "-";
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 w-full max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedUsers.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={bulkDelete}
            >
              Delete ({selectedUsers.length})
            </Button>
          )}
          
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Enter the details for the new user account.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as User["role"]})}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} 
                  onCheckedChange={(checked: boolean) => selectAllUsers(checked)}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                    <span className="text-muted-foreground">Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <span className="text-muted-foreground">No users found</span>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role === "admin" ? <Shield className="h-3 w-3 mr-1" /> : null}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status === "suspended" ? <ShieldAlert className="h-3 w-3 mr-1" /> : null}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(user.lastLogin)}
                  </TableCell>
                  <TableCell>
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(user.id, "user")}
                          disabled={user.role === "user"}
                        >
                          Set as User
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(user.id, "manager")}
                          disabled={user.role === "manager"}
                        >
                          Set as Manager
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(user.id, "admin")}
                          disabled={user.role === "admin"}
                        >
                          Set as Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(user.id, "active")}
                          disabled={user.status === "active"}
                        >
                          Set Active
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(user.id, "inactive")}
                          disabled={user.status === "inactive"}
                        >
                          Set Inactive
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(user.id, "suspended")}
                          disabled={user.status === "suspended"}
                        >
                          Suspend Account
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteUser(user.id)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableCaption>
            {filteredUsers.length > 0 ? `Showing ${filteredUsers.length} users` : "No users found"}.
          </TableCaption>
        </Table>
      </div>
    </div>
  );
};
