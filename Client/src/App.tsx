
import LandingPage from "./app/LandingPage";
import { Route, Routes, Navigate } from "react-router-dom";
import TextEditor from "./components/TextEditor";
import EditorPage from "./components/EditorPage";


function App() {
  
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
        rel="stylesheet"
      />
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/doc/:docId"  element={<EditorPage />}/>
        <Route path="*" element={<Navigate to="/" replace />}/>
      </Routes>
      
    
    </>
  );
}

export default App;