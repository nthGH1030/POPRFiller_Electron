import './Styles.css';
import GeneratorStep2 from './components/generatorStep2';
import GeneratorStep1 from './components/generatorStep1';
import ReplaceTemplate from './components/replaceTemplate';
import { HashRouter , Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
    <HashRouter>
        <Routes>
          <Route path ="/" element ={<GeneratorStep1/>}/>
          <Route path = "/generatorStep2" element = {<GeneratorStep2/>}/>
          <Route path = "/replaceTemplate" element = {<ReplaceTemplate/>}/>
        </Routes>
    </HashRouter>
    </>
    
  );
}

export default App;
