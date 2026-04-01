import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSteamiStore } from '@/stores/steami-store';
import { BookMarked, Sparkles } from 'lucide-react';

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
  source: string;
  sourceType: 'explainer' | 'article';
  field?: string;
}

export function TextSelectionPopover({ containerRef, source, sourceType, field }: Props) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const addToDiary = useSteamiStore((s) => s.addToDiary);

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setShow(false);
      return;
    }
    const text = sel.toString().trim();
    if (text.length < 5) {
      setShow(false);
      return;
    }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top - 12 });
    setSelectedText(text);
    setShow(true);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mouseup', handleMouseUp);
    return () => el.removeEventListener('mouseup', handleMouseUp);
  }, [containerRef, handleMouseUp]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 6 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="fixed z-[999] flex gap-1.5 p-1.5 rounded-xl"
          style={{
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(8, 20, 48, 0.88)',
            backdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(99, 179, 237, 0.25)',
            boxShadow:
              '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 24px rgba(99, 179, 237, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              addToDiary({ text: selectedText, source, sourceType, field });
              setShow(false);
              window.getSelection()?.removeAllRanges();
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[9px] tracking-wider uppercase transition-colors"
            style={{
              color: 'hsl(42 75% 60%)',
              background: 'rgba(232, 184, 75, 0.08)',
              border: '1px solid rgba(232, 184, 75, 0.2)',
            }}
          >
            <BookMarked className="w-3 h-3" />
            Diary
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              setShow(false);
              window.getSelection()?.removeAllRanges();
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[9px] tracking-wider uppercase transition-colors"
            style={{
              color: 'hsl(207 72% 65%)',
              background: 'rgba(99, 179, 237, 0.08)',
              border: '1px solid rgba(99, 179, 237, 0.2)',
            }}
          >
            <Sparkles className="w-3 h-3" />
            AI
          </motion.button>

          {/* Caret arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: -5,
              width: 10,
              height: 10,
              background: 'rgba(8, 20, 48, 0.88)',
              borderRight: '1px solid rgba(99, 179, 237, 0.25)',
              borderBottom: '1px solid rgba(99, 179, 237, 0.25)',
              transform: 'translateX(-50%) rotate(45deg)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
