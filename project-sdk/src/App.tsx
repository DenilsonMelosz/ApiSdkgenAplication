import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from "./pages/Login";
import { Signup } from './pages/Signup';
import { Profile } from "./pages/Profile";
import { PrivateRoute } from './PrivRoute'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
