import type { Product } from '../types';

export const products: Product[] = [
  // Meditations (now part of the store/library system)
  {
    id: 101,
    name: "Breath Awareness",
    type: "meditation",
    price: 0,
    description: "A 5-minute guided meditation to anchor yourself in the present moment by focusing on your breath.",
    assetUrl: "https://storage.googleapis.com/gemini-codelab-prod.appspot.com/OOTB_Sample_App/music_2.mp3",
    imageUrl: "https://images.pexels.com/photos/3998953/pexels-photo-3998953.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 0,
    reviews: [
      { id: 1, user: "Alex", rating: 5, comment: "Perfect for a quick reset during the day. Very calming voice." },
      { id: 2, user: "Sam", rating: 4, comment: "Good, solid breathing exercise." }
    ],
  },
  {
    id: 102,
    name: "Body Scan Relaxation",
    type: "meditation",
    price: 0,
    description: "A 10-minute body scan to release tension and cultivate a deep sense of physical relaxation.",
    assetUrl: "https://storage.googleapis.com/gemini-codelab-prod.appspot.com/OOTB_Sample_App/music_2.mp3",
    imageUrl: "https://images.pexels.com/photos/4113840/pexels-photo-4113840.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 10,
    reviews: [
       { id: 3, user: "Casey", rating: 5, comment: "I fell asleep, it was so relaxing! In a good way." }
    ],
  },
  {
    id: 103,
    name: "Loving-Kindness Focus",
    type: "meditation",
    price: 0,
    description: "A 12-minute meditation to cultivate feelings of warmth, kindness, and compassion for yourself and others.",
    assetUrl: "https://storage.googleapis.com/gemini-codelab-prod.appspot.com/OOTB_Sample_App/music_3.mp3",
    imageUrl: "https://images.pexels.com/photos/7752656/pexels-photo-7752656.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 20,
    reviews: [
       { id: 4, user: "Jordan", rating: 5, comment: "This really helped shift my perspective. Beautifully guided." }
    ],
  },
  
  // Videos
  {
    id: 1,
    name: "Vinyasa Flow Masterclass",
    type: "video",
    price: 25,
    description: "A 60-minute guided vinyasa flow class focusing on breath and movement synchronization.",
    assetUrl: "https://storage.googleapis.com/gemini-codelab-prod.appspot.com/OOTB_Sample_App/video_1.mp4",
    imageUrl: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 25,
    reviews: [
       { id: 5, user: "Taylor", rating: 5, comment: "An amazing flow. Challenging but rewarding. The instructor is fantastic." },
       { id: 6, user: "Morgan", rating: 4, comment: "Good class, but a little fast for me at times." }
    ],
  },
  {
    id: 4,
    name: "Advanced Arm Balances",
    type: "video",
    price: 30,
    description: "A workshop-style video breaking down crow, side crow, and firefly poses.",
    assetUrl: "https://storage.googleapis.com/gemini-codelab-prod.appspot.com/OOTB_Sample_App/video_2.mp4",
    imageUrl: "https://images.pexels.com/photos/8687574/pexels-photo-8687574.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 60,
    reviews: [
       { id: 7, user: "Riley", rating: 5, comment: "Finally nailed my crow pose because of this video! The instructions are so clear." }
    ],
  },

  // Other Meditations
  {
    id: 2,
    name: "Deep Relaxation Yoga Nidra",
    type: "meditation",
    price: 15,
    description: "A 30-minute guided Yoga Nidra session for deep relaxation and stress relief.",
    assetUrl: "https://storage.googleapis.com/gemini-codelab-prod.appspot.com/OOTB_Sample_App/music_1.mp3",
    imageUrl: "https://images.pexels.com/photos/3822623/pexels-photo-3822623.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 30,
    reviews: [],
  },
  {
    id: 5,
    name: "Chakra Healing Meditation",
    type: "meditation",
    price: 15,
    description: "A guided meditation to cleanse and balance the seven main chakras.",
    assetUrl: "https://storage.googleapis.com/gemini-codelab-prod.appspot.com/OOTB_Sample_App/music_2.mp3",
    imageUrl: "https://images.pexels.com/photos/1539249/pexels-photo-1539249.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 40,
    reviews: [
        { id: 8, user: "Alex", rating: 5, comment: "Felt so much lighter after this. Very powerful." }
    ],
  },

  // Ebooks
  {
    id: 3,
    name: "The Yoga Sutras: A Modern Guide",
    type: "ebook",
    price: 20,
    description: "An e-book translating and explaining Patanjali's Yoga Sutras for the modern practitioner.",
    assetUrl: "https://cdn.jsdelivr.net/gh/yogabooks/yoga-sutras@master/yoga-sutras-of-patanjali-v1.36.pdf",
    imageUrl: "https://images.pexels.com/photos/2253631/pexels-photo-2253631.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 50,
    reviews: [
        { id: 9, user: "Jesse", rating: 5, comment: "A must-read for any serious yoga student. Makes complex topics accessible." }
    ],
  },

  // Health
  {
    id: 6,
    name: "Guide to Ayurvedic Eating",
    type: "health",
    price: 18,
    description: "A video guide on how to eat according to your Dosha for better digestion and overall health.",
    assetUrl: "https://storage.googleapis.com/gemini-codelab-prod.appspot.com/OOTB_Sample_App/video_3.mp4",
    imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 75,
    reviews: [],
  },

  // Podcasts
  {
    id: 7,
    name: "Mindful Living Podcast Ep. 1",
    type: "podcast",
    price: 5,
    description: "Episode 1: Integrating mindfulness into your daily routine, with special guest Maya Vance.",
    assetUrl: "https://storage.googleapis.com/gemini-codelab-prod.appspot.com/OOTB_Sample_App/music_3.mp3",
    imageUrl: "https://images.pexels.com/photos/7130498/pexels-photo-7130498.jpeg?auto=compress&cs=tinysrgb&w=600",
    unlockLevel: 15,
    reviews: [],
  },
];