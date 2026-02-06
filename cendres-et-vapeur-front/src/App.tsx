import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Infos from './pages/infos'
import Navbar from './components/Navbar'
import './components/Navbar.css'
import Footer from './layout/footer/Footer'
import Home from './pages/Home'
import Login from './pages/auth/login/Login'
import Register from './pages/auth/register/Register'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<Infos />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
