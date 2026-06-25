import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, ZoomIn, X, Sparkles, ImageIcon } from 'lucide-react'

// Skeleton animé pendant la génération
export function ImageGeneratingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '6px 0' }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 18,
        padding: 16,
        border: '1px solid rgba(102,126,234,0.15)',
        boxShadow: '0 4px 16px rgba(102,126,234,0.08)',
        maxWidth: 360,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, #667EEA, #F093FB)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Sparkles size={14} color="#fff" />
          </motion.div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1040' }}>MadiOps génère votre image</div>
            <GeneratingDots />
          </div>
        </div>

        {/* Skeleton image */}
        <motion.div
          animate={{
            background: [
              'linear-gradient(90deg, #F3E8FF 0%, #EDE9FE 50%, #F3E8FF 100%)',
              'linear-gradient(90deg, #EDE9FE 0%, #F3E8FF 50%, #EDE9FE 100%)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '100%', height: 200, borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ImageIcon size={36} color="rgba(102,126,234,0.4)" />
          </motion.div>
        </motion.div>

        <div style={{ marginTop: 10, fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
          FLUX Pro • Haute qualité • Quelques secondes...
        </div>
      </div>
    </motion.div>
  )
}

// Affichage de l'image générée
export function ImageMessage({ imageUrl, imagePrompt, caption }) {
  const [lightbox, setLightbox] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `madiops-${Date.now()}.jpg`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.open(imageUrl, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '6px 0' }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 18,
        padding: 14,
        border: '1px solid rgba(102,126,234,0.15)',
        boxShadow: '0 4px 20px rgba(102,126,234,0.10)',
        maxWidth: 400,
      }}>
        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'linear-gradient(135deg, rgba(102,126,234,0.12), rgba(240,147,251,0.12))',
            border: '1px solid rgba(102,126,234,0.18)',
            borderRadius: 20, padding: '4px 10px',
          }}>
            <Sparkles size={12} color="#667EEA" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#667EEA' }}>Image générée par MadiOps</span>
          </div>
        </div>

        {/* Image */}
        <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => setLightbox(true)}>
          {!loaded && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ width: '100%', height: 220, background: 'linear-gradient(135deg, #F3E8FF, #EDE9FE)', borderRadius: 14 }}
            />
          )}
          <motion.img
            src={imageUrl}
            alt={imagePrompt}
            onLoad={() => setLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              width: '100%', display: 'block',
              borderRadius: 14, objectFit: 'cover',
            }}
          />
          {/* Hover overlay */}
          <motion.div
            whileHover={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0, borderRadius: 14,
              background: 'rgba(26,16,64,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, transition: 'opacity 0.2s',
            }}
          >
            <div style={overlayBtn}><ZoomIn size={18} color="#fff" /></div>
          </motion.div>
        </div>

        {/* Caption + actions */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>
            <span style={{ fontStyle: 'italic' }}>"{imagePrompt}"</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ background: 'rgba(102,126,234,0.12)' }}
            onClick={handleDownload}
            title="Télécharger"
            style={{
              width: 32, height: 32, borderRadius: 10, border: '1px solid rgba(102,126,234,0.2)',
              background: 'rgba(102,126,234,0.06)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.15s',
            }}
          >
            <Download size={14} color="#667EEA" />
          </motion.button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(10,5,30,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', maxWidth: '95vw', maxHeight: '90vh' }}
            >
              <img
                src={imageUrl} alt={imagePrompt}
                style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: 18, display: 'block' }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setLightbox(false)}
                style={{
                  position: 'absolute', top: -14, right: -14,
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <X size={16} color="#fff" />
              </motion.button>
              <div style={{ textAlign: 'center', marginTop: 12, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                {imagePrompt}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function GeneratingDots() {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center', marginTop: 2 }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
          style={{ width: 4, height: 4, borderRadius: '50%', background: '#667EEA' }}
        />
      ))}
      <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 4 }}>Génération en cours</span>
    </div>
  )
}

const overlayBtn = {
  width: 44, height: 44, borderRadius: 14,
  background: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1px solid rgba(255,255,255,0.25)',
}

// Parser le contenu d'un message pour détecter une image
export function parseMessageContent(content) {
  if (!content) return { type: 'text', content }
  const imageMatch = content.match(/\[IMAGE_GENERATED\](.*?)\[\/IMAGE_GENERATED\]/s)
  if (imageMatch) {
    const imageUrl = imageMatch[1].trim()
    const caption = content.replace(/\[IMAGE_GENERATED\].*?\[\/IMAGE_GENERATED\]/s, '').trim()
    const promptMatch = caption.match(/\*\*(.+?)\*\*/)
    const imagePrompt = promptMatch ? promptMatch[1] : ''
    return { type: 'image', imageUrl, imagePrompt, caption }
  }
  return { type: 'text', content }
}
