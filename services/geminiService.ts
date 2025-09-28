import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const YOGA_MODULES = [
  "Module 1: The First Breath (Pranayama Basics)",
  "Module 2: Finding Your Center (Basic Meditation)",
  "Module 3: Mountain Pose (Tadasana)",
  "Module 4: The Forward Fold (Uttanasana)",
  "Module 5: Downward-Facing Dog (Adho Mukha Svanasana)",
  "Module 6: Warrior I (Virabhadrasana I)",
  "Module 7: Warrior II (Virabhadrasana II)",
  "Module 8: Triangle Pose (Trikonasana)",
  "Module 9: The Yamas: Ahimsa (Non-violence)",
  "Module 10: The Yamas: Satya (Truthfulness)",
  "Module 11: Sun Salutation A (Surya Namaskar A)",
  "Module 12: Cobra Pose (Bhujangasana)",
  "Module 13: Child's Pose (Balasana)",
  "Module 14: Cat-Cow Stretch (Marjaryasana-Bitilasana)",
  "Module 15: The Niyamas: Saucha (Cleanliness)",
  "Module 16: The Niyamas: Santosha (Contentment)",
  "Module 17: Tree Pose (Vrksasana)",
  "Module 18: Seated Forward Bend (Paschimottanasana)",
  "Module 19: Bridge Pose (Setu Bandhasana)",
  "Module 20: Corpse Pose (Savasana) & Integration",
  "Module 21: Sun Salutation B (Surya Namaskar B)",
  "Module 22: Chair Pose (Utkatasana)",
  "Module 23: The Three-Part Breath (Dirga Pranayama)",
  "Module 24: Anatomy of the Spine",
  "Module 25: Extended Side Angle Pose (Utthita Parsvakonasana)",
  "Module 26: The Yamas: Asteya (Non-stealing)",
  "Module 27: The Niyamas: Tapas (Discipline)",
  "Module 28: Dolphin Pose (Ardha Pincha Mayurasana)",
  "Module 29: Introduction to Bandhas (Mula & Uddiyana)",
  "Module 30: Crow Pose (Bakasana) - First Arm Balance",
  "Module 31: The Koshas (The Five Sheaths)",
  "Module 32: Eagle Pose (Garudasana)",
  "Module 33: Half Moon Pose (Ardha Chandrasana)",
  "Module 34: The Yamas: Brahmacharya (Moderation)",
  "Module 35: The Niyamas: Svadhyaya (Self-study)",
  "Module 36: Ujjayi Breath (Victorious Breath)",
  "Module 37: Anatomy of the Hips",
  "Module 38: Pigeon Pose (Eka Pada Rajakapotasana)",
  "Module 39: Camel Pose (Ustrasana)",
  "Module 40: The Chakras: Root (Muladhara)",
  "Module 41: The Chakras: Sacral (Svadhisthana)",
  "Module 42: The Chakras: Solar Plexus (Manipura)",
  "Module 43: Introduction to Vinyasa Flow",
  "Module 44: The Yamas: Aparigraha (Non-possessiveness)",
  "Module 45: The Niyamas: Ishvara Pranidhana (Surrender)",
  "Module 46: Shoulder Stand (Salamba Sarvangasana)",
  "Module 47: Plow Pose (Halasana)",
  "Module 48: Fish Pose (Matsyasana)",
  "Module 49: The Gunas (Sattva, Rajas, Tamas)",
  "Module 50: Guided Loving-Kindness Meditation",
  "Module 51: Headstand (Sirsasana) - Preparation",
  "Module 52: Headstand (Sirsasana) - Practice",
  "Module 53: The Art of Sequencing a Class",
  "Module 54: The Chakras: Heart (Anahata)",
  "Module 55: The Chakras: Throat (Vishuddha)",
  "Module 56: Wild Thing (Camatkarasana)",
  "Module 57: Handstand (Adho Mukha Vrksasana) - Preparation",
  "Module 58: Kapalabhati Pranayama (Breath of Fire)",
  "Module 59: Nadi Shodhana (Alternate Nostril Breathing)",
  "Module 60: The Yoga Sutras of Patanjali - Book 1",
  "Module 61: Side Crow (Parsva Bakasana)",
  "Module 62: Eight-Angle Pose (Astavakrasana)",
  "Module 63: The Chakras: Third Eye (Ajna)",
  "Module 64: The Chakras: Crown (Sahasrara)",
  "Module 65: Anatomy of the Shoulders & Wrists",
  "Module 66: Forearm Stand (Pincha Mayurasana)",
  "Module 67: Wheel Pose (Urdhva Dhanurasana)",
  "Module 68: The Yoga Sutras of Patanjali - Book 2",
  "Module 69: The Bhagavad Gita - Introduction",
  "Module 70: Karma Yoga (The Yoga of Action)",
  "Module 71: Bhakti Yoga (The Yoga of Devotion)",
  "Module 72: King Pigeon Pose (Eka Pada Rajakapotasana II)",
  "Module 73: Lotus Pose (Padmasana)",
  "Module 74: Kriya Yoga",
  "Module 75: Firefly Pose (Tittibhasana)",
  "Module 76: Jnana Yoga (The Yoga of Knowledge)",
  "Module 77: The Upanishads - Core Concepts",
  "Module 78: Introduction to Ayurveda",
  "Module 79: Doshas: Vata, Pitta, Kapha",
  "Module 80: Yoga for Your Dosha",
  "Module 81: Advanced Sequencing: Peak Pose",
  "Module 82: The Art of Hands-On Adjustments",
  "Module 83: Teaching Pranayama",
  "Module 84: Guiding Meditation",
  "Module 85: The Business of Yoga",
  "Module 86: Prenatal Yoga Modifications",
  "Module 87: Restorative Yoga Principles",
  "Module 88: Yoga Nidra",
  "Module 89: Advanced Arm Balances",
  "Module 90: Deeper Backbends",
  "Module 91: The Ethics of a Yoga Teacher",
  "Module 92: Trauma-Informed Yoga",
  "Module 93: Samadhi: The Goal of Yoga",
  "Module 94: Chanting and Mantras",
  "Module 95: Understanding Mudras",
  "Module 96: Creating Themed Workshops",
  "Module 97: Teaching to All Levels",
  "Module 98: Anatomy Review & Injury Prevention",
  "Module 99: Finding Your Voice as a Teacher",
  "Module 100: Graduation: The Lifelong Practice"
];


const storyResponseSchema = {
  type: Type.OBJECT,
  properties: {
    outcome: {
      type: Type.STRING,
      description: "A concise, past-tense description of the outcome of the player's action, focusing on their internal state or external progress.",
    },
    story: {
      type: Type.STRING,
      description: "The next part of the journey. A detailed, present-tense description of the new setting, feelings, or wellness concepts. This should be 2-3 paragraphs long and have a calming, mindful tone, relating to the current module.",
    },
    inventoryChange: {
      type: Type.OBJECT,
      properties: {
        addItem: {
          type: Type.STRING,
          description: "An item, concept, or skill the player just acquired (e.g., 'yoga mat', 'new mantra', 'breathing technique'). If nothing is added, this should be an empty string.",
        },
        removeItem: {
          type: Type.STRING,
          description: "An item the player just used or let go of. If nothing is removed, this should be an empty string.",
        },
      },
      required: ["addItem", "removeItem"],
    },
    relationshipChange: {
      type: Type.OBJECT,
      properties: {
          characterName: {
              type: Type.STRING,
              description: "The name of a non-player character whose relationship with the player has changed. If no relationship changes, this should be an empty string."
          },
          affinityChange: {
              type: Type.NUMBER,
              description: "The amount to change the affinity score by (e.g., 10 for positive, -5 for negative). If no relationship changes, this should be 0."
          },
          characterBio: {
            type: Type.STRING,
            description: "A short, one-sentence bio for a character if they are being introduced for the first time. Otherwise, an empty string."
          }
      },
      required: ["characterName", "affinityChange", "characterBio"]
    },
    badgeEarned: {
      type: Type.STRING,
      description: "The name of a badge earned for a special achievement (e.g., 'Ahimsa Advocate', 'Module 10 Complete'). If none is earned, this is an empty string."
    },
    isModuleComplete: {
      type: Type.BOOLEAN,
      description: "Set to true if the player has successfully understood and completed the current yoga module's lesson through their action. Otherwise, false."
    },
    isGameOver: {
      type: Type.BOOLEAN,
      description: "Set to true if the player has completed the final module, found their calling (like becoming a teacher), or decided to abandon the path. Otherwise, false.",
    },
  },
  required: ["outcome", "story", "inventoryChange", "relationshipChange", "badgeEarned", "isModuleComplete", "isGameOver"],
};

const getSystemInstruction = (inventory: string[], relationships: { [key: string]: { affinity: number } }, currentModuleIndex: number) => {
  const relationshipStatus = Object.entries(relationships)
    .map(([name, data]) => `${name}: ${data.affinity}`)
    .join(", ");

  const currentModule = YOGA_MODULES[currentModuleIndex];

  return `You are a serene narrator for an interactive story about a person on a yoga teacher training journey. The journey is structured into 100 modules.
  - The player is currently on: '${currentModule}'. The story must revolve around the theme of this module.
  - When you introduce a new character, provide a one-sentence bio for them in 'characterBio'.
  - When the player takes an action that demonstrates understanding or completion of the current module's theme, set 'isModuleComplete' to true so they can advance.
  - Award a badge for significant milestones. Examples: 'First Sun Salutation' for module 11, 'Chakra Awakened' for module 40, 'Halfway Point' for module 50, 'Aspiring Guru' for module 75, 'Yoga Sutra Scholar' for module 60. Be creative.
  - The setting is a modern world with access to yoga studios, health food stores, meditation centers, and nature.
  - Describe scenes with a focus on sensory details and internal feelings.
  - The player's current wellness tools are: [${inventory.join(", ") || 'nothing'}]. Use these to determine logical outcomes.
  - Current relationships are: [${relationshipStatus || 'none'}]. Affinity scores range from -100 (hostile) to 100 (deeply connected).
  - The journey should include opportunities to learn about yoga poses, meditation, healthy eating, and mindfulness.
  - Always respond in the requested JSON format. Do not add any extra text or markdown.`;
};


export interface StoryStep {
    outcome: string;
    story: string;
    inventoryChange: {
        addItem: string;
        removeItem: string;
    };
    relationshipChange: {
        characterName: string;
        affinityChange: number;
        characterBio: string;
    };
    badgeEarned: string;
    isModuleComplete: boolean;
    isGameOver: boolean;
}

const parseGeminiResponse = (response: GenerateContentResponse): StoryStep | null => {
    try {
        const text = response.text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(text) as StoryStep;
        return parsed;
    } catch (error) {
        console.error("Failed to parse Gemini response:", error);
        return null;
    }
}


export const generateInitialStory = async (): Promise<StoryStep | null> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Start a new interactive story for me. The main character is beginning their yoga teacher training journey. Their first lesson is '${YOGA_MODULES[0]}'. They are feeling stressed and disconnected from their modern, fast-paced life. Seeking a change, they have just stepped into a quiet, sun-drenched yoga studio for the first time. Describe the peaceful atmosphere, the scent of incense, and their feeling of nervous hope.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: storyResponseSchema,
      systemInstruction: getSystemInstruction([], {}, 0),
    },
  });
  return parseGeminiResponse(response);
};

export const generateNextStep = async (history: string[], action: string, inventory: string[], relationships: { [key: string]: { affinity: number } }, currentModuleIndex: number): Promise<StoryStep | null> => {
  const fullHistory = history.join("\n\n");
  const prompt = `Here is the story so far:\n${fullHistory}\n\nThe player's action is: "${action}"\n\nWhat happens next?`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: storyResponseSchema,
      systemInstruction: getSystemInstruction(inventory, relationships, currentModuleIndex),
    },
  });
  
  return parseGeminiResponse(response);
};

export const generateImageForStory = async (story: string): Promise<string> => {
  const imagePrompt = `A serene, calming, and beautiful digital art painting of the following scene: ${story}. Soft, warm lighting, gentle colors, painterly style, focused on tranquility and mindfulness.`;
  
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: imagePrompt,
    config: {
      numberOfImages: 1,
      aspectRatio: '3:4',
      outputMimeType: 'image/jpeg'
    },
  });

  const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
  return `data:image/jpeg;base64,${base64ImageBytes}`;
};
