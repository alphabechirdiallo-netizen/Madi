import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

const GALLERY = [
  // Afrique
  { src: '/world/w01.jpg', caption: 'Médina de Fès', location: 'Maroc, Afrique', theme: 'Afrique', quote: 'Là où la tradition rencontre l\'opportunité.' },
  { src: '/world/w02.jpg', caption: 'Le Cap au crépuscule', location: 'Afrique du Sud', theme: 'Afrique', quote: 'La lumière naît toujours après la nuit la plus sombre.' },
  { src: '/world/w03.jpg', caption: 'Dacca vue du ciel', location: 'Bangladesh, Asie', theme: 'Villes', quote: 'Chaque métropole porte en elle mille histoires à investir.' },
  { src: '/world/w04.jpg', caption: 'Le Baobab solitaire', location: 'Madagascar, Afrique', theme: 'Afrique', quote: 'Les racines profondes portent les cimes les plus hautes.' },
  { src: '/world/w05.jpg', caption: 'Afrique vue du globe', location: 'Carte du Monde', theme: 'Monde', quote: 'L\'Afrique — le continent aux mille opportunités.' },
  { src: '/world/w06.jpg', caption: 'Sourires d\'Afrique', location: 'Afrique de l\'Ouest', theme: 'Afrique', quote: 'La vraie richesse, c\'est celle qu\'on partage.' },
  { src: '/world/w07.jpg', caption: 'Girafe au coucher de soleil', location: 'Kenya, Afrique de l\'Est', theme: 'Nature', quote: 'Voir loin est un art que la nature enseigne.' },
  { src: '/world/w09.jpg', caption: 'Highlands d\'Éthiopie', location: 'Éthiopie, Afrique', theme: 'Afrique', quote: 'Les sommets ne craignent pas les tempêtes.' },
  { src: '/world/w10.jpg', caption: 'Chutes Victoria', location: 'Zimbabwe/Zambie', theme: 'Afrique', quote: 'La puissance de l\'eau façonne même la roche la plus dure.' },
  { src: '/world/w11.jpg', caption: 'Allée des Baobabs', location: 'Madagascar', theme: 'Afrique', quote: 'Certains chemins ne se marchent qu\'en silence.' },
  { src: '/world/w13.jpg', caption: 'Savane africaine', location: 'Afrique de l\'Est', theme: 'Nature', quote: 'L\'immensité nous rappelle nos vraies priorités.' },

  // Europe
  { src: '/world/w33.jpg', caption: 'Europe des Nations', location: 'Europe', theme: 'Europe', quote: 'L\'union est la plus grande des forces.' },
  { src: '/world/w34.jpg', caption: 'Parlement Européen', location: 'Bruxelles, Belgique', theme: 'Europe', quote: 'Les décisions d\'aujourd\'hui façonnent les marchés de demain.' },
  { src: '/world/w35.jpg', caption: 'Place Saint-Marc', location: 'Venise, Italie', theme: 'Europe', quote: 'Venise — là où même les pierres racontent l\'histoire du commerce.' },
  { src: '/world/w21.jpg', caption: 'Lac de Braies', location: 'Dolomites, Italie', theme: 'Europe', quote: 'La beauté absolue est un investissement de l\'âme.' },
  { src: '/world/w23.jpg', caption: 'Tour Eiffel', location: 'Paris, France', theme: 'Europe', quote: 'Paris — la ville où les rêves trouvent leur langue.' },
  { src: '/world/w24.jpg', caption: 'Big Ben & Téléphone', location: 'Londres, Royaume-Uni', theme: 'Europe', quote: 'Le temps est la monnaie la plus précieuse.' },
  { src: '/world/w14.jpg', caption: 'Cascade d\'Écosse', location: 'Highlands, Écosse', theme: 'Europe', quote: 'La nature sauvage ressource les esprits les plus vifs.' },

  // Monde & Civilisation
  { src: '/world/w25.jpg', caption: 'Statue de la Liberté', location: 'New York, États-Unis', theme: 'Monde', quote: 'La liberté est le premier des investissements.' },
  { src: '/world/w32.jpg', caption: 'Taj Mahal', location: 'Agra, Inde', theme: 'Monde', quote: 'L\'amour et l\'excellence ne se font jamais à moitié.' },
  { src: '/world/w29.jpg', caption: 'Petronas Towers', location: 'Kuala Lumpur, Malaisie', theme: 'Villes', quote: 'L\'Asie — le futur du monde s\'écrit ici.' },
  { src: '/world/w20.jpg', caption: 'Colisée de Rome', location: 'Rome, Italie', theme: 'Monde', quote: 'Ce qui est bâti avec grandeur traverse les siècles.' },

  // Nature & Paradis
  { src: '/world/w16.jpg', caption: 'Eaux turquoise de Turquie', location: 'Turquie, Méditerranée', theme: 'Paradis', quote: 'Certains endroits guérissent sans un seul mot.' },
  { src: '/world/w19.jpg', caption: 'Mt. Rainier', location: 'Washington, USA', theme: 'Nature', quote: 'Les plus beaux sommets se méritent.' },
  { src: '/world/w28.jpg', caption: 'Plage de palmiers', location: 'Îles tropicales', theme: 'Paradis', quote: 'Le paradis n\'est pas un endroit — c\'est un état d\'esprit atteint.' },
  { src: '/world/w30.jpg', caption: 'Maldives', location: 'Maldives, Océan Indien', theme: 'Paradis', quote: 'La mer ne connaît pas de frontières.' },

  // Villes & Architecture
  { src: '/world/w12.jpg', caption: 'Village dans les nuages', location: 'Artvin, Turquie', theme: 'Villes', quote: 'Construire dans les hauteurs exige de voir plus loin.' },
  { src: '/world/w22.jpg', caption: 'Rue pluvieuse la nuit', location: 'Ville nocturne', theme: 'Villes', quote: 'Les villes la nuit révèlent ce que le jour cache.' },
  { src: '/world/w26.jpg', caption: 'Chute tropicale', location: 'Forêt tropicale', theme: 'Nature', quote: 'La richesse coule là où la nature est préservée.' },
  { src: '/world/w27.jpg', caption: 'Jungle luxuriante', location: 'Asie du Sud-Est', theme: 'Nature', quote: 'La vie trouve toujours son chemin.' },
  { src: '/world/w31.jpg', caption: 'Hôtel de luxe', location: 'Destination premium', theme: 'Paradis', quote: 'L\'excellence se voit dans chaque détail.' },
]

const THEMES = ['Tout', 'Afrique', 'Europe', 'Monde', 'Nature', 'Paradis', 'Villes']

export function WorldGallery({ onClose }) {
  const [activeTheme, setActiveTheme] = useState('Tout')
  const [lightbox, setLightbox] = useState(null)

  const filtered = activeTheme === 'Tout' ? GALLERY : GALLERY.filter(i => i.theme === activeTheme)

  const prev = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length)
  const next = () => setLightbox(i => (i + 1) % filtered.length)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(8,4,20,0.97)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 0',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#667EEA,#764BA2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>MadiOps World</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Exploration & Évasion</div>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} color="#fff" />
          </motion.button>
        </div>

        {/* Theme filters */}
        <div style={{ padding: '16px 16px 12px', overflowX: 'auto', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
            {THEMES.map(theme => (
              <motion.button key={theme} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTheme(theme)}
                style={{
                  padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: activeTheme === theme
                    ? 'linear-gradient(135deg, #667EEA, #764BA2)'
                    : 'rgba(255,255,255,0.08)',
                  color: activeTheme === theme ? '#fff' : 'rgba(255,255,255,0.6)',
                  boxShadow: activeTheme === theme ? '0 3px 12px rgba(102,126,234,0.4)' : 'none',
                }}>
                {theme}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {filtered.map((item, i) => (
              <motion.div
                key={item.src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLightbox(i)}
                style={{
                  position: 'relative', borderRadius: 16, overflow: 'hidden',
                  aspectRatio: '4/3', cursor: 'pointer',
                }}
              >
                <img src={item.src} alt={item.caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  padding: '20px 10px 10px',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{item.caption}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                    <MapPin size={9} /> {item.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 600,
                background: 'rgba(0,0,0,0.96)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setLightbox(null)}
                style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} color="#fff" />
              </motion.button>

              {/* Image */}
              <motion.img
                key={lightbox}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                src={filtered[lightbox].src}
                alt={filtered[lightbox].caption}
                style={{ maxWidth: '94vw', maxHeight: '60vh', borderRadius: 18, objectFit: 'cover' }}
              />

              {/* Caption + Quote */}
              <motion.div
                key={`caption-${lightbox}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ textAlign: 'center', padding: '20px 28px', maxWidth: 400 }}
              >
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
                  {filtered[lightbox].caption}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 14 }}>
                  <MapPin size={11} /> {filtered[lightbox].location}
                </div>
                <div style={{
                  fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.6, fontWeight: 600,
                  borderLeft: '3px solid #667EEA', paddingLeft: 14, textAlign: 'left',
                }}>
                  "{filtered[lightbox].quote}"
                </div>
              </motion.div>

              {/* Nav */}
              <div style={{ display: 'flex', gap: 12 }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={prev}
                  style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={22} color="#fff" />
                </motion.button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {filtered.map((_, i) => (
                    <div key={i} style={{ width: i === lightbox ? 16 : 6, height: 6, borderRadius: 3, background: i === lightbox ? '#667EEA' : 'rgba(255,255,255,0.25)', transition: 'all 0.2s' }} />
                  ))}
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={next}
                  style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={22} color="#fff" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
