import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './layout/header/Header'
import Footer from './layout/footer/Footer'
import Home from './pages/Home'
import Login from './pages/auth/login/Login'
import Register from './pages/auth/register/Register'
import Contact from './pages/Contact' 
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
