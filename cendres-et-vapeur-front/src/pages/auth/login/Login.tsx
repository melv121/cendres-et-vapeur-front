import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, verify2FA } from '../../../api/api'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // État pour le 2FA
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [userId, setUserId] = useState('')
  const [code2FA, setCode2FA] = useState('')
  const [verifying2FA, setVerifying2FA] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(email, password)
      
      if (response.error || response.detail) {
        setError(response.error || response.detail || 'Erreur de connexion')
        return
      }

      if (response.user_id) {
        setUserId(String(response.user_id))
        setShow2FAModal(true)
      } else if (response.access_token) {
        localStorage.setItem('cev_auth_token', response.access_token)
        navigate('/shop')
      }
    } catch (err) {
      console.error('Erreur login:', err)
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
      const response = await verify2FA(Number(userId), code2FA)
      
      console.log('Réponse 2FA:', response)
      
      if (response.detail) {
        setError(response.detail)
        return
      }

      if (response.error) {
        setError(response.error)
        return
      }

      const token = response.token || response.access_token
      if (token) {
        localStorage.setItem('cev_auth_token', token)
        
        if (response.user) {
          localStorage.setItem('cev_auth_user', JSON.stringify(response.user))
        }
        
        window.dispatchEvent(new Event('userLoggedIn'))
        
        setShow2FAModal(false)
        navigate('/shop')
      } else if (response.success) {
        // Cas où success est retourné sans token
        setShow2FAModal(false)
        navigate('/shop')
      } else {
        // Aucun token mais pas d'erreur non plus
        setError('Réponse inattendue du serveur')
        console.log('Réponse complète:', JSON.stringify(response))
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
    setUserId('')
    setCode2FA('')
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Connexion</h1>
        <p className="login-subtitle">Accédez à votre compte</p>

        {error && !show2FAModal && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
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

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="login-footer">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>

      {/* Modal 2FA */}
      {show2FAModal && (
        <div className="modal-backdrop" onClick={close2FAModal}>
          <div className="modal-2fa" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Vérification 2FA</h2>
              <button className="modal-close" onClick={close2FAModal}>✕</button>
            </div>
            
            <p className="modal-description">
              Un code de vérification a été envoyé à votre adresse email.<br />
              Veuillez le saisir ci-dessous.
            </p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleVerify2FA} className="modal-form">
              <div className="form-group">
                <label htmlFor="userId">User ID</label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Votre ID utilisateur"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="code2fa">Code de vérification</label>
                <input
                  id="code2fa"
                  type="text"
                  value={code2FA}
                  onChange={(e) => setCode2FA(e.target.value)}
                  placeholder="Entrez le code reçu"
                  autoFocus
                  required
                />
              </div>

              <button type="submit" className="login-button" disabled={verifying2FA}>
                {verifying2FA ? 'Vérification...' : 'Valider'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
