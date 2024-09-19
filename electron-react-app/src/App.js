import './Styles.css';
import GeneratorStep2 from './components/generatorStep2';
import GeneratorStep1 from './components/generatorStep1';
import { HashRouter , Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
    <HashRouter>
        <Routes>
          <Route path ="/" element ={<GeneratorStep1/>}/>
          <Route path = "/step2" element = {<GeneratorStep2/>}/>
        </Routes>
    </HashRouter>
    </>
    
  );
}

export default App;
