import {Router , Route , Routes} from "react-router-dom"
import './App.css';
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";

function App() {
  return (
    <>
     <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/editor/:roomId" element={<EditorPage/>}/>
    </Routes> 
    </>
  );
}

export default App;
