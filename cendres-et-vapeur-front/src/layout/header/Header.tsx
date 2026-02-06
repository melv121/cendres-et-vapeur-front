import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">
          <img src={logo} className="header-logo" alt="Cendres et Vapeur logo" />
        </Link>
      </div>
      <nav className="header-right">
        <Link to="/login" className="header-link">Connexion</Link>
        <Link to="/register" className="header-link">Inscription</Link>
        <Link to="/contact" className="header-link">Contact</Link>

      </nav>
    </header>
  )
}

export default Header
