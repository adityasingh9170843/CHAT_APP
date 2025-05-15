import "./App.css";
import Navbar from "./Components/Navbar";
import {Routes,Route,Navigate} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./Pages/SettingsPage";``
import ProfilePage from "./Pages/ProfilePage";
import {useEffect} from "react";
import { useAuthStore } from "./store/useAuthStore";
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
function App() {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const{theme}=useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({onlineUsers})
  if(isCheckingAuth && !authUser ){
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin size-10"/>
      </div>
    )
  }

  return (
    <div data-theme ={theme} >
      <Navbar/>
B
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/>: <Navigate to="/" />}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/" />}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/>: <Navigate to="/login" />}/>
      </Routes>

      <Toaster/>
    </div>
  );
}

export default App;
