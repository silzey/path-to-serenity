import React, { useState, useEffect, useCallback } from 'react';
import GameScreen from './components/GameScreen';
import SidePanel from './components/SidePanel';
import SplashPage from './components/SplashPage';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import ModuleMenu from './components/ModuleMenu';
import NavigationMenu from './components/NavigationMenu';
import Store from './components/Store';
import ShoppingCart from './components/ShoppingCart';
import Library from './components/Library';
import MediaPlayer from './components/MediaPlayer';
import { generateInitialStory, generateNextStep, generateImageForStory, YOGA_MODULES } from './services/geminiService';
import type { StoryStep } from './services/geminiService';
import type { GameState, Product } from './types';

export type View = 'splash' | 'journey' | 'dashboard' | 'store' | 'cart' | 'library';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
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
  });
  const [isStoryLoading, setIsStoryLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('splash');
  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [mediaToPlay, setMediaToPlay] = useState<Product | null>(null);


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
    setIsNavMenuOpen(false);
  }

  const renderView = () => {
    const mainContent = (
      <>
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-6 text-center w-full">
            {error}
            </div>
        )}
        <div className="w-full max-w-7xl mx-auto">
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
                            onAddToCart={handleAddToCart} 
                            ownedLibrary={gameState.library} 
                            cart={gameState.cart} 
                            currentModuleIndex={gameState.currentModuleIndex}
                         />,
                'cart': <ShoppingCart cart={gameState.cart} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} />,
                'library': <Library 
                            library={gameState.library} 
                            onPlayMedia={setMediaToPlay}
                            currentModuleIndex={gameState.currentModuleIndex}
                           />,
                'splash' : null,
                }[currentView]
            }
        </div>
      </>
    );
  
    if (currentView === 'splash') {
      return <SplashPage onStart={startAdventure} />;
    }

    return (
      <>
        <Header 
          onOpenNavMenu={() => setIsNavMenuOpen(true)} 
          onOpenModuleMenu={() => setIsModuleMenuOpen(true)}
          cartCount={gameState.cart.length}
          onNavigate={handleNavigate}
        />
        {mainContent}
      </>
    )
  }

  return (
    <div className={`min-h-screen animate-fade-in ${currentView !== 'splash' ? 'p-4 sm:p-6 lg:p-8' : ''}`}>
       <ModuleMenu 
        isOpen={isModuleMenuOpen}
        onClose={() => setIsModuleMenuOpen(false)}
        currentModuleIndex={gameState.currentModuleIndex}
      />
      <NavigationMenu 
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onNavigate={handleNavigate}
        currentView={currentView}
        unlockLevel={gameState.currentModuleIndex}
      />
      {mediaToPlay && <MediaPlayer product={mediaToPlay} onClose={() => setMediaToPlay(null)} />}
      {renderView()}
    </div>
  );
};

export default App;