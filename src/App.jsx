import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyForm from './pages/signIn';
import EmployeeProfilePage from './pages/EmployeeProfilePage';
import EmployeeDashboard from './pages/employee';
import './assets/css/signIn.css';
import './assets/css/globals.css';
import './assets/css/index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyForm />} />
        <Route path="/pages/signIn" element={<MyForm />} />
        {/* هنا ضفنا :id عشان ناخد الموظف بالـ ID */}
        <Route path="/pages/EmployeeProfile/:id" element={<EmployeeProfilePage />} />
        <Route path="/pages/employee" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
