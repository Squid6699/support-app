import { Routes, Route } from "react-router-dom";

import {Toaster} from "react-hot-toast";
import Login from "./pages/Login";

function App() {

  return (
    <>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/auth/login" element = {<Login/>}/>
        </Routes>
    </>
  )
}

export default App
