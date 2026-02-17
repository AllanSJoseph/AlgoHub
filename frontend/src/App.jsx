import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo";
import AdminUpdate from "./components/AdminUpdate";
import UpdateProblem from "./components/UpdateProblem";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <>
    <Toaster position="top-right" />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
        <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
        <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
        <Route path="/admin/create" element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>} />
        <Route path="/admin/update" element={<ProtectedRoute requireAdmin><AdminUpdate /></ProtectedRoute>} />
        <Route path="/admin/update/:problemId" element={<ProtectedRoute requireAdmin><UpdateProblem /></ProtectedRoute>} />
        <Route path="/admin/delete" element={<ProtectedRoute requireAdmin><AdminDelete /></ProtectedRoute>} />
        <Route path="/admin/video" element={<ProtectedRoute requireAdmin><AdminVideo /></ProtectedRoute>} />
        <Route path="/admin/upload/:problemId" element={<ProtectedRoute requireAdmin><AdminUpload /></ProtectedRoute>} />
        <Route path="/problem/:problemId" element={<ProtectedRoute><ProblemPage/></ProtectedRoute>}></Route>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>
    </Routes>
  </>
  )
}

export default App;
