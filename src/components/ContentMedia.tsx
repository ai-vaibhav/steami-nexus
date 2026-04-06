import { motion } from 'framer-motion';
import { getFieldMedia } from '@/data/content-media';
import { Image, Play } from 'lucide-react';

interface ContentMediaProps {
  field: string;
  variant: 'hero' | 'inline' | 'video';
  index?: number; // for picking different inline images
  className?: string;
}

export function ContentMedia({ field, variant, index = 0, className = '' }: ContentMediaProps) {
  const media = getFieldMedia(field);

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`relative w-full rounded-xl overflow-hidden mb-6 ${className}`}
        style={{
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className="relative aspect-[21/9] overflow-hidden">
          <img
            src={media.heroImage}
            alt={`${field} visual`}
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7) saturate(1.2)' }}
          />
          {/* Gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(5,14,32,0.3) 0%, rgba(5,14,32,0.7) 100%)',
            }}
          />
          {/* Field label */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <Image className="w-3 h-3 text-muted-foreground/60" />
            <span className="font-mono text-[9px] tracking-wider uppercase text-muted-foreground/60">
              {field} — Visual Context
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    const imgSrc = media.inlineImages[index % media.inlineImages.length];
    return (
      <motion.figure
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className={`my-6 rounded-xl overflow-hidden ${className}`}
        style={{
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={imgSrc}
            alt={`${field} illustration`}
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.75) saturate(1.15)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 50%, rgba(5,14,32,0.6) 100%)',
            }}
          />
        </div>
        <figcaption
          className="px-4 py-2.5 font-mono text-[9px] tracking-wider text-muted-foreground/50"
          style={{ background: 'rgba(5, 14, 32, 0.8)' }}
        >
          Fig. {index + 1} — {field} conceptual visualization
        </figcaption>
      </motion.figure>
    );
  }

  if (variant === 'video' && media.videoEmbed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className={`my-6 rounded-xl overflow-hidden ${className}`}
        style={{
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
          <iframe
            src={media.videoEmbed}
            title={media.videoTitle || `${field} explainer video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
          />
        </div>
        <div
          className="px-4 py-2.5 flex items-center gap-2"
          style={{ background: 'rgba(5, 14, 32, 0.8)' }}
        >
          <Play className="w-3 h-3 text-steami-cyan/60" />
          <span className="font-mono text-[9px] tracking-wider text-muted-foreground/50 uppercase">
            {media.videoTitle || 'Related Video'}
          </span>
        </div>
      </motion.div>
    );
  }

  return null;
}
