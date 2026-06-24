import { motion } from 'framer-motion'

export function MadiOpsLogo({ size = 36, showName = false, nameSize = 'lg', animate = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <motion.div
        initial={animate ? { scale: 0.8, opacity: 0 } : false}
        animate={animate ? { scale: 1, opacity: 1 } : false}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: size,
          height: size,
          borderRadius: '22%', // iOS icon corners
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}
      >
        <img
          src="/logo.png"
          alt="MadiOps"
          style={{ width: '86%', height: '86%', objectFit: 'contain' }}
        />
      </motion.div>
      {showName && (
        <motion.div
          initial={animate ? { opacity: 0, x: -8 } : false}
          animate={animate ? { opacity: 1, x: 0 } : false}
          transition={{ delay: 0.1 }}
        >
          <div style={{ fontWeight: 700, fontSize: nameSize === 'lg' ? 18 : nameSize === 'xl' ? 24 : 15, color: '#0F172A', lineHeight: 1.1 }}>
            MadiOps
          </div>
          {nameSize !== 'sm' && (
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, letterSpacing: '0.02em' }}>
              IA Conseil d'Investissement
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
