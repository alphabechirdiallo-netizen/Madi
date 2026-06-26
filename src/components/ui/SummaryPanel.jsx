import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Tag, Loader2, RefreshCw } from 'lucide-react'

export function SummaryPanel({ summary, loading, onClose, onRegenerate }) {
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
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(24px)',
            borderRadius: '28px 28px 0 0',
            padding: '28px 20px 40px',
            boxShadow: '0 -8px 40px rgba(102,126,234,0.18)',
            maxHeight: '80vh', overflowY: 'auto',
          }}
        >
          <div style={{ width: 40, height: 4, background: 'rgba(102,126,234,0.2)', borderRadius: 2, margin: '0 auto 20px' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="#F59E0B" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#1A1040' }}>Résumé</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>Généré par MadiOps</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {onRegenerate && (
                <motion.button whileTap={{ scale: 0.9 }} onClick={onRegenerate}
                  style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(245,158,11,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RefreshCw size={15} color="#F59E0B" />
                </motion.button>
              )}
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
                style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(102,126,234,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color="#667EEA" />
              </motion.button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', gap: 16 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                <Loader2 size={36} color="#667EEA" />
              </motion.div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#667EEA' }}>MadiOps analyse la conversation...</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>Génération du résumé et des sujets clés</div>
            </div>
          ) : summary ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Résumé */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(102,126,234,0.06), rgba(118,75,162,0.06))',
                border: '1.5px solid rgba(102,126,234,0.12)',
                borderRadius: 18, padding: '18px 18px', marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#667EEA', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Résumé</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1A1040', lineHeight: 1.7, margin: 0 }}>
                  {summary.summary}
                </p>
              </div>

              {/* Topics */}
              {summary.key_topics?.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Tag size={12} /> Sujets abordés
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {summary.key_topics.map((topic, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                        style={{
                          padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                          background: 'rgba(102,126,234,0.10)', color: '#667EEA',
                          border: '1px solid rgba(102,126,234,0.18)',
                        }}>
                        {topic}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#9CA3AF' }}>
              <FileText size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <div style={{ fontSize: 15, fontWeight: 700 }}>Aucun résumé disponible</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Lance un résumé depuis le menu</div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
