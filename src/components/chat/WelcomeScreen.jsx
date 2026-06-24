import { motion } from 'framer-motion'
import { MadiOpsLogo } from '../ui/MadiOpsLogo'
import {
  TrendingUp, Cpu, Zap, Building2, FlaskConical, Leaf,
  ChevronRight
} from 'lucide-react'

// Icônes React animées — couleurs exactes maquette
const SUGGESTIONS = [
  {
    Icon: TrendingUp,
    iconBg: 'linear-gradient(135deg, #667EEA, #764BA2)',
    iconColor: '#fff',
    label: 'Marchés financiers',
    text: 'Quels secteurs boursiers sont les plus porteurs en 2025 ?',
  },
  {
    Icon: Leaf,
    iconBg: 'linear-gradient(135deg, #10B981, #059669)',
    iconColor: '#fff',
    label: 'Élevage & Agriculture',
    text: "Comment investir rentablement dans l'élevage bovin en Afrique de l'Ouest ?",
  },
  {
    Icon: Zap,
    iconBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
    iconColor: '#fff',
    label: 'Énergie & Industrie',
    text: 'Quelles sont les meilleures opportunités dans les énergies renouvelables ?',
  },
  {
    Icon: Cpu,
    iconBg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    iconColor: '#fff',
    label: 'Technologie',
    text: 'Dans quelle startup technologique africaine investir en 2025 ?',
  },
  {
    Icon: Building2,
    iconBg: 'linear-gradient(135deg, #F97316, #EA580C)',
    iconColor: '#fff',
    label: 'Immobilier',
    text: "Est-ce le bon moment pour investir dans l'immobilier commercial ?",
  },
  {
    Icon: FlaskConical,
    iconBg: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    iconColor: '#fff',
    label: 'Chimie & Pharma',
    text: 'Comment diversifier un portefeuille avec le secteur pharmaceutique ?',
  },
]

export function WelcomeScreen({ onSuggestion }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', overflowY: 'auto',
      position: 'relative',
    }}>
      {/* Orbes de fond — exactement comme la maquette */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div
          animate={{ y: [0, -16, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-8%', right: '-10%',
            width: 260, height: 260, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(240,147,251,0.35) 0%, rgba(240,147,251,0.0) 70%)',
            filter: 'blur(8px)',
          }}
        />
        <motion.div
          animate={{ y: [0, 14, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{
            position: 'absolute', bottom: '10%', left: '-8%',
            width: 220, height: 220, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102,126,234,0.28) 0%, rgba(102,126,234,0.0) 70%)',
            filter: 'blur(10px)',
          }}
        />
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'absolute', top: '45%', right: '5%',
            width: 140, height: 140, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(118,75,162,0.20) 0%, rgba(118,75,162,0.0) 70%)',
            filter: 'blur(6px)',
          }}
        />
      </div>

      {/* Logo + greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: 'center', marginBottom: 28, position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}
        >
          <MadiOpsLogo size={68} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ fontSize: 26, fontWeight: 700, color: '#1A1040', marginBottom: 4, lineHeight: 1.2 }}
        >
          Bonjour, je suis{' '}
          <span style={{
            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            MadiOps
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ fontSize: 14, color: '#6B7280', maxWidth: 300, margin: '0 auto', lineHeight: 1.55 }}
        >
          Votre expert IA en conseil d'investissement mondial — finance, industrie, technologie et bien plus.
        </motion.p>
      </motion.div>

      {/* Suggestion cards — style maquette : liste avec icône + flèche */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}
      >
        {SUGGESTIONS.map((s, i) => (
          <SuggestionCard key={s.label} s={s} i={i} onSuggestion={onSuggestion} />
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        style={{
          marginTop: 24, fontSize: 12, textAlign: 'center',
          background: 'linear-gradient(90deg, #667EEA, #764BA2, #F093FB)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', position: 'relative', zIndex: 1,
        }}
      >
        Tous secteurs • Marchés mondiaux • Analyse en temps réel
      </motion.p>
    </div>
  )
}

function SuggestionCard({ s, i, onSuggestion }) {
  const { Icon, iconBg, iconColor, label, text } = s
  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45 + i * 0.07 }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ x: 4, boxShadow: '0 8px 28px rgba(102,126,234,0.18)' }}
      onClick={() => onSuggestion(text)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.9)',
        borderRadius: 18,
        padding: '14px 16px',
        cursor: 'pointer', textAlign: 'left',
        boxShadow: '0 2px 12px rgba(102,126,234,0.08)',
        transition: 'all 0.18s',
      }}
    >
      {/* Icône animée */}
      <motion.div
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: 44, height: 44, borderRadius: 14,
          background: iconBg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        }}
      >
        <Icon size={20} color={iconColor} strokeWidth={2} />
      </motion.div>

      {/* Texte */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1040', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text.slice(0, 58)}…
        </div>
      </div>

      {/* Flèche */}
      <motion.div
        whileHover={{ x: 3 }}
        style={{
          width: 28, height: 28, borderRadius: 10, flexShrink: 0,
          background: 'rgba(102,126,234,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <ChevronRight size={15} color="#667EEA" />
      </motion.div>
    </motion.button>
  )
}
