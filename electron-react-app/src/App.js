import './Styles.css';
import Step2 from './components/Step2';
import Home from './components/Home';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


function App() {
  return (
    <>
      <Routes>
        <Route path ="/" element ={<Home/>}/>
        <Route path = "/Step2" element = {<Step2/>}/>
      </Routes>
    </>
    
  );
}

export default App;
