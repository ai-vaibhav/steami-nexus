import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SteamiLayout } from '@/components/SteamiLayout';
import { TextSelectionPopover } from '@/components/TextSelectionPopover';
import { articles, FIELDS, FIELD_ICONS, FIELD_COLORS, type Field, type Article } from '@/data/research-articles';
import { useSteamiStore } from '@/stores/steami-store';
import { staggerContainer, cardVariants, cardHover, cardTap, overlayVariants, modalVariants, fadeInUp } from '@/lib/motion';
import { X, ChevronLeft, ChevronRight, Network, FileText, Sparkles, Image as ImageIcon, Play } from 'lucide-react';

/* ── Inline media helpers ─────────────────────────────── */
const ARTICLE_HERO_IMAGES: Record<string, string> = {
  a1: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
  a2: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=400&fit=crop',
  a3: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  a4: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop',
  a5: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
  a6: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&h=400&fit=crop',
  a7: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop',
  a8: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=400&fit=crop',
  a9: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=400&fit=crop',
  a10: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=400&fit=crop',
  a11: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&h=400&fit=crop',
};

function HeroImage({ src, alt }: { src?: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  if (!src) return null;
  return (
    <div className="relative mb-6 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99, 179, 237, 0.12)' }}>
      {!loaded && <div className="shimmer w-full aspect-[2/1]" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="w-full aspect-[2/1] object-cover transition-opacity duration-500"
        style={{ opacity: loaded ? 1 : 0, borderRadius: 'inherit' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

export default function ResearchPage() {
  const [activeField, setActiveField] = useState<Field>('PHYSICS');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const diary = useSteamiStore((s) => s.diary);
  const recommendations = useSteamiStore((s) => s.recommendations);

  const filtered = articles.filter((a) => a.field === activeField);

  const fieldScrollRef = useRef<HTMLDivElement>(null);
  const scrollFields = (dir: number) => {
    if (fieldScrollRef.current) {
      fieldScrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <SteamiLayout>
      {/* Page Header */}
      <motion.div className="mb-6" variants={fadeInUp} initial="hidden" animate="visible">
        <h1 className="steami-heading text-3xl md:text-4xl mb-3">📚 Research Articles</h1>
        <p className="text-[13px] font-light text-muted-foreground max-w-xl leading-relaxed">
          Deep research environment across 11 scientific fields. Click articles for full study with knowledge tools.
        </p>
      </motion.div>

      {/* Field Selector */}
      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <button
          onClick={() => scrollFields(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-steami-cyan transition-colors"
          style={{ background: 'rgba(3, 8, 20, 0.8)' }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div
          ref={fieldScrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-10"
          style={{ scrollbarWidth: 'none' }}
        >
          {FIELDS.map((field, i) => (
            <motion.button
              key={field}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.03, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveField(field)}
              className={`shrink-0 font-mono text-[9px] tracking-wider uppercase px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                activeField === field
                  ? 'text-steami-gold border-steami-gold/50'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                border: `1px solid ${activeField === field ? 'rgba(232, 184, 75, 0.5)' : 'rgba(99, 179, 237, 0.14)'}`,
                background: activeField === field ? 'rgba(232, 184, 75, 0.12)' : 'rgba(8, 18, 40, 0.4)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span>{FIELD_ICONS[field]}</span>
              {field}
            </motion.button>
          ))}
        </div>
        <button
          onClick={() => scrollFields(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-steami-cyan transition-colors"
          style={{ background: 'rgba(3, 8, 20, 0.8)' }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Article Cards */}
      <div className="steami-section-label">{FIELD_ICONS[activeField]} {activeField} — {filtered.length} ARTICLES</div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        key={activeField}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((article, idx) => (
            <motion.div
              key={article.id}
              layout
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              whileHover={cardHover}
              whileTap={cardTap}
              className="glass-card relative p-5 cursor-pointer overflow-hidden"
              onClick={() => setSelectedArticle(article)}
            >
              {/* Thumbnail */}
              {ARTICLE_HERO_IMAGES[article.id] && (
                <div className="relative mb-3 rounded-lg overflow-hidden aspect-[2.2/1]">
                  <img
                    src={ARTICLE_HERO_IMAGES[article.id]}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-foreground/60" />
                    <span className="font-mono text-[8px] text-foreground/60">MEDIA</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className={`steami-badge steami-badge-${FIELD_COLORS[article.field]} text-[8px]`}>
                  {article.field}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">{article.readTime}</span>
              </div>
              <h3 className="font-serif text-sm font-bold mb-2 leading-snug text-foreground">{article.title}</h3>
              <p className="text-[11px] font-light text-muted-foreground leading-relaxed line-clamp-2">{article.abstract}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[9px] text-muted-foreground">{article.author}</span>
                <span className="font-mono text-[9px] text-muted-foreground">{article.date}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground font-mono text-sm">
            No articles in this field yet. More coming soon.
          </div>
        )}
      </motion.div>

      {/* ─── FULL ARTICLE MODAL (split layout) ─────────── */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[200] flex p-4"
            style={{ background: 'rgba(2, 8, 18, 0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-1 max-w-[1100px] mx-auto gap-4 max-h-[90vh] flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Content */}
              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto rounded-xl min-w-0"
                style={{
                  background: 'rgba(5, 14, 32, 0.92)',
                  backdropFilter: 'blur(24px) saturate(160%)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                }}
              >
                <TextSelectionPopover
                  containerRef={contentRef as React.RefObject<HTMLDivElement>}
                  source={selectedArticle.title}
                  sourceType="article"
                  field={selectedArticle.field}
                />

                {/* Header */}
                <div className="sticky top-0 z-10 px-7 py-4 flex items-center justify-between border-b border-foreground/5"
                  style={{ background: 'rgba(5, 14, 32, 0.95)', backdropFilter: 'blur(20px)' }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`steami-badge steami-badge-${FIELD_COLORS[selectedArticle.field]}`}>{selectedArticle.field}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">{selectedArticle.readTime}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedArticle(null)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-steami-red transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,25,55,0.4)' }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Article Body */}
                <div className="p-7">
                  {/* Hero Image */}
                  <HeroImage src={ARTICLE_HERO_IMAGES[selectedArticle.id]} alt={selectedArticle.title} />

                  <motion.h2
                    className="steami-heading text-2xl mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {selectedArticle.title}
                  </motion.h2>
                  <div className="flex items-center gap-3 mb-5 font-mono text-[10px] text-muted-foreground">
                    <span>{selectedArticle.author}</span>
                    <span>·</span>
                    <span>{selectedArticle.date}</span>
                  </div>

                  {/* Abstract */}
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm font-light leading-relaxed text-muted-foreground mb-6 pl-5 border-l-2 border-steami-gold/50"
                    style={{ fontStyle: 'italic', color: '#8aacca' }}
                  >
                    {selectedArticle.abstract}
                  </motion.div>

                  {/* Content */}
                  {selectedArticle.content.map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                      className="text-[13px] font-light leading-relaxed text-foreground/80 mb-5"
                    >
                      {para}
                    </motion.p>
                  ))}

                  {/* Quotes */}
                  {selectedArticle.quotes.map((quote, i) => (
                    <motion.blockquote
                      key={i}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="my-6 p-4 rounded-lg"
                      style={{ background: 'rgba(232, 184, 75, 0.06)', borderLeft: '3px solid hsl(var(--steami-gold))' }}
                    >
                      <p className="text-sm font-light leading-relaxed text-steami-gold2 italic">{quote}</p>
                    </motion.blockquote>
                  ))}

                  {/* Key Findings — visible on mobile, hidden on lg (shown in sidebar) */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl p-5 mt-6 lg:hidden"
                    style={{ background: 'rgba(6, 16, 38, 0.5)', border: '1px solid rgba(99, 179, 237, 0.14)' }}
                  >
                    <div className="font-mono text-[10px] tracking-wider uppercase text-steami-cyan mb-3 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> KEY FINDINGS
                    </div>
                    {selectedArticle.keyFindings.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 py-1.5 border-b border-steami-cyan/5 last:border-0">
                        <span className="text-steami-cyan text-xs mt-0.5">◆</span>
                        <span className="font-mono text-[11px] text-muted-foreground leading-relaxed">{f}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* ── Right Sidebar (desktop) ────────────────── */}
              <motion.div
                className="w-72 hidden lg:flex flex-col gap-3 overflow-y-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {/* KEY FINDINGS — repositioned to sidebar */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(5, 14, 32, 0.88)', border: '1px solid rgba(99, 179, 237, 0.22)' }}>
                  <div className="font-mono text-[10px] tracking-wider uppercase text-steami-cyan mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> KEY FINDINGS
                  </div>
                  {selectedArticle.keyFindings.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-start gap-2 py-1.5 border-b border-steami-cyan/5 last:border-0"
                    >
                      <span className="text-steami-cyan text-xs mt-0.5">◆</span>
                      <span className="font-mono text-[11px] text-muted-foreground leading-relaxed">{f}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Knowledge Map */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(5, 14, 32, 0.88)', border: '1px solid rgba(99, 179, 237, 0.14)' }}>
                  <div className="font-mono text-[10px] tracking-wider uppercase text-steami-cyan mb-3 flex items-center gap-2">
                    <Network className="w-3 h-3" /> KNOWLEDGE MAP
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArticle.relatedTopics.map((topic, i) => (
                      <motion.span
                        key={topic}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
                        className="steami-badge steami-badge-cyan text-[8px]"
                      >
                        {topic}
                      </motion.span>
                    ))}
                    <span className="steami-badge steami-badge-gold text-[8px]">{selectedArticle.field}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-steami-cyan/10">
                    <div className="font-mono text-[9px] text-muted-foreground mb-2">RELATED ARTICLES</div>
                    {articles.filter(a => a.id !== selectedArticle.id && a.field === selectedArticle.field).slice(0, 2).map(a => (
                      <motion.button
                        key={a.id}
                        whileHover={{ x: 3, backgroundColor: 'rgba(99, 179, 237, 0.08)' }}
                        onClick={() => setSelectedArticle(a)}
                        className="block w-full text-left p-2 rounded-md mb-1 transition-colors"
                      >
                        <div className="font-serif text-[11px] font-bold text-foreground leading-tight">{a.title}</div>
                        <div className="font-mono text-[9px] text-muted-foreground mt-1">{a.author}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Research Diary */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(5, 14, 32, 0.88)', border: '1px solid rgba(232, 184, 75, 0.14)' }}>
                  <div className="font-mono text-[10px] tracking-wider uppercase text-steami-gold mb-3 flex items-center gap-2">
                    <FileText className="w-3 h-3" /> RESEARCH DIARY
                  </div>
                  {diary.length === 0 ? (
                    <p className="font-mono text-[10px] text-muted-foreground">Select text in any article to save notes here.</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {diary.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="p-2 rounded-md text-[10px] font-mono text-muted-foreground" style={{ background: 'rgba(232, 184, 75, 0.05)', border: '1px solid rgba(232, 184, 75, 0.1)' }}>
                          "{entry.text.slice(0, 80)}..."
                          <div className="text-[8px] mt-1 text-steami-gold/60">{entry.source}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Recommendations */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(5, 14, 32, 0.88)', border: '1px solid rgba(167, 139, 250, 0.14)' }}>
                  <div className="font-mono text-[10px] tracking-wider uppercase text-steami-violet mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> AI RECOMMENDATIONS
                  </div>
                  {recommendations.slice(0, 3).map((rec) => (
                    <motion.div
                      key={rec.id}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(167, 139, 250, 0.2)' }}
                      className="p-2 rounded-md mb-1.5 transition-colors"
                      style={{ background: 'rgba(167, 139, 250, 0.04)', border: '1px solid rgba(167, 139, 250, 0.08)' }}
                    >
                      <div className="font-serif text-[11px] font-bold text-foreground leading-tight">{rec.title}</div>
                      <div className="text-[9px] font-light text-muted-foreground mt-1 leading-relaxed">{rec.description.slice(0, 80)}...</div>
                      <span className="steami-badge steami-badge-violet text-[7px] mt-1.5 inline-block">{rec.field}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SteamiLayout>
  );
}
