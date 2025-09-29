"use client";

import React, { useState, useEffect, useCallback } from 'react';
import GameScreen from './components/GameScreen';
import SidePanel from './components/SidePanel';
import SplashPage from './components/SplashPage';
import Dashboard from './components/Dashboard';
import TransparentHeader from './components/TransparentHeader';
import ModuleMenu from './components/ModuleMenu';
import Store from './components/Store';
import ShoppingCart from './components/ShoppingCart';
import Library from './components/Library';
import MediaPlayer from './components/MediaPlayer';
import ProfilePage from './components/ProfilePage';
import EditProfileModal from './components/EditProfileModal';
import ReviewModal from './components/ReviewModal';
import ViewReviewsModal from './components/ViewReviewsModal';
import { generateInitialStory, generateNextStep, generateImageForStory, YOGA_MODULES } from './services/geminiService';
import type { StoryStep } from './services/geminiService';
import type { GameState, Product, Review } from './types';
import { products as productsData } from './data/products';

export type View = 'splash' | 'journey' | 'dashboard' | 'store' | 'cart' | 'library' | 'profile';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return {
        story: '',
        image: '',
        inventory: [],
        relationships: {},
        log: [],
        isGameOver: false,
        history: [],
        currentModuleIndex: 0,
        badges: [],
        cart: [],
        library: [],
        profile: {
            name: 'Wellness Warrior',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
            gallery: [
                'https://images.pexels.com/photos/1882092/pexels-photo-1882092.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/936615/pexels-photo-936615.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=600',
            ],
        },
        theme: savedTheme || 'light',
        products: productsData,
    }
  });
  const [isStoryLoading, setIsStoryLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('splash');
  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);
  const [mediaToPlay, setMediaToPlay] = useState<Product | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);
  const [viewReviewsProduct, setViewReviewsProduct] = useState<Product | null>(null);


  useEffect(() => {
    localStorage.setItem('theme', gameState.theme);
    if (gameState.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-gray-950', 'dark:text-gray-300');
      document.body.classList.remove('bg-slate-100', 'text-gray-800');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-slate-100', 'text-gray-800');
      document.body.classList.remove('dark:bg-gray-950', 'dark:text-gray-300');
    }
  }, [gameState.theme]);

  const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleAvatarChange = async (file: File) => {
    const dataUri = await fileToDataUri(file);
    setGameState(prev => ({ ...prev, profile: { ...prev.profile, avatar: dataUri } }));
  };

  const handleAddToGallery = async (file: File) => {
    const dataUri = await fileToDataUri(file);
    setGameState(prev => ({ ...prev, profile: { ...prev.profile, gallery: [...prev.profile.gallery, dataUri] } }));
  };
  
  const handleProfileSave = (newName: string) => {
    setGameState(prev => ({...prev, profile: {...prev.profile, name: newName}}));
    setIsEditProfileOpen(false);
  };

  const handleReviewSubmit = (productId: number, rating: number, comment: string) => {
      const newReview: Review = {
          id: Date.now(),
          user: gameState.profile.name,
          rating,
          comment,
      };

      setGameState(prev => {
          const updatedProducts = prev.products.map(p => {
              if (p.id === productId) {
                  return { ...p, reviews: [...p.reviews, newReview] };
              }
              return p;
          });

          const updatedLibrary = prev.library.map(p => {
              if (p.id === productId) {
                  return { ...p, reviews: [...p.reviews, newReview] };
              }
              return p;
          });
          
          return { ...prev, products: updatedProducts, library: updatedLibrary };
      });

      setReviewProduct(null);
  };

  const handleNewStoryStep = useCallback((step: StoryStep, action: string = "The journey begins...") => {
    setGameState(prev => {
      let newInventory = [...prev.inventory];
      if (step.inventoryChange.addItem) {
        newInventory.push(step.inventoryChange.addItem.toLowerCase());
      }
      if (step.inventoryChange.removeItem) {
        newInventory = newInventory.filter(
          item => item !== step.inventoryChange.removeItem.toLowerCase()
        );
      }

      let newRelationships = { ...prev.relationships };
      if (step.relationshipChange && step.relationshipChange.characterName) {
        const { characterName, affinityChange, characterBio } = step.relationshipChange;
        const currentCharacter = newRelationships[characterName] || { affinity: 0, bio: '' };
        
        newRelationships[characterName] = {
            affinity: currentCharacter.affinity + affinityChange,
            bio: characterBio || currentCharacter.bio
        };
      }
      
      const newModuleIndex = step.isModuleComplete ? prev.currentModuleIndex + 1 : prev.currentModuleIndex;

      let newBadges = [...prev.badges];
      if (step.badgeEarned && !newBadges.includes(step.badgeEarned)) {
        newBadges.push(step.badgeEarned);
      }

      return {
        ...prev,
        story: step.story,
        isGameOver: step.isGameOver || newModuleIndex >= YOGA_MODULES.length,
        inventory: newInventory,
        relationships: newRelationships,
        log: [...prev.log, { id: Date.now(), action, outcome: step.outcome }],
        history: [...prev.history, step.story],
        currentModuleIndex: newModuleIndex,
        badges: newBadges,
      }
    });

    setIsImageLoading(true);
    generateImageForStory(step.story)
      .then(newImage => {
        setGameState(prev => ({...prev, image: newImage}));
      })
      .catch(e => {
        console.error("Image generation failed:", e);
        setError("The scene is unclear... (Image generation failed)");
      })
      .finally(() => setIsImageLoading(false));

  }, []);

  const startAdventure = useCallback(async () => {
    setIsStoryLoading(true);
    setIsImageLoading(true);
    setError(null);
    setCurrentView('journey');
    try {
      const initialStep = await generateInitialStory();
      if (initialStep) {
        handleNewStoryStep(initialStep);
      } else {
        throw new Error("Failed to start the story.");
      }
    } catch (e) {
      console.error(e);
      setError("The story fails to load. Please check your API key and refresh.");
    } finally {
      setIsStoryLoading(false);
    }
  }, [handleNewStoryStep]);


  const handleActionSubmit = async (action: string) => {
    if (gameState.isGameOver) return;

    setIsStoryLoading(true);
    setError(null);
    try {
      const relationshipsForApi = Object.entries(gameState.relationships).reduce((acc, [name, data]) => {
          acc[name] = { affinity: data.affinity };
          return acc;
      }, {} as { [key: string]: { affinity: number } });

      const nextStep = await generateNextStep(
        gameState.history, 
        action, 
        gameState.inventory, 
        relationshipsForApi, 
        gameState.currentModuleIndex
      );
      if (nextStep) {
        handleNewStoryStep(nextStep, action);
      } else {
        throw new Error("The storyteller is lost for words.");
      }
    } catch (e) {
      console.error(e);
      setError("Your fate is uncertain. Try your action again.");
    } finally {
      setIsStoryLoading(false);
    }
  };
  
  const handleAddToCart = (product: Product) => {
    setGameState(prev => {
        if (prev.cart.find(item => item.id === product.id) || prev.library.find(item => item.id === product.id)) {
            return prev;
        }
        return { ...prev, cart: [...prev.cart, product] };
    });
  };

  const handleRemoveFromCart = (productId: number) => {
      setGameState(prev => ({ ...prev, cart: prev.cart.filter(item => item.id !== productId) }));
  };
  
  const handleCheckout = () => {
      setGameState(prev => ({
          ...prev,
          library: [...prev.library, ...prev.cart],
          cart: [],
      }));
      setCurrentView('library');
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  }
  
  const handleSetTheme = (theme: Theme) => {
      setGameState(prev => ({...prev, theme}));
  };

  const renderView = () => {
    const mainContent = (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-500/30 dark:text-red-300 p-4 rounded-lg mb-6 text-center w-full">
                {error}
                </div>
            )}
            {
                {
                'dashboard': <Dashboard 
                                completedModulesCount={gameState.currentModuleIndex}
                                badges={gameState.badges}
                                onNavigate={handleNavigate}
                             />,
                'journey': (
                    <main className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        <div className="flex-grow">
                        <GameScreen
                            story={gameState.story}
                            image={gameState.image}
                            isStoryLoading={isStoryLoading}
                            isImageLoading={isImageLoading}
                            isGameOver={gameState.isGameOver}
                            onActionSubmit={handleActionSubmit}
                        />
                        </div>
                        <SidePanel 
                        inventory={gameState.inventory} 
                        log={gameState.log}
                        relationships={gameState.relationships}
                        currentModuleIndex={gameState.currentModuleIndex}
                        currentModuleName={YOGA_MODULES[gameState.currentModuleIndex] || 'Journey Complete'}
                        onPlayMedia={setMediaToPlay}
                        />
                    </main>
                ),
                'store': <Store 
                            products={gameState.products}
                            onAddToCart={handleAddToCart} 
                            ownedLibrary={gameState.library} 
                            cart={gameState.cart} 
                            currentModuleIndex={gameState.currentModuleIndex}
                            onViewReviews={setViewReviewsProduct}
                         />,
                'cart': <ShoppingCart cart={gameState.cart} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} />,
                'library': <Library 
                            library={gameState.library} 
                            onPlayMedia={setMediaToPlay}
                            currentModuleIndex={gameState.currentModuleIndex}
                            onReview={setReviewProduct}
                            onViewReviews={setViewReviewsProduct}
                           />,
                'profile': <ProfilePage 
                             profile={gameState.profile}
                             onAvatarChange={handleAvatarChange}
                             onAddToGallery={handleAddToGallery}
                             onEditProfile={() => setIsEditProfileOpen(true)}
                             theme={gameState.theme}
                             onSetTheme={handleSetTheme}
                             stats={{
                                modules: gameState.currentModuleIndex,
                                badges: gameState.badges.length,
                                libraryItems: gameState.library.length,
                             }}
                           />,
                'splash' : null,
                }[currentView]
            }
        </div>
    );
  
    if (currentView === 'splash') {
      return <SplashPage onStart={startAdventure} />;
    }

    return (
      <>
        <TransparentHeader 
          onNavigate={handleNavigate}
          currentView={currentView}
          cartCount={gameState.cart.length}
        />
        {mainContent}
      </>
    )
  }

  return (
    <div className={`min-h-screen animate-fade-in`}>
       <ModuleMenu 
        isOpen={isModuleMenuOpen}
        onClose={() => setIsModuleMenuOpen(false)}
        currentModuleIndex={gameState.currentModuleIndex}
      />
      {mediaToPlay && <MediaPlayer product={mediaToPlay} onClose={() => setMediaToPlay(null)} />}
      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentName={gameState.profile.name}
        onSave={handleProfileSave}
      />
      {reviewProduct && (
        <ReviewModal
            product={reviewProduct}
            onClose={() => setReviewProduct(null)}
            onSubmit={handleReviewSubmit}
            userName={gameState.profile.name}
        />
      )}
      {viewReviewsProduct && (
          <ViewReviewsModal
            product={viewReviewsProduct}
            onClose={() => setViewReviewsProduct(null)}
          />
      )}
      {renderView()}
    </div>
  );
};

export default App;