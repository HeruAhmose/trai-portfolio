/**
 * Media components.
 *
 * MediaFrame is the only way an image reaches the page, which guarantees the
 * provenance chip is always rendered — there is no code path that shows an
 * asset without saying what kind of thing it is.
 *
 * Everything is lazy: images use native loading="lazy" + async decoding,
 * videos hold at their poster until they scroll into view, and the observer
 * disconnects once a video has started so it costs nothing afterwards.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MediaItem,
  VideoItem,
  PROVENANCE_LABEL,
  Provenance,
  ARCHIVE,
  TAMERIAN,
  TECHNOLOGIES,
} from '@/lib/media';
import sovereignAudio from '@/lib/sovereignAudio';

const CHIP: Record<Provenance, string> = {
  photograph: 'text-[#d8aa43] border-[#d8aa43]/35',
  rendering: 'text-[#8fb4d9] border-[#8fb4d9]/35',
  concept: 'text-[#c98f6a] border-[#c98f6a]/35',
};

/* ------------------------------------------------------------ MediaFrame */
export const MediaFrame: React.FC<{
  item: MediaItem;
  className?: string;
  showCaption?: boolean;
  eager?: boolean;
}> = ({ item, className = '', showCaption = true, eager = false }) => (
  <figure className={`relative overflow-hidden bg-[#070b0f] group ${className}`}>
    <img
      src={item.src}
      alt={item.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#050709] via-transparent to-transparent opacity-70 pointer-events-none" />
    <span
      className={`absolute top-3 right-3 px-2 py-1 text-[0.64rem] font-sans tracking-[0.14em] uppercase border bg-[#050709]/75 backdrop-blur-sm ${CHIP[item.provenance]}`}
    >
      {PROVENANCE_LABEL[item.provenance]}
    </span>
    {showCaption && (
      <figcaption className="absolute left-0 right-0 bottom-0 p-4 pointer-events-none">
        <span className="block text-sm text-[#f4f0e6] font-sans leading-snug">{item.caption}</span>
        {item.year && (
          <span className="block text-[0.6rem] font-mono tracking-widest text-[#f4f0e6]/45 mt-1">
            {item.year}
          </span>
        )}
      </figcaption>
    )}
  </figure>
);

/* ------------------------------------------------------------ VideoPanel */
export const VideoPanel: React.FC<{
  video: VideoItem;
  className?: string;
  showCaption?: boolean;
}> = ({ video, className = '', showCaption = true }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.play().then(() => setLive(true)).catch(() => {});
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`relative overflow-hidden bg-[#070b0f] ${className}`}>
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050709] via-transparent to-transparent opacity-65 pointer-events-none" />
      <span
        className={`absolute top-3 right-3 px-2 py-1 text-[0.64rem] font-sans tracking-[0.14em] uppercase border bg-[#050709]/75 backdrop-blur-sm ${CHIP[video.provenance]}`}
      >
        {PROVENANCE_LABEL[video.provenance]}
      </span>
      {showCaption && (
        <figcaption className="absolute left-0 right-0 bottom-0 p-4 flex items-center gap-2 pointer-events-none">
          <span className="text-sm text-[#f4f0e6] font-sans">{video.caption}</span>
          {live && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#d8aa43] animate-pulse" aria-hidden="true" />
          )}
        </figcaption>
      )}
    </figure>
  );
};

/* ----------------------------------------------------------- ArchiveRail
   The origin story as a horizontal rail. A father's №44, a son's №6, the
   track, the academy, and a community ranking two decades later. */
export const ArchiveRail: React.FC = () => (
  <div className="relative">
    <div
      className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory -mx-6 px-6 lg:-mx-12 lg:px-12"
      style={{ scrollbarWidth: 'thin' }}
      role="list"
      aria-label="Founder archive"
    >
      {ARCHIVE.map((item, i) => (
        <motion.div
          key={item.src}
          role="listitem"
          className={`snap-start shrink-0 ${item.portrait ? 'w-[240px] h-[380px]' : 'w-[340px] h-[380px]'}`}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: Math.min(i * 0.04, 0.3) }}
          onMouseEnter={() => sovereignAudio.hover(i)}
        >
          <MediaFrame item={item} className="w-full h-full border border-[#d8aa43]/10" />
        </motion.div>
      ))}
    </div>
    <p className="text-[0.62rem] font-sans tracking-[0.16em] uppercase text-[#f4f0e6]/25 mt-1">
      Scroll →
    </p>
  </div>
);

/* -------------------------------------------------------- BiomimicryGrid */
export const BiomimicryGrid: React.FC = () => {
  const picks = [TAMERIAN[1], TAMERIAN[2], TAMERIAN[4]];
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {picks.map((item, i) => (
        <motion.div
          key={item.src}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          onMouseEnter={() => sovereignAudio.hover(i)}
        >
          <MediaFrame item={item} className="aspect-[3/4] border border-[#d8aa43]/10" />
        </motion.div>
      ))}
    </div>
  );
};

/* -------------------------------------------------------- TechnologyGrid
   Section 7 of the TRAI business plan. Every card states its stage, so the
   Helm and the Circuit read as research and Queen Califia reads as shipped. */
export const TechnologyGrid: React.FC = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {TECHNOLOGIES.map((t, i) => (
      <motion.article
        key={t.name}
        className="relative border border-[#d8aa43]/10 overflow-hidden group hover:border-[#d8aa43]/35 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.05 }}
        onMouseEnter={() => sovereignAudio.hover(i)}
      >
        {t.media && (
          <div className="aspect-[16/10] overflow-hidden">
            <MediaFrame item={t.media} className="w-full h-full" showCaption={false} />
          </div>
        )}
        <div className="p-5">
          <span className="text-[0.6rem] font-sans tracking-[0.18em] uppercase text-[#d8aa43]/60 block mb-2">
            {t.role}
          </span>
          <h3
            className="font-bold text-[#f4f0e6] text-lg mb-2"
            style={{ WebkitTextFillColor: '#f4f0e6' }}
          >
            {t.name}
          </h3>
          <p className="text-sm text-[#f4f0e6]/50 font-sans leading-relaxed mb-4">{t.body}</p>
          <span className="text-[0.62rem] font-mono tracking-wide text-[#d8aa43]/70">{t.stage}</span>
        </div>
      </motion.article>
    ))}
  </div>
);

export default MediaFrame;
