import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { QuestCard } from '../components/cards/QuestCard';
import { CreateQuestModal } from '../components/modals/CreateQuestModal';
import { EmptyState } from '../components/ui/EmptyState';
import { QuestCategory } from '../types';
import { Scroll, Plus, Search, Filter } from 'lucide-react';

const CATEGORIES: (QuestCategory | 'All')[] = [
  'All',
  'Coding',
  'Study',
  'Fitness',
  'Reading',
  'Personal',
  'Health'
];

type TabType = 'All' | 'Daily' | 'Weekly' | 'Completed';

export const QuestsPage: React.FC = () => {
  const { quests } = useGame();
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filtering
  const filteredQuests = quests.filter(quest => {
    // Tab filter
    if (activeTab === 'Daily' && !quest.isDaily) return false;
    if (activeTab === 'Weekly' && !quest.isWeekly) return false;
    if (activeTab === 'Completed' && !quest.completed) return false;

    // Category filter
    if (selectedCategory !== 'All' && quest.category !== selectedCategory) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = quest.title.toLowerCase().includes(q);
      const matchDesc = quest.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-rpg text-rpg-gold uppercase tracking-wider mb-1">
            <Scroll className="w-4 h-4" />
            <span>Heroic Quest Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-rpg text-slate-100">
            Quest Log
          </h1>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl rpg-button-gold text-xs font-black uppercase tracking-wider shadow-glow-gold flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Quest</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Main Tabs (All, Daily, Weekly, Completed) */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {(['All', 'Daily', 'Weekly', 'Completed'] as TabType[]).map(tab => {
            const count = quests.filter(q => {
              if (tab === 'Daily') return q.isDaily;
              if (tab === 'Weekly') return q.isWeekly;
              if (tab === 'Completed') return q.completed;
              return true;
            }).length;

            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-rpg tracking-wide transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-rpg-gold text-rpg-dark shadow-glow-gold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{tab} Quests</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono-rpg font-semibold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Category pills */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category selection */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-rpg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rpg-cyan/20 border border-rpg-cyan text-rpg-cyan shadow-glow-cyan'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search quest log..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-rpg-cyan focus:outline-none text-slate-200 text-xs font-mono-rpg placeholder:text-slate-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Quests Grid or Empty State */}
      {filteredQuests.length === 0 ? (
        <EmptyState
          title="No Quests In Log"
          description="There are no quests matching your active category or filter parameters. Forge a new quest to conquer."
          actionLabel="+ Forge Quest Now"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      )}

      {/* Create Quest Modal */}
      <CreateQuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
