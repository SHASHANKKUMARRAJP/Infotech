import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { CustomerList } from './pages/customers/CustomerList';
import { CustomerForm } from './pages/customers/CustomerForm';
import { ProductList } from './pages/products/ProductList';
import { ProductForm } from './pages/products/ProductForm';
import { InventoryMovements } from './pages/inventory/InventoryMovements';
import { ChallanList } from './pages/challans/ChallanList';
import { ChallanDetails } from './pages/challans/ChallanDetails';
import { ChallanForm } from './pages/challans/ChallanForm';
// other pages will be imported here

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/customers" element={<ProtectedRoute allowedRoles={['ADMIN', 'SALES', 'ACCOUNTS']}><Outlet /></ProtectedRoute>}>
            <Route index element={<CustomerList />} />
            <Route path="new" element={<ProtectedRoute allowedRoles={['ADMIN', 'SALES']}><CustomerForm /></ProtectedRoute>} />
            <Route path=":id/edit" element={<ProtectedRoute allowedRoles={['ADMIN', 'SALES']}><CustomerForm /></ProtectedRoute>} />
          </Route>

          <Route path="/products" element={<ProtectedRoute allowedRoles={['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']}><Outlet /></ProtectedRoute>}>
            <Route index element={<ProductList />} />
            <Route path="new" element={<ProtectedRoute allowedRoles={['ADMIN', 'WAREHOUSE']}><ProductForm /></ProtectedRoute>} />
            <Route path=":id/edit" element={<ProtectedRoute allowedRoles={['ADMIN', 'WAREHOUSE']}><ProductForm /></ProtectedRoute>} />
          </Route>
          
          <Route path="/inventory" element={<ProtectedRoute allowedRoles={['ADMIN', 'WAREHOUSE']}><Outlet /></ProtectedRoute>}>
            <Route index element={<InventoryMovements />} />
          </Route>
          
          <Route path="/challans" element={<ProtectedRoute allowedRoles={['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']}><Outlet /></ProtectedRoute>}>
            <Route index element={<ChallanList />} />
            <Route path="new" element={<ProtectedRoute allowedRoles={['ADMIN', 'SALES']}><ChallanForm /></ProtectedRoute>} />
            <Route path=":id" element={<ChallanDetails />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
