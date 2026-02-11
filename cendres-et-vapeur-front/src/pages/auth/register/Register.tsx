import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, login, verify2FA } from '../../../api/api'
import './Register.css'

function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // État pour le 2FA
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [code2FA, setCode2FA] = useState('')
  const [verifying2FA, setVerifying2FA] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    try {
      const response = await register(username, email, password)
      
      if (response.error || response.detail) {
        setError(response.error || response.detail || 'Erreur lors de l\'inscription')
        return
      }

      // Inscription réussie, on fait le login automatiquement
      if (response.success) {
        const loginResponse = await login(email, password)
        
        if (loginResponse.user_id) {
          setUserId(loginResponse.user_id)
          setShow2FAModal(true)
        } else if (loginResponse.access_token) {
          localStorage.setItem('cev_auth_token', loginResponse.access_token)
          navigate('/shop')
        }
      }
    } catch (err) {
      console.error('Erreur inscription:', err)
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    
    setError('')
    setVerifying2FA(true)

    try {
      const response = await verify2FA(userId, code2FA)
      
      if (response.error || response.detail) {
        setError(response.error || response.detail || 'Code invalide')
        return
      }

      if (response.access_token) {
        localStorage.setItem('cev_auth_token', response.access_token)
        setShow2FAModal(false)
        navigate('/shop')
      }
    } catch (err) {
      console.error('Erreur 2FA:', err)
      setError('Erreur de vérification du code')
    } finally {
      setVerifying2FA(false)
    }
  }

  const close2FAModal = () => {
    setShow2FAModal(false)
    setCode2FA('')
    setError('')
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Inscription</h1>
        <p className="register-subtitle">Rejoignez la colonie</p>

        {error && <div className="register-error">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre pseudo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="register-footer">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>

      {/* Modal 2FA */}
      {show2FAModal && (
        <div className="modal-backdrop">
          <div className="modal-2fa">
            <div className="modal-header">
              <h2>Vérification 2FA</h2>
              <button className="modal-close" onClick={close2FAModal}>×</button>
            </div>
            
            <p className="modal-description">
              Un code de vérification a été envoyé à votre email. 
              Entrez-le ci-dessous pour finaliser votre inscription.
            </p>

            {error && <div className="register-error">{error}</div>}

            <form onSubmit={handleVerify2FA} className="modal-form">
              <div className="form-group">
                <label htmlFor="code2fa">Code de vérification</label>
                <input
                  id="code2fa"
                  type="text"
                  value={code2FA}
                  onChange={(e) => setCode2FA(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="register-button" disabled={verifying2FA}>
                {verifying2FA ? 'Vérification...' : 'Valider le code'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Register
