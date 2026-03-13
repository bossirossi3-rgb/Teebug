import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setSelectedGame(null);
              setSearchQuery('');
            }}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              UNBLOCKED<span className="text-emerald-500">GAMES</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <button className="hover:text-emerald-400 transition-colors">Trending</button>
            <button className="hover:text-emerald-400 transition-colors">New</button>
            <button className="hover:text-emerald-400 transition-colors">Categories</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Game Player Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedGame.title}</h2>
                    <p className="text-zinc-400 text-sm">{selectedGame.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a 
                    href={selectedGame.iframeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className={`relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ${isFullscreen ? 'fixed inset-4 z-50 m-0' : 'aspect-video w-full'}`}>
                {isFullscreen && (
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Related/More Games */}
              <div className="pt-12 border-t border-white/5">
                <h3 className="text-xl font-bold mb-6">More Games You Might Like</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {gamesData
                    .filter(g => g.id !== selectedGame.id)
                    .slice(0, 6)
                    .map(game => (
                      <GameCard key={game.id} game={game} onClick={() => handleGameSelect(game)} />
                    ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <div className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 p-8 md:p-12">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
                    Featured Game
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                    READY TO <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">PLAY?</span>
                  </h2>
                  <p className="text-zinc-400 text-lg mb-8">
                    Discover hundreds of unblocked games. No downloads, no installs. Just pure gaming fun right in your browser.
                  </p>
                  <button 
                    onClick={() => handleGameSelect(gamesData[0])}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Play Featured
                  </button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                  <img 
                    src="https://picsum.photos/seed/gaming/800/600" 
                    alt="Gaming" 
                    className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0a0a0a]/80" />
                </div>
              </div>

              {/* Games Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">All Games</h3>
                  <p className="text-zinc-500 text-sm">{filteredGames.length} games found</p>
                </div>
                
                {filteredGames.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {filteredGames.map((game) => (
                      <GameCard 
                        key={game.id} 
                        game={game} 
                        onClick={() => handleGameSelect(game)} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <h4 className="text-xl font-medium text-zinc-400">No games found</h4>
                    <p className="text-zinc-600">Try searching for something else</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-white/5 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Gamepad2 className="text-emerald-500 w-6 h-6" />
            <span className="font-bold tracking-tight">UNBLOCKED GAMES HUB</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <p className="text-zinc-600 text-sm">© 2026 Unblocked Games Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function GameCard({ game, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-lg mb-3">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="bg-emerald-500 text-black p-2 rounded-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Play className="w-4 h-4 fill-current" />
          </div>
        </div>
      </div>
      <h4 className="font-bold text-sm group-hover:text-emerald-400 transition-colors line-clamp-1">
        {game.title}
      </h4>
      <p className="text-xs text-zinc-500 line-clamp-1 mt-1">
        {game.description}
      </p>
    </motion.div>
  );
}
