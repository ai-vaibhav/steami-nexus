import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SteamiLayout } from '@/components/SteamiLayout';
import { TextSelectionPopover } from '@/components/TextSelectionPopover';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import { CardSvgVisual } from '@/components/CardSvgVisual';
import { ShareMenu } from '@/components/ShareMenu';
import { ScrollNavigator } from '@/components/ScrollNavigator';
import { articles, FIELDS, FIELD_ICONS, FIELD_COLORS, type Article, type Field } from '@/data/research-articles';
import { useSteamiStore } from '@/stores/steami-store';
import { staggerContainer, cardVariants, cardHover, cardTap, overlayVariants, modalVariants, fadeInUp } from '@/lib/motion';
import { X, ChevronLeft, ChevronRight, Network, FileText, Sparkles, Search } from 'lucide-react';

export default function ResearchPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeField, setActiveField] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const diary = useSteamiStore((s) => s.diary);
  const recommendations = useSteamiStore((s) => s.recommendations);

  const activeFields = FIELDS.filter(f => articles.some(a => a.field === f));
  const allFields = ['ALL', ...activeFields];

  const filtered = articles.filter((a) => {
    const matchField = activeField === 'ALL' || a.field === activeField;
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.abstract.toLowerCase().includes(search.toLowerCase());
    return matchField && matchSearch;
  });

  const grouped = activeField === 'ALL'
    ? activeFields
        .map((f) => [f, filtered.filter((a) => a.field === f)] as [Field, Article[]])
        .filter(([, items]) => items.length > 0)
    : [[activeField as Field, filtered] as [Field, Article[]]];

  return (
    <SteamiLayout>
      <ScrollNavigator />

      <motion.div className="mb-6" variants={fadeInUp} initial="hidden" animate="visible">
        <h1 className="steami-heading text-3xl md:text-4xl mb-3">📚 Research Articles</h1>
        <p className="text-[13px] font-light text-muted-foreground max-w-xl leading-relaxed">
          Deep research environment across {activeFields.length} scientific fields. Browse by category and click articles for full study.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-8"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-[12px] font-light text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-steami-cyan/30 transition-shadow"
            style={{
              background: 'rgba(10, 18, 42, 0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          />
        </div>

        {/* Field pills */}
        <div className="flex flex-wrap gap-1.5">
          {allFields.map((f) => (
            <button
              key={f}
              onClick={() => setActiveField(f)}
              className={`px-3 py-1.5 rounded-md text-[9px] font-mono tracking-wider uppercase transition-all duration-200 ${
                activeField === f
                  ? 'text-steami-cyan'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                background:
                  activeField === f
                    ? 'rgba(99, 179, 237, 0.12)'
                    : 'rgba(255,255,255,0.03)',
                border: `1px solid ${
                  activeField === f
                    ? 'rgba(99, 179, 237, 0.25)'
                    : 'rgba(255,255,255,0.06)'
                }`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Category Sections */}
      {grouped.map(([field, items]) => (
        <CategorySection key={field} field={field} items={items} onSelect={setSelectedArticle} />
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground text-sm font-light">
          No articles found matching your criteria.
        </div>
      )}

      {/* Full Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            contentRef={contentRef}
            diary={diary}
            recommendations={recommendations}
            onClose={() => setSelectedArticle(null)}
            onSelectArticle={setSelectedArticle}
          />
        )}
      </AnimatePresence>
    </SteamiLayout>
  );
}

function CategorySection({ field, items, onSelect }: { field: Field; items: Article[]; onSelect: (a: Article) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="steami-section-label mb-3">
        {FIELD_ICONS[field]} {field} — {items.length} ARTICLES
      </div>
      <div className="relative group">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-steami-cyan transition-colors opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(3, 8, 20, 0.9)', border: '1px solid rgba(99,179,237,0.2)' }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide py-1 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
        >
          {items.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={cardHover}
              whileTap={cardTap}
              className="glass-card relative p-0 cursor-pointer overflow-hidden shrink-0 snap-start group/card"
              style={{ width: 320, minHeight: 240 }}
              onClick={() => onSelect(article)}
            >
              {/* Top accent bar */}
              <div
                className="h-[2px] w-full"
                style={{
                  background: `linear-gradient(90deg, hsl(var(--steami-${FIELD_COLORS[article.field]})) 0%, transparent 100%)`,
                }}
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`steami-badge steami-badge-${FIELD_COLORS[article.field]} text-[8px]`}>
                    {article.field}
                  </span>
                  <ShareMenu title={article.title} compact className="opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-serif text-[15px] font-bold mb-2 leading-snug text-foreground">{article.title}</h3>
                    <p className="text-[11px] font-light text-muted-foreground leading-relaxed line-clamp-3 mb-4">{article.abstract}</p>
                  </div>
                  <CardSvgVisual field={article.field} variant="mini" className="hidden sm:flex mt-0.5" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-foreground/5">
                  <span className="text-[9px] font-mono text-muted-foreground/60 tracking-wider">
                    {article.author} · {article.readTime}
                  </span>
                  <span className="text-[9px] font-mono text-steami-cyan tracking-wider uppercase opacity-0 group-hover/card:opacity-100 transition-opacity">
                    Read →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-steami-cyan transition-colors opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(3, 8, 20, 0.9)', border: '1px solid rgba(99,179,237,0.2)' }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function ArticleModal({
  article,
  contentRef,
  diary,
  recommendations,
  onClose,
  onSelectArticle,
}: {
  article: Article;
  contentRef: React.RefObject<HTMLDivElement>;
  diary: any[];
  recommendations: any[];
  onClose: () => void;
  onSelectArticle: (a: Article) => void;
}) {
  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[200] flex p-4"
      style={{ background: 'rgba(2, 8, 18, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-1 max-w-[1100px] mx-auto gap-4 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto rounded-xl"
          style={{
            background: 'rgba(5, 14, 32, 0.92)',
            backdropFilter: 'blur(24px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          }}
        >
          <TextSelectionPopover
            containerRef={contentRef as React.RefObject<HTMLDivElement>}
            source={article.title}
            sourceType="article"
            field={article.field}
          />

          {/* Header */}
          <div className="sticky top-0 z-10 px-7 py-4 flex items-center justify-between border-b border-foreground/5"
            style={{ background: 'rgba(5, 14, 32, 0.95)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`steami-badge steami-badge-${FIELD_COLORS[article.field]}`}>{article.field}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShareMenu title={article.title} compact />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-steami-red transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,25,55,0.4)' }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Article Body */}
          <div className="p-7">
            {/* Key Findings - top-right */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl p-5 mb-5 md:float-right md:ml-5 md:mb-4 md:w-64"
              style={{ background: 'rgba(6, 16, 38, 0.5)', border: '1px solid rgba(99, 179, 237, 0.14)' }}
            >
              <div className="font-mono text-[10px] tracking-wider uppercase text-steami-cyan mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> KEY FINDINGS
              </div>
              {article.keyFindings.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="flex items-start gap-2 py-1.5 border-b border-steami-cyan/5 last:border-0"
                >
                  <span className="text-steami-cyan text-xs mt-0.5">◆</span>
                  <span className="font-mono text-[11px] text-muted-foreground leading-relaxed">{f}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.h2
              className="steami-heading text-2xl mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {article.title}
            </motion.h2>
            <div className="flex items-center gap-3 mb-5 font-mono text-[10px] text-muted-foreground">
              <span>{article.author}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>

            {/* Abstract */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-light leading-relaxed text-muted-foreground mb-6 pl-5 border-l-2 border-steami-gold/50"
              style={{ fontStyle: 'italic', color: '#8aacca' }}
            >
              {article.abstract}
            </motion.div>

            {/* Content */}
            {article.content.map((para, i) => (
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
            {article.quotes.map((quote, i) => (
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
          </div>
        </div>

        {/* Right Sidebar */}
        <motion.div
          className="w-72 hidden lg:flex flex-col gap-3 overflow-y-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {/* Knowledge Graph */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(5, 14, 32, 0.88)', border: '1px solid rgba(99, 179, 237, 0.14)' }}>
            <div className="font-mono text-[10px] tracking-wider uppercase text-steami-cyan mb-3 flex items-center gap-2">
              <Network className="w-3 h-3" /> KNOWLEDGE MAP
            </div>
            <KnowledgeGraph
              centerTopic={article.title}
              relatedTopics={article.relatedTopics}
              field={article.field}
              compact
            />
            <div className="mt-3 pt-3 border-t border-steami-cyan/10">
              <div className="font-mono text-[9px] text-muted-foreground mb-2">RELATED ARTICLES</div>
              {articles.filter(a => a.id !== article.id && a.field === article.field).slice(0, 2).map(a => (
                <motion.button
                  key={a.id}
                  whileHover={{ x: 3, backgroundColor: 'rgba(99, 179, 237, 0.08)' }}
                  onClick={() => onSelectArticle(a)}
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

          {/* Recommendations */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(5, 14, 32, 0.88)', border: '1px solid rgba(167, 139, 250, 0.14)' }}>
            <div className="font-mono text-[10px] tracking-wider uppercase text-steami-violet mb-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> RECOMMENDATIONS
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
  );
}
