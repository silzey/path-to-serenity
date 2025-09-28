import type { Product } from '../types';

export const products: Product[] = [
  // Meditations (now part of the store/library system)
  {
    id: 101,
    name: "Breath Awareness",
    type: "meditation",
    price: 0,
    description: "A 5-minute guided meditation to anchor yourself in the present moment by focusing on your breath.",
    assetUrl: "https://cdn.pixabay.com/audio/2022/03/22/audio_5111126644.mp3",
    imageUrl: "https://images.pexels.com/photos/3998953/pexels-photo-3998953.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 0,
  },
  {
    id: 102,
    name: "Body Scan Relaxation",
    type: "meditation",
    price: 0,
    description: "A 10-minute body scan to release tension and cultivate a deep sense of physical relaxation.",
    assetUrl: "https://cdn.pixabay.com/audio/2022/10/06/audio_59289e631c.mp3",
    imageUrl: "https://images.pexels.com/photos/4113840/pexels-photo-4113840.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 10,
  },
  {
    id: 103,
    name: "Loving-Kindness Focus",
    type: "meditation",
    price: 0,
    description: "A 12-minute meditation to cultivate feelings of warmth, kindness, and compassion for yourself and others.",
    assetUrl: "https://cdn.pixabay.com/audio/2024/05/20/audio_2d795852f8.mp3",
    imageUrl: "https://images.pexels.com/photos/7752656/pexels-photo-7752656.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 20,
  },
  
  // Videos
  {
    id: 1,
    name: "Vinyasa Flow Masterclass",
    type: "video",
    price: 25,
    description: "A 60-minute guided vinyasa flow class focusing on breath and movement synchronization.",
    assetUrl: "https://videos.pexels.com/video-files/4784346/4784346-hd_1280_720_25fps.mp4",
    imageUrl: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 25,
  },
  {
    id: 4,
    name: "Advanced Arm Balances",
    type: "video",
    price: 30,
    description: "A workshop-style video breaking down crow, side crow, and firefly poses.",
    assetUrl: "https://videos.pexels.com/video-files/853879/853879-hd_1280_720_25fps.mp4",
    imageUrl: "https://images.pexels.com/photos/8687574/pexels-photo-8687574.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 60,
  },

  // Other Meditations
  {
    id: 2,
    name: "Deep Relaxation Yoga Nidra",
    type: "meditation",
    price: 15,
    description: "A 30-minute guided Yoga Nidra session for deep relaxation and stress relief.",
    assetUrl: "https://cdn.pixabay.com/audio/2023/11/22/audio_a12b67f495.mp3",
    imageUrl: "https://images.pexels.com/photos/3822623/pexels-photo-3822623.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 30,
  },
  {
    id: 5,
    name: "Chakra Healing Meditation",
    type: "meditation",
    price: 15,
    description: "A guided meditation to cleanse and balance the seven main chakras.",
    assetUrl: "https://cdn.pixabay.com/audio/2023/04/06/audio_f553258547.mp3",
    imageUrl: "https://images.pexels.com/photos/1539249/pexels-photo-1539249.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 40,
  },

  // Ebooks
  {
    id: 3,
    name: "The Yoga Sutras: A Modern Guide",
    type: "ebook",
    price: 20,
    description: "An e-book translation and commentary on Patanjali's Yoga Sutras for the modern practitioner.",
    assetUrl: "https://www.gutenberg.org/ebooks/2560.pdf.images",
    imageUrl: "https://images.pexels.com/photos/4151475/pexels-photo-4151475.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 50,
  },
  {
    id: 6,
    name: "Mindful Eating Guide",
    type: "ebook",
    price: 12,
    description: "Learn the principles of mindful eating to cultivate a healthier relationship with food.",
    assetUrl: "https://www.holybooks.com/wp-content/uploads/The-Yoga-Sutras-of-Patanjali-by-Swami-Vivekananda.pdf",
    imageUrl: "https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 15,
  },
  
  // Health & Podcasts
  {
    id: 7,
    name: "The Wellness Mindset",
    type: "podcast",
    price: 10,
    description: "Episode 1: Building a foundation of wellness with small, sustainable habits.",
    assetUrl: "https://cdn.pixabay.com/audio/2023/09/06/audio_35a1ac5123.mp3",
    imageUrl: "https://images.pexels.com/photos/716276/pexels-photo-716276.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 5,
  },
  {
    id: 8,
    name: "7-Day Healthy Meal Plan",
    type: "health",
    price: 18,
    description: "A video guide and PDF plan for a week of nutritious and delicious meals.",
    assetUrl: "https://videos.pexels.com/video-files/5969512/5969512-hd_1280_720_25fps.mp4",
    imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 35,
  },
];