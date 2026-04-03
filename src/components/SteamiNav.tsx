import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSteamiStore } from '@/stores/steami-store';
import { useState, useEffect, useCallback } from 'react';

const navLinks = [
  { path: '/', label: 'EXPLAINERS' },
  { path: '/research', label: 'RESEARCH' },
  { path: '/simulations', label: 'SIMULATIONS' },
  { path: '/dashboard', label: 'DASHBOARD' },
];

export function SteamiNav() {
  const location = useLocation();
  const diaryCount = useSteamiStore((s) => s.diary.length);
  const [subscribed, setSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close on route change
  useEffect(() => { closeMenu(); }, [location.pathname, closeMenu]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  return (
    <>
      <motion.nav
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 h-12 z-50 flex items-center px-5 md:px-7 gap-8"
        style={{
          background: 'rgba(3, 8, 20, 0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 1px 32px rgba(0,0,0,0.4)',
        }}
      >
        <Link to="/" className="font-mono text-[13px] font-semibold tracking-wider group">
          <motion.span
            className="text-steami-gold inline-block"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            STEAMI
          </motion.span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-5 ml-3">
          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                className="relative"
              >
                <Link
                  to={link.path}
                  className={`nav-link-animated font-mono text-[10px] tracking-[0.12em] uppercase transition-colors ${
                    isActive ? 'text-steami-cyan active' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {diaryCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="hidden md:block"
            >
              <Link to="/dashboard" className="font-mono text-[9px] tracking-wider uppercase px-3 py-1.5 rounded steami-badge-gold">
                📝 {diaryCount} notes
              </Link>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSubscribed(!subscribed)}
            className={`hidden md:inline-flex font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-md transition-all ${
              subscribed ? 'text-steami-gold' : 'text-muted-foreground hover:text-steami-cyan'
            }`}
            style={{
              border: `1px solid ${subscribed ? 'rgba(232, 184, 75, 0.35)' : 'rgba(99, 179, 237, 0.18)'}`,
              background: subscribed ? 'rgba(232, 184, 75, 0.1)' : 'rgba(10, 25, 55, 0.4)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {subscribed ? '✓ SUBSCRIBED' : '✦ SUBSCRIBE'}
          </motion.button>

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center focus:outline-none"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="sr-only">{menuOpen ? 'Close' : 'Menu'}</span>
            <span
              className="block absolute w-5 transition-all duration-300 ease-in-out"
              style={{ height: 14 }}
            >
              {/* Top line */}
              <span
                className="block absolute h-[2px] w-5 rounded-full bg-foreground transition-all duration-300"
                style={{
                  top: menuOpen ? 6 : 0,
                  transform: menuOpen ? 'rotate(45deg)' : 'rotate(0)',
                }}
              />
              {/* Middle line */}
              <span
                className="block absolute top-[6px] h-[2px] w-5 rounded-full bg-foreground transition-all duration-300"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              {/* Bottom line */}
              <span
                className="block absolute h-[2px] w-5 rounded-full bg-foreground transition-all duration-300"
                style={{
                  top: menuOpen ? 6 : 12,
                  transform: menuOpen ? 'rotate(-45deg)' : 'rotate(0)',
                }}
              />
            </span>
          </button>
        </div>
      </motion.nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[49] bg-black/60"
              onClick={closeMenu}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[51] w-[75vw] max-w-xs flex flex-col pt-16 px-6 pb-8"
              style={{
                background: 'rgba(10, 18, 42, 0.97)',
                backdropFilter: 'blur(24px) saturate(160%)',
                borderLeft: '1px solid rgba(111, 168, 255, 0.1)',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
              }}
            >
              {/* Nav links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
                    >
                      <Link
                        to={link.path}
                        onClick={closeMenu}
                        className={`block font-mono text-[13px] tracking-[0.14em] uppercase py-3 px-3 rounded-lg transition-colors ${
                          isActive
                            ? 'text-steami-cyan bg-accent/10'
                            : 'text-foreground/70 hover:text-foreground hover:bg-accent/5'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-border/30" />

              {/* Diary badge */}
              {diaryCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="font-mono text-[10px] tracking-wider uppercase px-3 py-2 rounded steami-badge-gold inline-block"
                  >
                    📝 {diaryCount} notes
                  </Link>
                </motion.div>
              )}

              {/* Subscribe */}
              <motion.div
                className="mt-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <button
                  onClick={() => setSubscribed(!subscribed)}
                  className={`w-full font-mono text-[11px] tracking-wider uppercase px-4 py-3 rounded-lg transition-all ${
                    subscribed ? 'text-steami-gold' : 'text-muted-foreground'
                  }`}
                  style={{
                    border: `1px solid ${subscribed ? 'rgba(232, 184, 75, 0.35)' : 'rgba(99, 179, 237, 0.18)'}`,
                    background: subscribed ? 'rgba(232, 184, 75, 0.1)' : 'rgba(10, 25, 55, 0.4)',
                  }}
                >
                  {subscribed ? '✓ SUBSCRIBED' : '✦ SUBSCRIBE'}
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
