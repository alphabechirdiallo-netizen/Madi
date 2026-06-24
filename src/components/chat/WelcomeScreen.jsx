import { motion } from 'framer-motion'
import { MadiOpsLogo } from '../ui/MadiOpsLogo'

const SUGGESTIONS = [
  { emoji: '📈', label: 'Marchés financiers', text: 'Quels secteurs boursiers sont les plus porteurs en 2025 ?' },
  { emoji: '🐄', label: 'Élevage & Agriculture', text: 'Comment investir rentablement dans l\'élevage bovin en Afrique de l\'Ouest ?' },
  { emoji: '⚡', label: 'Énergie & Industrie', text: 'Quelles sont les meilleures opportunités dans les énergies renouvelables ?' },
  { emoji: '💻', label: 'Technologie', text: 'Dans quelle startup technologique africaine investir en 2025 ?' },
  { emoji: '🏗️', label: 'Immobilier', text: 'Est-ce le bon moment pour investir dans l\'immobilier commercial ?' },
  { emoji: '🧪', label: 'Chimie & Pharma', text: 'Comment diversifier un portefeuille avec le secteur pharmaceutique ?' },
]

export function WelcomeScreen({ onSuggestion }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', overflowY: 'auto',
    }}>
      {/* Logo + greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: 'center', marginBottom: 36 }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}
        >
          <MadiOpsLogo size={72} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', marginBottom: 8, lineHeight: 1.2 }}
        >
          Bonjour, je suis MadiOps
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ fontSize: 15, color: '#64748B', maxWidth: 340, margin: '0 auto', lineHeight: 1.55 }}
        >
          Votre expert IA en conseil d'investissement mondial — finance, industrie, technologie et bien plus.
        </motion.p>
      </motion.div>

      {/* Suggestion cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
          gap: 10,
          width: '100%',
          maxWidth: 520,
        }}
      >
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.06 }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(37,99,235,0.10)' }}
            onClick={() => onSuggestion(s.text)}
            style={{
              background: '#fff',
              border: '1.5px solid #E2E8F0',
              borderRadius: 16,
              padding: '14px 14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.18s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 7 }}>{s.emoji}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.4 }}>{s.text.slice(0, 55)}…</div>
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        style={{ marginTop: 28, fontSize: 12, color: '#CBD5E1', textAlign: 'center' }}
      >
        Tous secteurs • Marchés mondiaux • Analyse en temps réel
      </motion.p>
    </div>
  )
}
