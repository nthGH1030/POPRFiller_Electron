import './Styles.css';
import Template from './components/Template';
import Home from './components/Home';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


function App() {
  return (
    <>
      <Routes>
        <Route path ="/" element ={<Home/>}/>
        <Route path = "/template" element = {<Template/>}/>
      </Routes>
    </>
    
  );
}

export default App;
