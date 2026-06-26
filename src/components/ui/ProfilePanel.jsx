import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Check, Pencil, Target, Heart, User } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const INTERESTS_OPTIONS = [
  'Finance & Bourse', 'Cryptomonnaies', 'Immobilier', 'Agriculture & Élevage',
  'Technologie', 'Startups', 'Énergie', 'Santé', 'Commerce', 'Industrie',
  'Intelligence Artificielle', 'International',
]

export function ProfilePanel({ profile, user, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [form, setForm] = useState({
    pseudo: profile?.pseudo || '',
    ambition: profile?.ambition || '',
    interests: profile?.interests || [],
  })
  const fileRef = useRef(null)

  const avatarUrl = avatarPreview || profile?.avatar_custom_url || user?.user_metadata?.avatar_url
  const displayName = profile?.pseudo || profile?.full_name || user?.email?.split('@')[0]

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      let avatar_custom_url = profile?.avatar_custom_url
      if (avatarPreview && fileRef.current?.files?.[0]) {
        const file = fileRef.current.files[0]
        const ext = file.name.split('.').pop()
        const { data } = await supabase.storage
          .from('avatars')
          .upload(`${user.id}/avatar.${ext}`, file, { upsert: true })
        if (data) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path)
          avatar_custom_url = urlData.publicUrl
        }
      }
      await onUpdate({ ...form, avatar_custom_url })
      setEditing(false)
      setAvatarPreview(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(26,16,64,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <motion.div
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 520,
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(24px)',
            borderRadius: '28px 28px 0 0',
            padding: '28px 20px 40px',
            boxShadow: '0 -8px 40px rgba(102,126,234,0.18)',
            maxHeight: '88vh', overflowY: 'auto',
          }}
        >
          <div style={{ width: 40, height: 4, background: 'rgba(102,126,234,0.2)', borderRadius: 2, margin: '0 auto 20px' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1A1040' }}>Mon Profil</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {!editing ? (
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditing(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, background: 'rgba(102,126,234,0.10)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#667EEA' }}>
                  <Pencil size={13} /> Modifier
                </motion.button>
              ) : (
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleSave} disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #667EEA, #764BA2)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                  <Check size={13} /> {loading ? 'Enregistrement...' : 'Sauvegarder'}
                </motion.button>
              )}
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
                style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(102,126,234,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color="#667EEA" />
              </motion.button>
            </div>
          </div>

          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <motion.div whileTap={editing ? { scale: 0.95 } : {}}
              onClick={() => editing && fileRef.current?.click()}
              style={{ position: 'relative', cursor: editing ? 'pointer' : 'default' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #667EEA, #764BA2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(102,126,234,0.35)', border: '3px solid rgba(255,255,255,0.9)' }}>
                {avatarUrl ? <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontSize: 32, fontWeight: 900 }}>{displayName?.[0]?.toUpperCase()}</span>}
              </div>
              {editing && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(102,126,234,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={20} color="#fff" />
                </div>
              )}
            </motion.div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </div>

          {/* Nom / Email */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1A1040' }}>{displayName}</div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>{user?.email}</div>
          </div>

          {/* Champs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Pseudo */}
            <Field icon={User} label="Prénom / Pseudo" color="#667EEA">
              {editing
                ? <input value={form.pseudo} onChange={e => setForm(p => ({ ...p, pseudo: e.target.value }))} placeholder="Ton prénom ou pseudo..." style={inputStyle} />
                : <div style={valueStyle}>{profile?.pseudo || <span style={{ color: '#C4B5FD' }}>Non renseigné</span>}</div>
              }
            </Field>

            {/* Ambition */}
            <Field icon={Target} label="Mon ambition" color="#F59E0B">
              {editing
                ? <textarea value={form.ambition} onChange={e => setForm(p => ({ ...p, ambition: e.target.value }))} placeholder="Ton objectif financier ou projet..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
                : <div style={valueStyle}>{profile?.ambition || <span style={{ color: '#C4B5FD' }}>Non renseigné</span>}</div>
              }
            </Field>

            {/* Intérêts */}
            <Field icon={Heart} label="Mes domaines" color="#F093FB">
              {editing ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {INTERESTS_OPTIONS.map(interest => {
                    const selected = form.interests.includes(interest)
                    return (
                      <motion.button key={interest} whileTap={{ scale: 0.93 }} onClick={() => toggleInterest(interest)}
                        style={{ padding: '6px 12px', borderRadius: 16, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', background: selected ? 'linear-gradient(135deg, #667EEA, #764BA2)' : 'rgba(102,126,234,0.08)', color: selected ? '#fff' : '#667EEA', transition: 'all 0.15s' }}>
                        {interest}
                      </motion.button>
                    )
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {(profile?.interests || []).length > 0
                    ? profile.interests.map(i => (
                      <div key={i} style={{ padding: '5px 12px', borderRadius: 16, fontSize: 12, fontWeight: 700, background: 'rgba(102,126,234,0.10)', color: '#667EEA' }}>{i}</div>
                    ))
                    : <span style={{ fontSize: 13, color: '#C4B5FD' }}>Non renseigné</span>
                  }
                </div>
              )}
            </Field>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Field({ icon: Icon, label, color, children }) {
  return (
    <div style={{ background: 'rgba(102,126,234,0.04)', borderRadius: 16, padding: '14px 16px', border: '1.5px solid rgba(102,126,234,0.10)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Icon size={14} color={color} />
        <span style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(102,126,234,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#1A1040', background: 'rgba(255,255,255,0.8)', outline: 'none', boxSizing: 'border-box' }
const valueStyle = { fontSize: 14, fontWeight: 600, color: '#1A1040', lineHeight: 1.5 }
