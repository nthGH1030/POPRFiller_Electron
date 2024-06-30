import './Styles.css';
import Step2 from './components/Step2';
import Home from './components/Home';
import { HashRouter , Routes, Route, Link } from "react-router-dom";


function App() {
  return (
    <>
    <HashRouter>
        <Routes>
          <Route path ="/" element ={<Home/>}/>
          <Route path = "/step2" element = {<Step2/>}/>
        </Routes>
    </HashRouter>
    </>
    
  );
}

export default App;
