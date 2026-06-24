import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { MadiOpsLogo } from '../ui/MadiOpsLogo'

// SVG logos for OAuth providers
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const MicrosoftLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022"/>
    <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00"/>
    <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF"/>
    <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900"/>
  </svg>
)

const AppleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

export function AuthModal({ onClose }) {
  const { signInWithGoogle, signInWithMicrosoft, signInWithApple, signInWithEmail } = useAuth()
  const [showEmail, setShowEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleOAuth = async (provider, fn) => {
    setLoading(provider)
    setError('')
    try { await fn() }
    catch (e) { setError(e.message); setLoading(null) }
  }

  const handleEmail = async (e) => {
    e.preventDefault()
    setLoading('email')
    setError('')
    try {
      await signInWithEmail(email, password)
      setEmailSent(true)
    } catch (e) {
      setError(e.message)
      setLoading(null)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          style={{
            background: '#fff',
            borderRadius: 24,
            padding: '40px 32px',
            width: '100%',
            maxWidth: 380,
            boxShadow: '0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)',
            position: 'relative',
          }}
        >
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: '#F1F5F9', border: 'none', borderRadius: 10,
                width: 32, height: 32, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={16} color="#64748B" />
            </button>
          )}

          {/* Logo + Title */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <MadiOpsLogo size={56} animate />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>MadiOps</h2>
            <p style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>IA Conseil d'Investissement</p>
            <p style={{ fontSize: 14, color: '#475569', marginTop: 12 }}>Connectez-vous pour continuer</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}
            >
              {error}
            </motion.div>
          )}

          {/* OAuth Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'google', label: 'Continuer avec Google', Icon: GoogleLogo, fn: signInWithGoogle },
              { id: 'microsoft', label: 'Continuer avec Microsoft', Icon: MicrosoftLogo, fn: signInWithMicrosoft },
              { id: 'apple', label: 'Continuer avec Apple', Icon: AppleLogo, fn: signInWithApple },
            ].map(({ id, label, Icon, fn }) => (
              <OAuthButton
                key={id}
                label={label}
                Icon={Icon}
                loading={loading === id}
                disabled={!!loading}
                onClick={() => handleOAuth(id, fn)}
              />
            ))}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
              <span style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>ou</span>
              <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            </div>

            {!showEmail ? (
              <OAuthButton
                label="Continuer avec Email"
                Icon={() => <Mail size={18} color="#64748B" />}
                loading={false}
                disabled={!!loading}
                onClick={() => setShowEmail(true)}
                variant="outline"
              />
            ) : emailSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: '#F0FDF4', border: '1.5px solid #BBF7D0',
                  borderRadius: 14, padding: '18px 16px', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>📬</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#15803D', marginBottom: 6 }}>
                  Vérifiez votre boîte mail !
                </div>
                <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.55 }}>
                  Un email de confirmation a été envoyé à <strong>{email}</strong>. Cliquez sur le lien dans l'email pour activer votre compte et vous connecter.
                </div>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleEmail}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Adresse email" required autoFocus
                  style={inputStyle}
                />
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mot de passe" required
                    style={{ ...inputStyle, paddingRight: 44 }}
                  />
                  <button
                    type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {showPw ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
                  </button>
                </div>
                <motion.button
                  type="submit" disabled={!!loading}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: '#2563EB', color: '#fff', border: 'none',
                    borderRadius: 12, padding: '13px 20px', fontSize: 14,
                    fontWeight: 600, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {loading === 'email' ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Se connecter'}
                </motion.button>
              </motion.form>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', marginTop: 20, lineHeight: 1.5 }}>
            En continuant, vous acceptez nos{' '}
            <span style={{ color: '#2563EB', cursor: 'pointer' }}>Conditions d'utilisation</span>{' '}
            et notre{' '}
            <span style={{ color: '#2563EB', cursor: 'pointer' }}>Politique de confidentialité</span>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function OAuthButton({ label, Icon, loading, disabled, onClick, variant = 'default' }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ backgroundColor: variant === 'outline' ? '#F8FAFC' : '#F8FAFC' }}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
        background: variant === 'outline' ? '#fff' : '#fff',
        border: '1.5px solid #E2E8F0',
        fontSize: 14, fontWeight: 500, color: '#0F172A',
        opacity: disabled && !loading ? 0.5 : 1,
        transition: 'all 0.15s',
      }}
    >
      {loading ? (
        <Loader2 size={18} color="#94A3B8" style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <Icon />
      )}
      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
    </motion.button>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 14px',
  border: '1.5px solid #E2E8F0', borderRadius: 12,
  fontSize: 14, color: '#0F172A', background: '#F8FAFC',
  outline: 'none', transition: 'border-color 0.15s',
}

// Add spin keyframe
const style = document.createElement('style')
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`
document.head.appendChild(style)
