import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Menu, X } from 'lucide-react'

/* ── helpers ─────────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function SlideIn({ children, from = 'left', delay = 0, className = '' }: { children: React.ReactNode; from?: 'left' | 'right'; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, x: from === 'left' ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

/* ── data ────────────────────────────────────────────────────────────── */
const NAV = ['Home', 'Studio', 'Services', 'Contact', 'FAQs']

const PORTRAITS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=160&h=160&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1607503873903-c5e95f80d7b9?w=160&h=160&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=160&h=160&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face',
]

const MEETING1 = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&h=500&fit=crop'
const MEETING2 = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=500&fit=crop'

const OFFERINGS = [
  { tag: 'Office of multiple\ninterest content',         service: 'Collaborative & partnership' },
  { tag: 'The hanger US Air force\ndigital experimental', service: 'We talk about our weight'    },
  { tag: 'Delta faucet content,\nsocial, digital',        service: 'Piloting digital confidence'  },
]

/* ── styles (inline for zero-dependency CSS) ─────────────────────────── */
const S: Record<string, React.CSSProperties> = {
  page:        { minHeight: '100vh', background: '#fff', overflowX: 'hidden' },
  container:   { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(1.25rem,4vw,3rem)' },

  /* navbar */
  navbar:      { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '1rem 0' },
  navInner:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo:        { fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700 },
  navLinks:    { display: 'flex', alignItems: 'center', gap: '2.5rem' },
  navLink:     { fontSize: '0.875rem', color: '#374151', position: 'relative' as const },
  burger:      { padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' },

  /* hero */
  hero:        { paddingTop: '7rem', paddingBottom: '3rem', position: 'relative' as const, overflow: 'hidden', textAlign: 'center' },
  h1:          { fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.4rem,5.5vw,5rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em', marginBottom: '1.25rem' },
  hlPurple:    { color: '#7c3aed' },
  hlGreen:     { background: '#d4f4dd', borderRadius: '100px', padding: '2px 14px', display: 'inline-block' },
  hlOrange:    { textDecoration: 'underline', textDecorationColor: '#f59e0b', textDecorationThickness: '3px', textUnderlineOffset: '4px' },
  subtext:     { fontSize: '0.95rem', color: '#6b7280', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.75 },
  photosRow:   { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' as const, gap: '0.5rem', marginTop: '1rem' },
  avatar:      { borderRadius: '50%', overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', flexShrink: 0, cursor: 'pointer' },

  /* sections */
  section:     { padding: 'clamp(4rem,8vw,6rem) 0', position: 'relative' as const, overflow: 'hidden' },
  grid2:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' },
  sectionH2:   { fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.75rem,3vw,2.75rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '1.25rem' },
  bodyText:    { fontSize: '0.93rem', color: '#6b7280', lineHeight: 1.8, marginBottom: '1.25rem', maxWidth: 420 },
  readMore:    { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 500, color: '#111827' },
  circle:      { borderRadius: '50%', overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.14)', cursor: 'pointer', position: 'relative' as const },

  /* offerings */
  offerTitle:  { fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '3rem', position: 'relative' as const, display: 'inline-block' },
  offerRow:    { display: 'grid', gridTemplateColumns: '220px 1fr 40px', alignItems: 'center', gap: '1.5rem', padding: '1.4rem 1.25rem', borderTop: '1px solid #e5e7eb', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' },
  offerTag:    { fontSize: '0.78rem', color: '#9ca3af', lineHeight: 1.6, whiteSpace: 'pre-line' as const },
  offerSvc:    { fontFamily: "'Courier New', monospace", fontSize: 'clamp(1rem,2vw,1.4rem)', fontWeight: 600 },

  /* testimonial */
  quoteCard:   { border: '2px solid #fca5a5', borderRadius: '1.5rem', padding: 'clamp(2rem,4vw,3rem)', position: 'relative' as const, background: '#fff' },
  quoteText:   { fontSize: '0.95rem', lineHeight: 1.85, color: '#374151', textAlign: 'center' as const },
  bigQuote:    { fontSize: '4rem', lineHeight: 1, color: '#d1d5db', userSelect: 'none' as const },
  sideAvatar:  { position: 'absolute' as const, borderRadius: '50%', overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', cursor: 'pointer' },

  /* newsletter */
  newsletter:  { background: '#d4f4dd', padding: 'clamp(4rem,8vw,6rem) 0', position: 'relative' as const, overflow: 'hidden', textAlign: 'center' },
  nlH2:        { fontFamily: "'Courier New', monospace", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' },
  nlSub:       { fontSize: '0.95rem', color: '#374151', marginBottom: '2rem' },
  nlBtn:       { background: '#111827', color: '#fff', padding: '0.875rem 2.5rem', borderRadius: '100px', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: 'Inter, sans-serif' },
  purpleBlob:  { position: 'absolute' as const, top: '-4rem', right: '-4rem', width: 160, height: 200, background: '#7c3aed', borderRadius: '50% 50% 40% 60% / 60% 40% 60% 40%', opacity: 0.5, pointerEvents: 'none' as const },

  /* footer */
  footer:      { background: '#d4f4dd', padding: '0 0 2.5rem' },
  divider:     { height: 1, background: 'rgba(0,0,0,0.1)', marginBottom: '2.5rem' },
  footGrid:    { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', marginBottom: '2.5rem' },
  footTitle:   { fontFamily: 'Syne, sans-serif', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem' },
  footLink:    { fontSize: '0.82rem', color: '#4b5563', display: 'block', marginBottom: '0.6rem' },
  copyright:   { textAlign: 'center' as const, fontSize: '0.78rem', color: '#6b7280', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.08)' },
}

/* ── component ───────────────────────────────────────────────────────── */

/* ── OfferRow — isolated hover state per row ─────────────────────────── */
function OfferRow({
  item, index, isLast, isActive, onClick
}: {
  item: { tag: string; service: string }
  index: number
  isLast: boolean
  isActive: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const highlighted = hovered || isActive

  return (
    <motion.div
      style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr 40px',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.4rem 1.25rem',
        borderTop: '1px solid #e5e7eb',
        borderBottom: isLast ? '1px solid #e5e7eb' : undefined,
        cursor: 'pointer',
        borderRadius: '8px',
        backgroundColor: hovered ? '#f5f3ff' : '#fff',
        transition: 'background-color 0.2s ease',
      }}
      className="offer-row-responsive"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      {/* left tag */}
      <motion.p
        style={{
          fontSize: '0.78rem',
          lineHeight: 1.6,
          whiteSpace: 'pre-line' as const,
          color: highlighted ? '#7c3aed' : '#9ca3af',
          transition: 'color 0.2s ease',
        }}
      >{item.tag}</motion.p>

      {/* service name */}
      <motion.span
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 'clamp(1rem,2vw,1.4rem)',
          fontWeight: 600,
          color: highlighted ? '#7c3aed' : '#111827',
          transition: 'color 0.2s ease',
        }}
      >{item.service}</motion.span>

      {/* arrow */}
      <motion.div
        style={{ display: 'flex', justifyContent: 'flex-end' }}
        animate={{
          x: highlighted ? 8 : 0,
          rotate: highlighted ? -45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      >
        <ArrowRight size={18} color={highlighted ? '#7c3aed' : '#9ca3af'} />
      </motion.div>
    </motion.div>
  )
}

export default function App() {
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [activeRow,  setActiveRow]  = useState<number | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <div style={S.page}>

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <motion.header
        style={{
          ...S.navbar,
          background:     scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          boxShadow:      scrolled ? '0 1px 0 rgba(0,0,0,0.07)' : 'none',
          transition:     'background .3s, box-shadow .3s',
        }}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ ...S.container, ...S.navInner }}>
          <motion.span style={S.logo} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            Elementum
          </motion.span>

          {/* desktop nav */}
          <nav style={{ ...S.navLinks, display: 'flex' }} className="hide-mobile">
            {NAV.map((link, i) => (
              <motion.a key={link} href="#" style={S.navLink}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                whileHover="h"
              >
                {link}
                <motion.span style={{ position: 'absolute', bottom: -2, left: 0, height: 1.5, background: '#111', borderRadius: 2, display: 'block' }}
                  variants={{ h: { width: '100%' } }} initial={{ width: 0 }} transition={{ duration: 0.22 }}
                />
              </motion.a>
            ))}
          </nav>

          {/* burger */}
          <motion.button style={S.burger} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }} onClick={() => setMenuOpen(!menuOpen)}>
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen
                ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={22} /></motion.span>
                : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={22} /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>

        {/* mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div style={{ background: '#fff', borderTop: '1px solid #f3f4f6', padding: '1.5rem clamp(1.25rem,4vw,3rem)', overflow: 'hidden' }}
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {NAV.map(link => (
                <a key={link} href="#" style={{ display: 'block', padding: '0.65rem 0', fontSize: '1rem', color: '#374151', borderBottom: '1px solid #f9fafb' }}
                  onClick={() => setMenuOpen(false)}>{link}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={S.hero} ref={heroRef}>
        {/* wavy red line left */}
        <motion.div style={{ position: 'absolute', left: 0, top: '15%', width: 40, height: 360, pointerEvents: 'none' }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.8 }}>
          <svg viewBox="0 0 40 360" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
            <motion.path d="M 20 0 Q 8 90 20 180 Q 32 270 20 360" stroke="#ff8080" strokeWidth="2" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1, duration: 1.8, ease: 'easeInOut' }} />
          </svg>
        </motion.div>

        {/* purple glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(167,139,250,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div style={{ ...S.container }} >
          <motion.div style={{ y: heroY }}>
            {/* word-by-word headline */}
            <motion.h1 style={S.h1} initial="h" animate="v" variants={{ h: {}, v: { transition: { staggerChildren: 0.07 } } }}>
              {(['The', 'thinkers', 'and', 'doers', 'were'] as string[]).map((w, i) => (
                <motion.span key={i} style={{ display: 'inline-block', marginRight: '0.25em' }}
                  variants={{ h: { opacity: 0, y: 30 }, v: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {i === 1 ? <span style={S.hlOrange}>{w}</span> : w}
                </motion.span>
              ))}
              <motion.span style={{ display: 'inline-block', marginRight: '0.25em', ...S.hlPurple }}
                variants={{ h: { opacity: 0, y: 30 }, v: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}>changing</motion.span>
              {(['the'] as string[]).map((w, i) => (
                <motion.span key={`c${i}`} style={{ display: 'inline-block', marginRight: '0.25em' }}
                  variants={{ h: { opacity: 0, y: 30 }, v: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5 }}>{w}</motion.span>
              ))}
              <motion.span style={{ display: 'inline-block', marginRight: '0.25em' }}
                variants={{ h: { opacity: 0, y: 30 }, v: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}>
                <span style={S.hlGreen}>status</span>
              </motion.span>
              {(['Quo', 'with'] as string[]).map((w, i) => (
                <motion.span key={`d${i}`} style={{ display: 'inline-block', marginRight: '0.25em' }}
                  variants={{ h: { opacity: 0, y: 30 }, v: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5 }}>{w}</motion.span>
              ))}
            </motion.h1>

            <FadeUp delay={0.65}>
              <p style={S.subtext}>
                We are a team of strategists, designers, communicators, researchers. Together, we
                believe that progress only happens when you refuse to play things safe.
              </p>
            </FadeUp>

            {/* portraits staggered pop-in */}
            <motion.div style={S.photosRow}
              initial="h" animate="v"
              variants={{ h: {}, v: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } } }}
            >
              {PORTRAITS.map((src, i) => {
                const sz = 60 + (i % 3) * 16
                return (
                  <motion.div key={i} style={{ ...S.avatar, width: sz, height: sz, marginBottom: i % 2 === 0 ? 0 : 20 }}
                    variants={{ h: { opacity: 0, scale: 0.4 }, v: { opacity: 1, scale: 1 } }}
                    transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                    whileHover={{ scale: 1.18, boxShadow: '0 10px 28px rgba(0,0,0,0.2)', borderColor: '#c4b5fd' }}
                  >
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Tomorrow ─────────────────────────────────────────────── */}
      <section style={S.section}>
        {/* pink blob */}
        <motion.div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(251,207,232,0.5) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }} />

        <div style={S.container}>
          <div style={S.grid2} className="grid-responsive">
            <SlideIn from="left">
              <h2 style={S.sectionH2}>
                <span style={S.hlOrange}>Tomorrow</span> should be better than{' '}
                <span style={S.hlGreen}>today</span>
              </h2>
              <p style={S.bodyText}>
                We are a team of strategists, communicators, researchers. Together, we believe that
                progress only happens when you refuse to play things safe.
              </p>
              <motion.a href="#" style={S.readMore} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 380, damping: 24 }}>
                Read more <ArrowRight size={15} />
              </motion.a>
            </SlideIn>

            <SlideIn from="right" delay={0.1}>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                {/* floating triangle */}
                <motion.div style={{ position: 'absolute', top: -20, right: '10%', zIndex: 2 }}
                  animate={{ rotate: [0, 7, 0, -7, 0], y: [0, -7, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
                  <svg width="52" height="52" viewBox="0 0 60 60"><polygon points="30,4 56,52 4,52" fill="#ff8080" opacity="0.9" /></svg>
                </motion.div>
                <motion.div style={{ ...S.circle, width: 300, height: 300 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 26 }}>
                  <motion.img src={MEETING1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }} />
                </motion.div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* ── Progress ─────────────────────────────────────────────── */}
      <section style={S.section}>
        {/* red wavy line right */}
        <div style={{ position: 'absolute', right: 0, top: '30%', width: 80, height: 260, pointerEvents: 'none' }}>
          <svg viewBox="0 0 80 260" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
            <motion.path d="M 40 0 Q 70 65 40 130 Q 10 195 40 260" stroke="#ff8080" strokeWidth="2" fill="none"
              initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
          </svg>
        </div>

        <div style={S.container}>
          <div style={S.grid2} className="grid-responsive">
            <SlideIn from="left">
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                {/* floating triangles */}
                <motion.div style={{ position: 'absolute', bottom: -30, left: '5%', zIndex: 2 }}
                  animate={{ rotate: [0, 9, 0, -9, 0], y: [0, -9, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}>
                  <svg width="68" height="68" viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="#ff8080" opacity="0.3" /></svg>
                </motion.div>
                <motion.div style={{ position: 'absolute', top: -20, right: '8%', zIndex: 2 }}
                  animate={{ rotate: [0, -7, 0, 7, 0], y: [0, 7, 0] }}
                  transition={{ repeat: Infinity, duration: 5, delay: 0.5, ease: 'easeInOut' }}>
                  <svg width="40" height="40" viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="#ff8080" opacity="0.5" /></svg>
                </motion.div>

                <motion.div style={{ ...S.circle, width: 300, height: 300 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 26 }}>
                  <motion.img src={MEETING2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }} />
                </motion.div>

                {/* green border draws in */}
                <motion.div style={{ position: 'absolute', inset: '-8%', border: '2px solid #22c55e', borderRadius: 8, pointerEvents: 'none' }}
                  initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </SlideIn>

            <SlideIn from="right" delay={0.1}>
              <h2 style={S.sectionH2}>See how we can help you progress</h2>
              <p style={S.bodyText}>
                We add a layer of fearless insights and action that allows change makers to accelerate
                their progress in areas such as brand, design, digital, comms and social research.
              </p>
              <motion.a href="#" style={S.readMore} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 380, damping: 24 }}>
                Read more <ArrowRight size={15} />
              </motion.a>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* ── Offerings ────────────────────────────────────────────── */}
      <section style={S.section}>
        <div style={S.container}>
          <FadeUp>
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={S.offerTitle}>
                What we <span style={S.hlGreen}>can</span> offer you!
                <motion.div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: '#fde68a', zIndex: -1, transformOrigin: '0%' }}
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }} />
              </h2>
            </div>
          </FadeUp>

          {OFFERINGS.map((item, i) => (
            <OfferRow
              key={i}
              item={item}
              index={i}
              isLast={i === OFFERINGS.length - 1}
              isActive={activeRow === i}
              onClick={() => setActiveRow(activeRow === i ? null : i)}
            />
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section style={S.section}>
        <div style={S.container}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ ...S.sectionH2, display: 'inline-block', position: 'relative' }}>
                What our customer says{' '}
                <span style={{ position: 'relative' }}>
                  About Us
                  <motion.div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: '#fde68a', zIndex: -1, transformOrigin: '0%' }}
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.65 }} />
                </span>
              </h2>
            </div>
          </FadeUp>

          <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
            {/* left avatars */}
            {[
              { src: PORTRAITS[0], style: { top: '0%',   left: '-5rem' }, size: 64,  dy: -8 },
              { src: PORTRAITS[1], style: { bottom: '5%',left: '-6rem' }, size: 80,  dy:  8 },
              { src: PORTRAITS[5], style: { top: '45%',  left: '-3rem' }, size: 50,  dy: -6 },
            ].map((p, i) => (
              <motion.div key={`l${i}`}
                style={{ ...S.sideAvatar, width: p.size, height: p.size, ...p.style as React.CSSProperties }}
                className="hide-mobile"
                initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, duration: 0.55 }}
                animate={{ y: [0, p.dy, 0] }}
                whileHover={{ scale: 1.15, borderColor: '#c4b5fd' }}>
                <img src={p.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            ))}

            {/* right avatars */}
            {[
              { src: PORTRAITS[2], style: { top: '5%',   right: '-5rem' }, size: 64, dy:  7 },
              { src: PORTRAITS[3], style: { bottom: '2%',right: '-6rem' }, size: 80, dy: -9 },
              { src: PORTRAITS[4], style: { top: '48%',  right: '-3rem' }, size: 52, dy:  6 },
            ].map((p, i) => (
              <motion.div key={`r${i}`}
                style={{ ...S.sideAvatar, width: p.size, height: p.size, ...p.style as React.CSSProperties }}
                className="hide-mobile"
                initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, duration: 0.55 }}
                animate={{ y: [0, p.dy, 0] }}
                whileHover={{ scale: 1.15, borderColor: '#c4b5fd' }}>
                <img src={p.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            ))}

            {/* quote card */}
            <FadeUp delay={0.2}>
              <motion.div style={S.quoteCard}
                whileHover={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1)', borderColor: '#f87171' }}
                transition={{ duration: 0.3 }}>
                <motion.div style={S.bigQuote}
                  initial={{ opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                >"</motion.div>
                <p style={S.quoteText}>
                  Elementum delivered the site within the timeline as they requested. In the end, the
                  client found a 50% increase in traffic within days since its launch. They also had an
                  impressive ability to use technologies that the company hasn't used, which have also
                  proved to be easy to use and reliable.
                </p>
                <motion.div style={{ ...S.bigQuote, textAlign: 'right' }}
                  initial={{ opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >"</motion.div>
              </motion.div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────── */}
      <section style={S.newsletter}>
        {/* dashed arrow doodles */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-60%)', pointerEvents: 'none' }}>
          <svg width="160" height="90" viewBox="0 0 160 90" fill="none">
            <motion.path d="M20 20 C55 8, 100 42, 118 76" stroke="#E84B3A" strokeWidth="2" strokeDasharray="6 4" fill="none"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeInOut' }} />
            <motion.path d="M118 76 L107 63 M118 76 L130 68" stroke="#E84B3A" strokeWidth="2" strokeLinecap="round"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.1 }} />
            <motion.path d="M55 55 C82 28, 130 50, 148 84" stroke="#E84B3A" strokeWidth="2" strokeDasharray="6 4" fill="none"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 1.2, ease: 'easeInOut' }} />
          </svg>
        </div>

        {/* purple blob */}
        <motion.div style={S.purpleBlob}
          animate={{ scale: [1, 1.18, 1], rotate: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }} />

        <div style={{ ...S.container, position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <h2 style={S.nlH2}>Subscribe to<br />our newsletter</h2>
            <p style={S.nlSub}>To make your stay special and even more memorable</p>
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div key="ok"
                  style={{ display: 'inline-block', padding: '0.875rem 2.5rem', background: '#16a34a', color: '#fff', borderRadius: 100, fontSize: '0.95rem', fontWeight: 500 }}
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}>
                  ✓ You're subscribed!
                </motion.div>
              ) : (
                <motion.button key="btn" style={S.nlBtn}
                  whileHover={{ scale: 1.06, backgroundColor: '#7c3aed', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => setSubscribed(true)}>
                  Subscribe Now
                </motion.button>
              )}
            </AnimatePresence>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={S.footer}>
        <div style={S.container}>
          <div style={S.divider} />
          <div style={S.footGrid} className="foot-responsive">
            {[
              { title: 'Company',          links: ['About', 'Studio', 'Service', 'Blog']                               },
              { title: 'Terms & Policies', links: ['Terms of Service', 'Privacy Policy', 'Cookies', 'Accessibility']   },
              { title: 'Follow Us',        links: ['Instagram', 'LinkedIn', 'Youtube', 'Twitter']                      },
            ].map(col => (
              <div key={col.title}>
                <p style={S.footTitle}>{col.title}</p>
                {col.links.map(link => (
                  <motion.a key={link} href="#" style={S.footLink}
                    whileHover={{ x: 4, color: '#7c3aed' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 24 }}>
                    {link}
                  </motion.a>
                ))}
              </div>
            ))}
            <div>
              <p style={S.footTitle}>Contact</p>
              <p style={{ ...S.footLink, lineHeight: 1.7 }}>1498w Fluton ste, STE<br />2D Chicago, IL 63867</p>
              <p style={S.footLink}>(123) 456789000</p>
              <p style={S.footLink}>info@elementum.com</p>
            </div>
          </div>
          <p style={S.copyright}>©2026 Elementum. All rights reserved</p>
        </div>
      </footer>

      {/* responsive helpers */}
      <style>{`
        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .grid-responsive{grid-template-columns:1fr!important;gap:2rem!important}
          .offer-row-responsive{grid-template-columns:1fr 40px!important}
          .foot-responsive{grid-template-columns:1fr 1fr!important}
        }
      `}</style>
    </div>
  )
}
           
