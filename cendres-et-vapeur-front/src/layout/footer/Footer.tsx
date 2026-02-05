import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-left">
        <Link to="/login" className="footer-link">Connexion</Link>
        <Link to="/register" className="footer-link">Inscription</Link>
      </nav>
      <div className="footer-right">
        <p>&copy; 2026 Cendres et Vapeur</p>
      </div>
    </footer>
  )
}

export default Footer
