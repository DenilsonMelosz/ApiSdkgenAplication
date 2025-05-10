import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes/routes';
import { Toaster } from '@/components/ui/toaster'; 

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}
