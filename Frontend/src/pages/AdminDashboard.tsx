import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LogOut, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserStat {
  username: string;
  totalResumes: number;
  resumeCodes: string[];
  firstGenerated: string;
  lastGenerated: string;
}

interface ValidationResult {
  username: string;
  code: string;
  generatedAt: string;
  totalResumes: number;
  allCodes: {
    code: string;
    generatedAt: string;
  }[];
  firstGenerated: string;
  lastGenerated: string;
}

interface ValidationResponse {
  success: boolean;
  found: boolean;
  result: ValidationResult | null;
  error?: string;
}

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dbStatus, setDbStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  
  // Code validation state
  const [validationCode, setValidationCode] = useState("");
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [validating, setValidating] = useState(false);
  
  const navigate = useNavigate();

  const fetchLogs = useCallback(async () => {
    // Force production URL for testing
    const isProduction = true; // window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const apiUrl = isProduction
      ? 'https://resume-backend-kzg9.onrender.com/api/admin-user-stats'
      : 'http://localhost:5000/api/admin-user-stats';

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(apiUrl, {
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Admin-Token': token || '',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/admin-login");
          return;
        }
      }

      const data = await response.json();
      
      if (data.success) {
        setUserStats(data.userStats);
        setDbStatus(true);
      }
    } catch (error) {
      console.error("❌ Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchLogs();
    } finally {
      setRefreshing(false);
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // Force production URL for testing
      const isProduction = true; // window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const apiUrl = isProduction
        ? 'https://resume-backend-kzg9.onrender.com/api/admin-logs'
        : 'http://localhost:5000/api/admin-logs';

      const token = localStorage.getItem('adminToken');

      try {
        const response = await fetch(apiUrl, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Admin-Token': token || '',
          },
        });

        if (response.status === 401 || response.status === 403) {
          navigate("/admin-login");
        }
      } catch (error) {
        console.error("❌ Auth check failed:", error);
        navigate("/admin-login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    // Force production URL for testing
    const isProduction = true; // window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const apiUrl = isProduction
      ? 'https://resume-backend-kzg9.onrender.com/api/admin-logout'
      : 'http://localhost:5000/api/admin-logout';

    const token = localStorage.getItem('adminToken');

    try {
      await fetch(apiUrl, { 
        method: 'POST',
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Admin-Token': token || '',
        },
      });
      localStorage.removeItem('adminToken');
      navigate("/admin-login");
    } catch (error) {
      localStorage.removeItem('adminToken');
      navigate("/admin-login");
    }
  };

  const todayCount = userStats.reduce((count, user) => {
    const lastDate = new Date(user.lastGenerated).toDateString();
    const today = new Date().toDateString();
    return lastDate === today ? count + 1 : count;
  }, 0);

  const totalResumes = userStats.reduce((total, user) => total + user.totalResumes, 0);

  const filteredUsers = userStats.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.resumeCodes.some(code => code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleUserExpansion = (username: string) => {
    setExpandedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

  const handleValidateCode = async () => {
    if (!validationCode.trim()) {
      setValidationResult({ success: false, found: false, result: null, error: "Please enter a code to validate" });
      return;
    }

    setValidating(true);
    setValidationResult(null);

    // Force production URL for testing
    const isProduction = true; // window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const apiUrl = isProduction
      ? 'https://resume-backend-kzg9.onrender.com/api/admin-validate-code'
      : 'http://localhost:5000/api/admin-validate-code';

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
          'X-Admin-Token': token || '',
        },
        credentials: "include",
        body: JSON.stringify({ code: validationCode.trim() }),
      });

      const data = await response.json();
      
      if (data.success) {
        setValidationResult(data);
      } else {
        setValidationResult({ success: false, found: false, result: null, error: data.error || "Validation failed" });
      }
    } catch (error) {
      setValidationResult({ success: false, found: false, result: null, error: "Network error. Please try again." });
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-2 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white p-1">
                <img src="/images/jm-logo.jpg" alt="JM Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-gray-900 font-semibold text-lg">Alliance Resume Maker</h2>
                <p className="text-gray-600 text-sm">Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={refreshing || loading}
                className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-700 hover:border-gray-400 bg-white"
                title="Refresh data from database"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-700 hover:border-gray-400 bg-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Track and manage student resume generation activity
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-gray-600 text-sm mb-2">Total Resumes</div>
            <div className="text-3xl font-bold text-blue-600">{totalResumes}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-gray-600 text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold text-blue-600">{userStats.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-gray-600 text-sm mb-2">Today</div>
            <div className="text-3xl font-bold text-blue-600">{todayCount}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-gray-600 text-sm mb-2">Database Status</div>
            <div className={`text-sm font-semibold ${dbStatus ? 'text-green-600' : 'text-red-600'}`}>
              {dbStatus ? "✅ Connected" : "❌ Disconnected"}
            </div>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1">
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              User Statistics
            </TabsTrigger>
            <TabsTrigger value="validate" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              Code Validation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-0">
            {/* Logs Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-fade-in">
          <div className="p-6 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by username or resume code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Username</TableHead>
                  <TableHead className="font-semibold text-gray-900">Total Resumes</TableHead>
                  <TableHead className="font-semibold text-gray-900">First Generated</TableHead>
                  <TableHead className="font-semibold text-gray-900">Last Generated</TableHead>
                  <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <>
                      <TableRow key={user.username} className="hover:bg-gray-50 cursor-pointer">
                        <TableCell className="font-medium text-gray-900">{user.username}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-mono text-sm font-semibold">
                            {user.totalResumes}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">{new Date(user.firstGenerated).toLocaleString()}</TableCell>
                        <TableCell className="text-gray-600">{new Date(user.lastGenerated).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserExpansion(user.username)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {expandedUsers.has(user.username) ? 'Hide Details' : 'Show Details'}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedUsers.has(user.username) && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-blue-50">
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">All Resume Codes for {user.username}:</h4>
                              <div className="flex flex-wrap gap-2">
                                {user.resumeCodes.map((code, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-3 py-1 rounded-md bg-blue-100 text-blue-800 font-mono text-sm font-semibold"
                                  >
                                    {code}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      {loading ? "Loading..." : "No users found matching your search"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {userStats.length} users
            </p>
          </div>
            </div>
          </TabsContent>

          <TabsContent value="validate" className="space-y-0">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-fade-in">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Code Validation</h2>
                <p className="text-gray-600 mb-6">Enter a resume code to view user details</p>
                
                <div className="flex gap-3 mb-6">
                  <Input
                    type="text"
                    placeholder="Enter resume code (e.g., AU123456)"
                    value={validationCode}
                    onChange={(e) => setValidationCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleValidateCode()}
                    className="flex-1 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleValidateCode}
                    disabled={validating || !validationCode.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {validating ? "Validating..." : "Validate"}
                  </Button>
                </div>

                {validationResult && (
                  <div className="mt-6">
                    {validationResult.error ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">❌</span>
                          <h3 className="text-lg font-semibold text-red-900">Validation Failed</h3>
                        </div>
                        <p className="text-red-700">{validationResult.error}</p>
                      </div>
                    ) : validationResult.found && validationResult.result ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">✅</span>
                          <h3 className="text-lg font-semibold text-green-900">Code Valid</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Username</div>
                            <div className="font-semibold text-gray-900 text-lg">{validationResult.result.username}</div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Entered Code</div>
                            <div className="font-semibold text-blue-800 text-lg font-mono">{validationResult.result.code}</div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Total Resumes</div>
                            <div className="font-semibold text-gray-900 text-lg">{validationResult.result.totalResumes}</div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">This Code Generated</div>
                            <div className="font-semibold text-gray-900">{new Date(validationResult.result.generatedAt).toLocaleString()}</div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">First Generated</div>
                            <div className="font-semibold text-gray-900">{new Date(validationResult.result.firstGenerated).toLocaleString()}</div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Last Generated</div>
                            <div className="font-semibold text-gray-900">{new Date(validationResult.result.lastGenerated).toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">All Resume Codes for this User:</h4>
                          <div className="flex flex-wrap gap-2">
                            {validationResult.result.allCodes.map((codeEntry, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center px-3 py-1 rounded-md font-mono text-sm font-semibold ${
                                  codeEntry.code === validationResult.result.code
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {codeEntry.code}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">⚠️</span>
                          <h3 className="text-lg font-semibold text-yellow-900">Code Not Found</h3>
                        </div>
                        <p className="text-yellow-700 mt-2">No matching resume code found in the database.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;

