import logo from './assets/logo.png'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <img src={logo} className="logo" alt="Cendres et Vapeur logo" />
      </header>
      
      <Home />
    </div>
  )
}

export default App
