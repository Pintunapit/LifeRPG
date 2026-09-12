import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, Swords, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const quickActions = [
  ['⚔️ Plan My Day', 'Plan my day based on my active quests.'], ['📜 Create Quest', 'Create a coding quest for me.'], ['📊 Analyze Stats', 'Analyze my attributes and progress.'], ['🔥 Streak Advice', 'How is my streak going?'], ['⬆️ Level Up Advice', 'How much XP do I need for the next level?'], ['🎯 Give Me a Challenge', 'Give me a challenge.']
];

export const Chatbot: React.FC = () => {
  const { isOpen, isThinking, hasUnreadSuggestion, messages, openChat, closeChat, sendMessage, addSuggestedQuest } = useChat();
  const [input, setInput] = useState('');
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isThinking, isOpen]);
  const submit = () => { if (!input.trim() || isThinking) return; void sendMessage(input); setInput(''); };
  return <>
    <button onClick={openChat} aria-label="Open RPG Guide chat" className="fixed bottom-20 lg:bottom-6 right-5 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-rpg-gold via-amber-500 to-cyan-500 text-slate-950 shadow-glow-gold border border-amber-200/70 flex items-center justify-center transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rpg-cyan">
      <Bot className="w-7 h-7" /><span className="absolute inset-0 rounded-2xl animate-ping bg-rpg-cyan/20 -z-10" />
      {hasUnreadSuggestion && <span aria-label="New guide suggestion" className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-slate-950" />}
    </button>
    <AnimatePresence>{isOpen && <motion.section initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .96 }} className="fixed inset-3 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[650px] z-50 flex flex-col rounded-3xl overflow-hidden bg-[#0a0f1b] border border-cyan-500/40 shadow-2xl shadow-cyan-950/70">
      <header className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rpg-gold to-cyan-400 flex items-center justify-center text-slate-950"><Bot className="w-5 h-5" /></div><div className="flex-1"><h2 className="font-rpg font-bold text-slate-100">RPG Guide</h2><p className="text-[11px] text-emerald-400">● Online</p></div><button aria-label="Minimize chat" onClick={closeChat} className="p-2 text-slate-400 hover:text-white"><ChevronDown className="w-5 h-5" /></button><button aria-label="Close chat" onClick={closeChat} className="p-2 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></header>
      <div className="px-4 pt-3 flex gap-2 overflow-x-auto shrink-0">{quickActions.map(([label, prompt]) => <button key={label} onClick={() => void sendMessage(prompt)} disabled={isThinking} className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-rpg-cyan text-[11px] text-slate-200 disabled:opacity-50">{label}</button>)}</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">{messages.map(message => <div key={message.id} className={`max-w-[88%] rounded-2xl p-3 text-sm whitespace-pre-line ${message.role === 'user' ? 'ml-auto bg-cyan-600/20 border border-cyan-500/30 text-cyan-50' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}><p>{message.content}</p>{message.suggestion && <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-amber-500/30"><div className="flex gap-2 text-rpg-gold font-rpg text-xs"><Swords className="w-4 h-4" /> Quest Proposal</div><p className="font-bold mt-1">{message.suggestion.title}</p><p className="text-xs text-slate-400 mt-1">{message.suggestion.description}</p><p className="text-xs mt-2 text-cyan-300">{message.suggestion.difficulty} · +{message.suggestion.xpReward} XP · +{message.suggestion.goldReward} Gold · +{message.suggestion.attributeReward} {message.suggestion.attributeType}</p><button onClick={() => addSuggestedQuest(message.suggestion!)} className="mt-3 w-full py-2 rounded-lg rpg-button-gold text-xs font-bold">Add Quest</button></div>}</div>)}{isThinking && <div className="inline-flex gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-rpg-gold"><Sparkles className="w-4 h-4 animate-spin" /> RPG Guide is thinking…</div>}<div ref={bottom} /></div>
      <footer className="p-3 border-t border-slate-800 flex gap-2"><textarea aria-label="Message RPG Guide" value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } }} placeholder="Ask your guide…" rows={1} className="flex-1 resize-none rounded-xl bg-slate-900 border border-slate-700 focus:border-rpg-cyan focus:outline-none px-3 py-2 text-sm text-slate-100" /><button onClick={submit} disabled={!input.trim() || isThinking} aria-label="Send message" className="w-10 rounded-xl rpg-button-gold flex items-center justify-center disabled:opacity-40"><Send className="w-4 h-4" /></button></footer>
    </motion.section>}</AnimatePresence>
  </>;
};
