import './App.css';
import CreateFood from './components/pages/Create Food/CreateFood';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/pages/Home/Home';

function App() {
  return (
    <div>
       <BrowserRouter>
      <Routes>
      <Route>
      <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateFood />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
