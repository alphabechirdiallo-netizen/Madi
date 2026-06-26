import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

// Images pour le bandeau (toutes les 31)
const BANNER_IMAGES = [
  '/world/w01.jpg', '/world/w02.jpg', '/world/w03.jpg', '/world/w04.jpg',
  '/world/w05.jpg', '/world/w06.jpg', '/world/w07.jpg', '/world/w09.jpg',
  '/world/w10.jpg', '/world/w11.jpg', '/world/w12.jpg', '/world/w13.jpg',
  '/world/w14.jpg', '/world/w15.jpg', '/world/w16.jpg', '/world/w19.jpg',
  '/world/w20.jpg', '/world/w21.jpg', '/world/w22.jpg', '/world/w23.jpg',
  '/world/w24.jpg', '/world/w25.jpg', '/world/w26.jpg', '/world/w27.jpg',
  '/world/w28.jpg', '/world/w29.jpg', '/world/w30.jpg', '/world/w31.jpg',
  '/world/w32.jpg', '/world/w33.jpg', '/world/w35.jpg',
]

// Dupliquer pour boucle infinie
const DOUBLED = [...BANNER_IMAGES, ...BANNER_IMAGES]

export function WorldBanner({ onOpenGallery }) {
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)
  const animRef = useRef(null)
  const speedRef = useRef(0.5) // px/frame

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let pos = 0
    const totalWidth = el.scrollWidth / 2

    const animate = () => {
      if (!isDragging) {
        pos += speedRef.current
        if (pos >= totalWidth) pos = 0
        el.scrollLeft = pos
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [isDragging])

  const handleTouchStart = (e) => {
    setIsDragging(true)
    dragStartX.current = e.touches[0].clientX
    scrollStartX.current = scrollRef.current.scrollLeft
  }
  const handleTouchMove = (e) => {
    const delta = dragStartX.current - e.touches[0].clientX
    scrollRef.current.scrollLeft = scrollStartX.current + delta
  }
  const handleTouchEnd = () => setIsDragging(false)

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Globe size={15} color="#667EEA" />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#667EEA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            MadiOps World
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenGallery}
          style={{
            fontSize: 12, fontWeight: 700, color: '#764BA2',
            background: 'rgba(118,75,162,0.08)', border: 'none',
            borderRadius: 10, padding: '5px 12px', cursor: 'pointer',
          }}
        >
          Voir tout →
        </motion.button>
      </div>

      {/* Bandeau défilant */}
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          display: 'flex', gap: 10,
          overflowX: 'hidden',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        {DOUBLED.map((src, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenGallery}
            style={{
              width: 110, height: 80, flexShrink: 0,
              borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
            }}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Hook pour le fond contextuel dans le chat
const CULTURE_KEYWORDS = ['afrique', 'voyage', 'monde', 'culture', 'pays', 'continent', 'ville', 'nature', 'paysage', 'mer', 'montagne', 'forêt', 'savane', 'désert', 'océan', 'fleuve', 'lac', 'safari', 'tourisme', 'heritage', 'patrimoine', 'beauté', 'paradis', 'île', 'plage', 'colline', 'vallée', 'cascades', 'chutes', 'europe', 'asie', 'amérique', 'investir', 'marché', 'global', 'international', 'mondial']

const CONTEXT_IMAGES = {
  nature: ['/world/w07.jpg', '/world/w09.jpg', '/world/w10.jpg', '/world/w26.jpg', '/world/w27.jpg'],
  afrique: ['/world/w01.jpg', '/world/w02.jpg', '/world/w04.jpg', '/world/w06.jpg', '/world/w11.jpg'],
  paradis: ['/world/w16.jpg', '/world/w28.jpg', '/world/w30.jpg', '/world/w31.jpg'],
  monde: ['/world/w20.jpg', '/world/w23.jpg', '/world/w24.jpg', '/world/w25.jpg', '/world/w29.jpg', '/world/w32.jpg'],
}

export function getContextualBackground(text) {
  const lower = text.toLowerCase()
  const hasCulture = CULTURE_KEYWORDS.some(k => lower.includes(k))
  if (!hasCulture) return null

  // Choisir la catégorie selon le contexte
  let pool = CONTEXT_IMAGES.monde
  if (lower.match(/afrique|africain|kenya|mali|ghana|niger|sahel|savane|baobab|madagascar/)) pool = CONTEXT_IMAGES.afrique
  else if (lower.match(/nature|forêt|montagne|cascade|chute|lac|rivière|mer|océan|plage/)) pool = CONTEXT_IMAGES.nature
  else if (lower.match(/paradis|luxe|maldives|île|resort|hotel|vacances|voyage/)) pool = CONTEXT_IMAGES.paradis

  return pool[Math.floor(Math.random() * pool.length)]
}
