import './Style/App.css';
import Header from './components/Header';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Footer from './components/Footer';
import Messages from './pages/Messages';




function App() {
  return (
    <div>
      <Router>
        <Header/>
        <div>
          <Routes>
            <Route path="/" exact element={<Home/>}/>
            <Route path="/products" element={<Game/>}/>
            <Route path="/messages" element={<Messages/>}/>
          </Routes>
        </div>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
