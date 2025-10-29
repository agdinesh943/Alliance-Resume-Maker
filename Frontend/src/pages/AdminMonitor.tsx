import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LogOut } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResumeLog {
  _id: string;
  username: string;
  resumeCode: string;
  createdAt: string;
}

const AdminMonitor = () => {
  const [logs, setLogs] = useState<ResumeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchLogs = useCallback(async () => {
    // Force production URL for testing
    const isProduction = true; // window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const apiUrl = isProduction
      ? 'https://resume-backend-kzg9.onrender.com/api/admin-logs'
      : 'http://localhost:5000/api/admin-logs';

    try {
      const response = await fetch(apiUrl, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/admin-login");
          return;
        }
      }

      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
        setDbStatus(true);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleLogout = async () => {
    // Force production URL for testing
    const isProduction = true; // window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const apiUrl = isProduction
      ? 'https://resume-backend-kzg9.onrender.com/api/admin-logout'
      : 'http://localhost:5000/api/admin-logout';

    try {
      await fetch(apiUrl, { credentials: "include" });
      localStorage.removeItem('adminToken');
      navigate("/admin-login");
    } catch (error) {
      localStorage.removeItem('adminToken');
      navigate("/admin-login");
    }
  };

  const todayCount = logs.filter((log) => {
    const logDate = new Date(log.createdAt).toDateString();
    const today = new Date().toDateString();
    return logDate === today;
  }).length;

  const filteredLogs = logs.filter(
    (log) =>
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resumeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(log.createdAt).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white p-1">
                <img src="/images/jm-logo.jpg" alt="JM Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-gray-900 font-semibold text-lg">Resume Maker</h2>
                <p className="text-gray-600 text-sm">Admin Dashboard</p>
              </div>
            </div>
            
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-gray-600 text-sm mb-2">Total Resumes</div>
            <div className="text-3xl font-bold text-blue-600">{logs.length}</div>
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

        {/* Logs Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-fade-in">
          <div className="p-6 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by username, code, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Student Username</TableHead>
                  <TableHead className="font-semibold text-gray-900">Resume Code</TableHead>
                  <TableHead className="font-semibold text-gray-900">Generated Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">{log.username}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-mono text-sm font-semibold">
                          {log.resumeCode}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">{new Date(log.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                      {loading ? "Loading..." : "No logs found matching your search"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {filteredLogs.length} of {logs.length} logs
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMonitor;

