// Field-specific media: contextual images and video embeds for explainers & research articles

export interface FieldMedia {
  heroImage: string;
  inlineImages: string[];
  videoEmbed?: string; // YouTube embed URL
  videoTitle?: string;
}

// Curated Unsplash images and YouTube embeds per field
const FIELD_MEDIA: Record<string, FieldMedia> = {
  'QUANTUM PHYSICS': {
    heroImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=80&auto=format',
    ],
    videoEmbed: 'https://www.youtube.com/embed/UjaAxUNRCWg',
    videoTitle: 'Quantum Superposition Explained',
  },
  'PHYSICS': {
    heroImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80&auto=format',
    ],
    videoEmbed: 'https://www.youtube.com/embed/p7bzE1E5DUY',
    videoTitle: 'The Frontiers of Physics',
  },
  'BIOLOGY': {
    heroImage: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80&auto=format',
    ],
    videoEmbed: 'https://www.youtube.com/embed/UwsrzCVZAb8',
    videoTitle: 'CRISPR Gene Editing Explained',
  },
  'NEUROSCIENCE': {
    heroImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1453847668862-487637052f8a?w=600&q=80&auto=format',
    ],
    videoEmbed: 'https://www.youtube.com/embed/rA5qnZUXcqo',
    videoTitle: 'How Neural Networks Learn',
  },
  'AI': {
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&q=80&auto=format',
    ],
    videoEmbed: 'https://www.youtube.com/embed/aircAruvnKk',
    videoTitle: 'Neural Networks Visualized',
  },
  'COMPUTER SCIENCE': {
    heroImage: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80&auto=format',
    ],
    videoEmbed: 'https://www.youtube.com/embed/SzJ46YA_RaA',
    videoTitle: 'Algorithms in Action',
  },
  'CHEMISTRY': {
    heroImage: 'https://images.unsplash.com/photo-1532634993-15f421e42ec0?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=600&q=80&auto=format',
    ],
  },
  'MEDICINE': {
    heroImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&q=80&auto=format',
    ],
  },
  'EARTH & SPACE': {
    heroImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80&auto=format',
    ],
    videoEmbed: 'https://www.youtube.com/embed/libKVRa01L8',
    videoTitle: 'The Observable Universe',
  },
  'ROBOTICS': {
    heroImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80&auto=format',
    ],
  },
  'ENGINEERING': {
    heroImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80&auto=format',
    ],
  },
  'MATHEMATICS & DATA': {
    heroImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=600&q=80&auto=format',
    ],
  },
  'CLIMATE & ENERGY': {
    heroImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80&auto=format',
    ],
    videoEmbed: 'https://www.youtube.com/embed/EhAemz1v7dQ',
    videoTitle: 'Climate Science Explained',
  },
  'ASTROPHYSICS': {
    heroImage: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80&auto=format',
    ],
    videoEmbed: 'https://www.youtube.com/embed/GoW8Tf7hTGA',
    videoTitle: 'Dark Matter & Dark Energy',
  },
  'ENERGY': {
    heroImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80&auto=format',
    ],
  },
  'CRYPTOGRAPHY': {
    heroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80&auto=format',
    ],
  },
  'MATERIALS': {
    heroImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80&auto=format',
    inlineImages: [
      'https://images.unsplash.com/photo-1532634993-15f421e42ec0?w=600&q=80&auto=format',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=80&auto=format',
    ],
  },
};

// Fallback for unknown fields
const DEFAULT_MEDIA: FieldMedia = {
  heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format',
  inlineImages: [
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=80&auto=format',
  ],
};

export function getFieldMedia(field: string): FieldMedia {
  return FIELD_MEDIA[field] || DEFAULT_MEDIA;
}
