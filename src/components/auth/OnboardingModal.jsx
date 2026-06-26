import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ChevronRight, Sparkles, Target, Heart, Check } from 'lucide-react'
import { MadiOpsLogo } from '../ui/MadiOpsLogo'
import { supabase } from '../../lib/supabase'

const INTERESTS_OPTIONS = [
  'Finance & Bourse', 'Cryptomonnaies', 'Immobilier', 'Agriculture & Élevage',
  'Technologie', 'Startups', 'Énergie', 'Santé', 'Commerce', 'Industrie',
  'Intelligence Artificielle', 'International',
]

export function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileRef = useRef(null)
  const [form, setForm] = useState({
    pseudo: '',
    ambition: '',
    interests: [],
  })

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)
    setAvatarUrl(file)
  }

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      let avatar_custom_url = avatarPreview
      // Upload avatar si fichier sélectionné
      if (avatarUrl instanceof File) {
        const { data: { user } } = await supabase.auth.getUser()
        const ext = avatarUrl.name.split('.').pop()
        const { data } = await supabase.storage
          .from('avatars')
          .upload(`${user.id}/avatar.${ext}`, avatarUrl, { upsert: true })
        if (data) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path)
          avatar_custom_url = urlData.publicUrl
        }
      }
      await onComplete({
        pseudo: form.pseudo.trim() || undefined,
        ambition: form.ambition.trim() || undefined,
        interests: form.interests,
        avatar_custom_url,
      })
    } finally {
      setLoading(false)
    }
  }

  const STEPS = [
    { id: 1, title: 'Bienvenue !', icon: Sparkles },
    { id: 2, title: 'Ton profil', icon: Camera },
    { id: 3, title: 'Tes ambitions', icon: Target },
    { id: 4, title: 'Tes intérêts', icon: Heart },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'linear-gradient(145deg, #EEF2FF 0%, #F3E8FF 35%, #FCE7F3 70%, #EDE9FE 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      {/* Orbes */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 7, repeat: Infinity }}
          style={{ position: 'absolute', top: '-5%', right: '-5%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,147,251,0.3) 0%, transparent 70%)', filter: 'blur(10px)' }} />
        <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 9, repeat: Infinity, delay: 2 }}
          style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,126,234,0.25) 0%, transparent 70%)', filter: 'blur(12px)' }} />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(24px)',
          borderRadius: 28,
          padding: '36px 28px',
          width: '100%', maxWidth: 420,
          boxShadow: '0 24px 64px rgba(102,126,234,0.18)',
          border: '1px solid rgba(255,255,255,0.9)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Steps indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {STEPS.map(s => (
            <motion.div key={s.id}
              animate={{ width: s.id === step ? 24 : 8, background: s.id <= step ? '#667EEA' : '#E2E8F0' }}
              style={{ height: 8, borderRadius: 4, transition: 'all 0.3s' }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 — Bienvenue */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <MadiOpsLogo size={72} animate />
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1A1040', marginBottom: 10 }}>
                Bienvenue sur{' '}
                <span style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  MadiOps
                </span>
              </h2>
              <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.6, marginBottom: 28 }}>
                Ton expert IA personnel en conseil d'investissement. En 3 étapes rapides, personnalise ton expérience pour que MadiOps te connaisse parfaitement.
              </p>
              <GradBtn onClick={() => setStep(2)}>
                Commencer <ChevronRight size={18} />
              </GradBtn>
            </motion.div>
          )}

          {/* Step 2 — Profil */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 style={stepTitle}>Ton profil</h2>
              <p style={stepSub}>Comment veux-tu que MadiOps t'appelle ?</p>

              {/* Avatar upload */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <motion.div whileTap={{ scale: 0.95 }} onClick={() => fileRef.current?.click()}
                  style={{
                    width: 90, height: 90, borderRadius: '50%', cursor: 'pointer',
                    background: avatarPreview ? 'transparent' : 'linear-gradient(135deg, #667EEA, #764BA2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', position: 'relative',
                    boxShadow: '0 4px 20px rgba(102,126,234,0.35)',
                    border: '3px solid rgba(255,255,255,0.9)',
                  }}>
                  {avatarPreview
                    ? <img src={avatarPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Camera size={28} color="#fff" />
                  }
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: avatarPreview ? 0 : 0,
                  }}>
                    <Camera size={20} color="#fff" />
                  </div>
                </motion.div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </div>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>Appuie pour ajouter une photo</p>

              <input value={form.pseudo} onChange={e => setForm(p => ({ ...p, pseudo: e.target.value }))}
                placeholder="Ton prénom ou pseudo..."
                style={inputStyle} />

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <OutlineBtn onClick={() => setStep(1)}>Retour</OutlineBtn>
                <GradBtn onClick={() => setStep(3)}>Suivant <ChevronRight size={16} /></GradBtn>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Ambitions */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 style={stepTitle}>Ton ambition</h2>
              <p style={stepSub}>MadiOps s'en souviendra pour mieux te conseiller</p>
              <textarea
                value={form.ambition}
                onChange={e => setForm(p => ({ ...p, ambition: e.target.value }))}
                placeholder="Ex: Créer un patrimoine de 500K€ en 5 ans, investir dans l'élevage au Sahel, lancer ma startup..."
                rows={4}
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <OutlineBtn onClick={() => setStep(2)}>Retour</OutlineBtn>
                <GradBtn onClick={() => setStep(4)}>Suivant <ChevronRight size={16} /></GradBtn>
              </div>
            </motion.div>
          )}

          {/* Step 4 — Intérêts */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 style={stepTitle}>Tes domaines d'intérêt</h2>
              <p style={stepSub}>Sélectionne tout ce qui te concerne</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {INTERESTS_OPTIONS.map(interest => {
                  const selected = form.interests.includes(interest)
                  return (
                    <motion.button key={interest} whileTap={{ scale: 0.94 }}
                      onClick={() => toggleInterest(interest)}
                      style={{
                        padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                        border: selected ? 'none' : '1.5px solid rgba(102,126,234,0.25)',
                        background: selected ? 'linear-gradient(135deg, #667EEA, #764BA2)' : 'rgba(255,255,255,0.7)',
                        color: selected ? '#fff' : '#374151', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 5,
                        boxShadow: selected ? '0 2px 10px rgba(102,126,234,0.3)' : 'none',
                        transition: 'all 0.15s',
                      }}>
                      {selected && <Check size={12} />}
                      {interest}
                    </motion.button>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <OutlineBtn onClick={() => setStep(3)}>Retour</OutlineBtn>
                <GradBtn onClick={handleComplete} disabled={loading}>
                  {loading ? 'Enregistrement...' : <><Sparkles size={16} /> Lancer MadiOps</>}
                </GradBtn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

const stepTitle = { fontSize: 22, fontWeight: 800, color: '#1A1040', marginBottom: 6 }
const stepSub = { fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 1.5 }
const inputStyle = {
  width: '100%', padding: '13px 16px',
  border: '2px solid rgba(102,126,234,0.2)', borderRadius: 14,
  fontSize: 15, fontFamily: 'Inter, sans-serif', color: '#1A1040',
  background: 'rgba(102,126,234,0.04)', outline: 'none',
  boxSizing: 'border-box',
}

function GradBtn({ children, onClick, disabled }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onClick} disabled={disabled}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '13px 20px', borderRadius: 14, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? '#E2E8F0' : 'linear-gradient(135deg, #667EEA, #764BA2)',
        color: disabled ? '#9CA3AF' : '#fff', fontSize: 15, fontWeight: 700,
        boxShadow: disabled ? 'none' : '0 4px 16px rgba(102,126,234,0.35)',
      }}>
      {children}
    </motion.button>
  )
}

function OutlineBtn({ children, onClick }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onClick}
      style={{
        padding: '13px 20px', borderRadius: 14, border: '2px solid rgba(102,126,234,0.2)',
        background: 'transparent', color: '#667EEA', fontSize: 15, fontWeight: 700,
        cursor: 'pointer',
      }}>
      {children}
    </motion.button>
  )
}
