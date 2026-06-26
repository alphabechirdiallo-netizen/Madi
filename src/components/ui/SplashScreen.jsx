import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MadiOpsLogo } from '../ui/MadiOpsLogo'

// Images de splash les plus impactantes (paysages larges)
const SPLASH_IMAGES = [
  '/world/w02.jpg',  // Le Cap de nuit
  '/world/w05.jpg',  // Chutes Victoria
  '/world/w07.jpg',  // Savane girafe
  '/world/w09.jpg',  // Chutes d'eau
  '/world/w10.jpg',  // Baobabs Madagascar
  '/world/w13.jpg',  // Savane africaine
  '/world/w16.jpg',  // Mer turquoise
  '/world/w19.jpg',  // Lac montagne
  '/world/w21.jpg',  // Dolomites
  '/world/w25.jpg',  // Statue de la Liberté
  '/world/w28.jpg',  // Palmiers plage
  '/world/w32.jpg',  // Taj Mahal
]

const QUOTES = [
  { text: "Investir, c'est faire confiance à demain.", sub: "MadiOps · IA Conseil d'Investissement" },
  { text: "Le monde appartient à ceux qui osent voir loin.", sub: "MadiOps · Partout dans le monde" },
  { text: "Chaque grand voyage commence par une décision audacieuse.", sub: "MadiOps · Finance & Culture" },
  { text: "La richesse se bâtit là où l'intelligence rencontre l'ambition.", sub: "MadiOps · Expert Mondial" },
  { text: "S'évader pour mieux investir. Investir pour mieux s'évader.", sub: "MadiOps · Liberté Financière" },
  { text: "Le monde est vaste. Tes opportunités le sont encore davantage.", sub: "MadiOps · Vision Globale" },
]

export function SplashScreen({ onDone }) {
  const [imageIndex] = useState(() => Math.floor(Math.random() * SPLASH_IMAGES.length))
  const [quoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length))
  const [visible, setVisible] = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    // Masquer après 3.8 secondes
    const timer = setTimeout(() => setVisible(false), 3800)
    return () => clearTimeout(timer)
  }, [])

  const quote = QUOTES[quoteIndex]
  const image = SPLASH_IMAGES[imageIndex]

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ exit: { duration: 0.6 } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Image de fond */}
          <motion.img
            src={image}
            onLoad={() => setImgLoaded(true)}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 4, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.55)',
            }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.75) 100%)',
          }} />

          {/* Contenu centré */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 28px' }}>
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 220, damping: 20 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: '22%',
                overflow: 'hidden', background: '#fff',
                boxShadow: '0 0 0 3px rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <img src="/logo.png" alt="MadiOps" style={{ width: '86%', height: '86%', objectFit: 'contain', margin: '7%' }} />
              </div>
            </motion.div>

            {/* Nom */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 20, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
            >
              MadiOps
            </motion.div>

            {/* Citation */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              style={{
                fontSize: 19, fontWeight: 700, color: 'rgba(255,255,255,0.95)',
                lineHeight: 1.5, marginBottom: 12,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                maxWidth: 320, margin: '0 auto 12px',
              }}
            >
              "{quote.text}"
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em' }}
            >
              {quote.sub}
            </motion.p>
          </div>

          {/* Barre de progression */}
          <motion.div
            style={{
              position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)',
              width: 48, height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2,
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.5, ease: 'linear', delay: 0.3 }}
              style={{ height: '100%', background: 'rgba(255,255,255,0.9)', borderRadius: 2 }}
            />
          </motion.div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={() => setVisible(false)}
            style={{
              position: 'absolute', bottom: 44, right: 24,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 20, padding: '6px 14px', color: 'rgba(255,255,255,0.8)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}
          >
            Passer →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
