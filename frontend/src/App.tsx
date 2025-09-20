import { Routes, Route } from "react-router-dom";

import {Toaster} from "react-hot-toast";
import Login from "./pages/Login";
import ResponsiveDrawer from "./components/ResponsiveDrawer";

function App() {

  return (
    <>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/auth/login" element = {<Login/>}/>
          <Route path="/" element = {<ResponsiveDrawer/>}/>
        </Routes>
    </>
  )
}

export default App
