import React, { useState, useRef, useEffect, useCallback } from 'react';
import Markdown from 'react-markdown';
import { MenuItem, ChatMessage } from '../types';
import { useNavigation } from '../context/NavigationContext';
import {
  normalizeDishIdentity,
  validateAndDeduplicateRecommendations,
  detectDishesInTextSafely,
  resolveCanonicalDish,
} from '../utils/menuIdentity';
import { resolveDishPhoto } from '../utils/dishPhotoResolver';
import {
  Sparkles,
  Send,
  X,
  ExternalLink,
  Plus,
  Compass,
  RotateCcw,
  CheckCircle,
  Clock,
  MapPin,
  UtensilsCrossed,
  ShieldAlert,
  Search,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface DiningConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (dish: MenuItem) => void;
  onOpenReservation: () => void;
  initialPrompt?: string;
}

const STARTER_PROMPTS = [
  { label: '🔥 Recommend 3 Signatures', prompt: 'Recommend three signature dishes for a first-time visitor.' },
  { label: '🌿 Allergies & Dietary Care', prompt: 'I have a shellfish allergy and my friend is vegetarian. What can we order safely?' },
  { label: '👨‍👩‍👧 4-Person Feast Pairing', prompt: 'Can you recommend a balanced dinner spread for 4 diners who love wok hei?' },
  { label: '📅 Direct WhatsApp Booking', prompt: 'How do I reserve a table or message your mainline WhatsApp for Keong Saik or City Square Mall?' },
  { label: '🚇 MRT Walking Directions', prompt: 'How do I get to Kok Sen from Outram Park or Maxwell MRT?' },
];

const INITIAL_WELCOME_TEXT = `### Welcome to 國成餐室 (Kok Sen Restaurant)!

I'm your **AI Dining Concierge**, here to guide your visit across our authentic Cantonese kitchens. 

Whether you're exploring heritage recipes, balancing a spread for your party, checking allergen details, or planning a table:

- **Iconic Wok Hei:** Ask about our famous **Big Prawns Hor Fun**, **Claypot Yong Tau Foo**, or **Prawn Paste Chicken**.
- **Table Planning:** Balanced spreads tailored for 2, 4, or large family tables in [#table-spreads].
- **Dietary & Allergen Care:** Detailed ingredient guidance for crustacean, gluten, and vegetarian diets.
- **Reservations & WhatsApp:** Connect to our mainline WhatsApp for **Keong Saik (9727 2533)** or **City Square Mall (9624 4244)**, or submit via [#book-table].

What are you craving today, or how many guests are dining with you?`;

export function DiningConciergeModal({
  isOpen,
  onClose,
  onAddToOrder,
  onOpenReservation,
  initialPrompt,
}: DiningConciergeModalProps) {
  const { navigate } = useNavigation();

  // Monotonic message id generator
  const messageIdCounterRef = useRef(1);
  const generateMessageId = (role: 'user' | 'assistant') => {
    messageIdCounterRef.current += 1;
    return `${role}-${Date.now()}-${messageIdCounterRef.current}`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-init-1',
      role: 'assistant',
      text: INITIAL_WELCOME_TEXT,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedDishIds, setAddedDishIds] = useState<Record<string, boolean>>({});
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [failedPrompt, setFailedPrompt] = useState<string | null>(null);

  // Excluded dishes state to track recommendations across conversation turns
  const [previouslyRecommendedKeys, setPreviouslyRecommendedKeys] = useState<string[]>([]);

  // Guard refs
  const isSubmittingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const conversationSessionIdRef = useRef(Date.now());
  const processedInitialPromptRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  // Handle initial prompt strictly once per open
  useEffect(() => {
    if (isOpen && initialPrompt && initialPrompt !== processedInitialPromptRef.current) {
      processedInitialPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt);
    }
    if (!isOpen) {
      processedInitialPromptRef.current = null;
    }
  }, [isOpen, initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText) return;
    if (loading || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setLoading(true);
    setFailedPrompt(null);
    setInput('');

    const currentSessionId = conversationSessionIdRef.current;

    // Stable user message
    const userMessage: ChatMessage = {
      id: generateMessageId('user'),
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          excludedDishKeys: previouslyRecommendedKeys,
        }),
      });

      // Discard stale response if conversation was reset while waiting
      if (conversationSessionIdRef.current !== currentSessionId) {
        return;
      }

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      // Check if session changed during JSON parsing
      if (conversationSessionIdRef.current !== currentSessionId) {
        return;
      }

      const replyText =
        data.reply ||
        "I'm delighted to assist. How else can I guide your meal at Kok Sen today?";

      // Validate recommendations received from backend against authoritative menu
      let validatedDishes = validateAndDeduplicateRecommendations(
        Array.isArray(data.recommendedDishes) ? data.recommendedDishes : [],
        previouslyRecommendedKeys,
        false
      );

      // If backend didn't provide structured dishes, safely extract authentic dishes from text
      if (validatedDishes.length === 0) {
        validatedDishes = detectDishesInTextSafely(
          replyText,
          previouslyRecommendedKeys,
          false
        );
      }

      // Record newly recommended dishes into conversation state
      if (validatedDishes.length > 0) {
        const newKeys = validatedDishes.map((d) => normalizeDishIdentity(d.nameEn, d.nameZh));
        setPreviouslyRecommendedKeys((prev) => Array.from(new Set([...prev, ...newKeys])));
      }

      const assistantMessage: ChatMessage = {
        id: generateMessageId('assistant'),
        role: 'assistant',
        text: replyText,
        sources: data.sources || [],
        suggestedDishes: validatedDishes,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request aborted intentionally
        return;
      }
      if (conversationSessionIdRef.current !== currentSessionId) {
        return;
      }

      console.error('Concierge request error:', err);
      setFailedPrompt(userText);

      // Safe, price-free, grounded fallback message
      const fallbackDishes = validateAndDeduplicateRecommendations(
        ['Big Prawns Hor Fun', 'Claypot Yong Tau Foo', 'Prawn Paste Chicken'],
        previouslyRecommendedKeys,
        false
      );

      const assistantMessage: ChatMessage = {
        id: generateMessageId('assistant'),
        role: 'assistant',
        text: `### At Your Service at Kok Sen

I apologize for the connection interruption. You can ask me again or check our signature heritage dishes below:

- **Big Prawns Hor Fun**: Thick flat rice noodles wok-charred with split king prawns in rich egg gravy.
- **Claypot Yong Tau Foo**: Handmade fish and squid paste in deep-fried beancurd, eggplant, and peppers.
- **Prawn Paste Chicken**: Marinated in fermented prawn paste, fried golden-brown to crisp perfection.

For current pricing and online orders, please visit our [ordering page](https://koksen.oddle.me/en_SG).`,
        suggestedDishes: fallbackDishes,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      if (conversationSessionIdRef.current === currentSessionId) {
        setLoading(false);
        isSubmittingRef.current = false;
      }
    }
  };

  const handleResetChat = () => {
    // Abort pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Advance session ID so any late responses are discarded
    conversationSessionIdRef.current = Date.now();
    isSubmittingRef.current = false;
    setLoading(false);
    setFailedPrompt(null);
    setPreviouslyRecommendedKeys([]);

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: `### Conversation Refreshed

I have refreshed our chat session. All previous recommendations have been cleared.

What would you like to explore today? Ask about our heritage signatures, claypot braises, wok noodles, or table reservations!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === '#full-menu') {
      navigate('/menu');
      onClose();
    } else if (sectionId === '#table-spreads') {
      navigate('/menu');
      onClose();
    } else if (sectionId === '#gallery') {
      navigate('/gallery');
      onClose();
    } else if (sectionId === '#book-table') {
      navigate('/reservations');
      onClose();
    } else if (sectionId === '#location') {
      navigate('/visit');
      onClose();
    } else if (sectionId === '#wok-favourites') {
      navigate('/');
      onClose();
    } else {
      const el = document.querySelector(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAddDish = (dish: MenuItem) => {
    onAddToOrder(dish);
    setAddedDishIds((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedDishIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 2500);
  };

  const handleRetry = () => {
    if (failedPrompt) {
      const text = failedPrompt;
      setFailedPrompt(null);
      handleSendMessage(text);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:w-[520px] md:w-[560px] h-full bg-surface-container-lowest border-l border-surface-container-high shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Concierge Header */}
        <div className="px-5 py-4 bg-surface-container border-b border-surface-container-high flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-dish-title text-base font-bold text-on-surface truncate">
                  Kok Sen Dining Concierge
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary shrink-0">
                  Authoritative AI
                </span>
              </div>
              <span className="font-label-caps text-xs text-secondary truncate">
                國成餐室 · 125 Authentic Menu Listings · Bib Gourmand 2016–2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleResetChat}
              title="Reset conversation"
              className="w-8 h-8 rounded-full hover:bg-surface-container-high/60 text-tertiary hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close concierge"
              className="w-8 h-8 rounded-full hover:bg-surface-container-high/60 text-tertiary hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Nav & Online Ordering Action Bar */}
        <div className="px-4 py-2 bg-surface-container-low border-b border-surface-container-high/60 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-tertiary flex items-center gap-1 font-semibold shrink-0">
              <Compass className="w-3.5 h-3.5 text-primary" /> Quick Nav:
            </span>
            <button
              type="button"
              onClick={() => handleNavigateSection('#wok-favourites')}
              className="shrink-0 px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary transition-colors text-on-surface border border-surface-container-high/60 cursor-pointer"
            >
              🔥 Top 4
            </button>
            <button
              type="button"
              onClick={() => handleNavigateSection('#full-menu')}
              className="shrink-0 px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary transition-colors text-on-surface border border-surface-container-high/60 cursor-pointer"
            >
              📜 Menu
            </button>
            <button
              type="button"
              onClick={() => handleNavigateSection('#book-table')}
              className="shrink-0 px-2.5 py-1 rounded bg-surface-container hover:bg-secondary hover:text-on-secondary transition-colors text-on-surface border border-surface-container-high/60 cursor-pointer"
            >
              📅 Reserve
            </button>
          </div>

        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl p-4 shadow-sm text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-on-primary rounded-br-xs'
                    : 'bg-surface-container border border-surface-container-high/70 text-on-surface rounded-bl-xs'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="concierge-markdown prose prose-sm max-w-none text-on-surface space-y-2">
                    <Markdown
                      components={{
                        h3: ({ children }) => (
                          <h4 className="font-dish-title text-base font-bold text-primary mt-2 mb-1">
                            {children}
                          </h4>
                        ),
                        p: ({ children }) => (
                          <p className="leading-relaxed mb-2 text-on-surface/90">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-4 space-y-1 mb-2 text-on-surface/90">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => (
                          <strong className="font-bold text-on-surface">{children}</strong>
                        ),
                        // Handle website section jump tags or external order links
                        a: ({ href, children }) => {
                          const isSection = href && href.startsWith('#');
                          if (isSection) {
                            return (
                              <button
                                type="button"
                                onClick={() => handleNavigateSection(href)}
                                className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:text-primary-dim transition-colors cursor-pointer"
                              >
                                {children}
                              </button>
                            );
                          }
                          return (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-primary-dim font-semibold"
                            >
                              <span>{children}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          );
                        },
                      }}
                    >
                      {msg.text}
                    </Markdown>

                    {/* Validated Suggested Dishes - Rendered Exactly Once Per Message */}
                    {msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-surface-container-high/60 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-[11px] text-secondary font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
                            Recommended Dishes from Kok Sen Menu:
                          </span>
                          <span className="text-[10px] text-tertiary">
                            For current prices, visit online ordering
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.suggestedDishes.map((dish) => {
                            const isAdded = Boolean(addedDishIds[dish.id]);
                            const dishKey = normalizeDishIdentity(dish.nameEn, dish.nameZh);
                            const photoRes = resolveDishPhoto(dish);
                            const currentSrc = photoRes.imageUrl || dish.imageUrl || photoRes.photo_source_url || dish.photo_source_url;
                            const hasValidImage =
                              Boolean(photoRes.hasOriginalPhoto && currentSrc) &&
                              !brokenImages[dishKey] &&
                              !photoRes.isConflict;

                            return (
                              <div
                                key={`${msg.id}-dish-${dishKey}`}
                                className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high/80 flex flex-col justify-between gap-2 shadow-xs hover:border-primary/40 transition-colors"
                              >
                                <div className="flex items-start gap-2.5">
                                  {/* Authoritative Food Photo or Clean Text-Only Presentation */}
                                  {hasValidImage ? (
                                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border border-surface-container-high bg-surface-container">
                                      <img
                                        src={currentSrc}
                                        alt={dish.nameEn}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                          const target = e.currentTarget;
                                          const fallbackUrl = photoRes.photo_source_url || dish.photo_source_url || dish.source_url;
                                          if (fallbackUrl && target.src !== fallbackUrl) {
                                            target.src = fallbackUrl;
                                          } else {
                                            setBrokenImages((prev) => ({ ...prev, [dishKey]: true }));
                                          }
                                        }}
                                      />
                                      {dish.itemCode && (
                                        <span className="absolute bottom-0.5 left-0.5 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono font-bold text-white">
                                          {dish.itemCode}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border border-surface-container-high bg-surface-container-low flex flex-col items-center justify-center p-1 text-center select-none">
                                      <span className="font-mono text-[10px] font-bold text-secondary">
                                        {dish.itemCode || 'KS'}
                                      </span>
                                      <span className="text-[9px] text-tertiary leading-tight mt-0.5">
                                        No photo
                                      </span>
                                    </div>
                                  )}

                                  {/* Dish Bilingual Name & Details (strictly no price) */}
                                  <div className="flex-1 min-w-0 flex flex-col">
                                    <span className="font-bold text-xs text-on-surface line-clamp-1">
                                      {dish.nameEn}
                                    </span>
                                    {dish.nameZh && (
                                      <span className="text-[11px] text-secondary font-medium">
                                        {dish.nameZh}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-tertiary line-clamp-2 mt-0.5 leading-snug">
                                      {dish.description}
                                    </span>
                                  </div>
                                </div>

                                {/* Action: Add to Local Order */}
                                <div className="pt-1 border-t border-surface-container-high/40">
                                  <button
                                    type="button"
                                    onClick={() => handleAddDish(dish)}
                                    className={`w-full px-2 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                      isAdded
                                        ? 'bg-secondary text-on-secondary'
                                        : 'bg-primary/10 hover:bg-primary text-primary hover:text-on-primary'
                                    }`}
                                  >
                                    {isAdded ? (
                                      <>
                                        <CheckCircle className="w-3 h-3" /> Added
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-3 h-3" /> Add to Order
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Sources (if any) with Stable Keys */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-surface-container-high/50 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-tertiary">
                          <Search className="w-3 h-3 text-secondary" />
                          <span>Sources:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, i) => (
                            <a
                              key={`${msg.id}-src-${encodeURIComponent(src.url || String(i))}`}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-surface-container-highest/60 hover:bg-surface-container-highest text-secondary hover:text-on-surface border border-surface-container-high transition-colors"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[180px]">{src.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
              <span className="text-[10px] text-tertiary mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-2">
              <div className="p-3.5 rounded-2xl rounded-bl-xs bg-surface-container border border-surface-container-high text-on-surface flex items-center gap-2.5 text-xs shadow-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="text-secondary font-medium">
                  Reviewing Kok Sen kitchen recipes &amp; pairings...
                </span>
              </div>
            </div>
          )}

          {/* Failed Prompt Retry Banner */}
          {failedPrompt && !loading && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-on-surface">
                <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                <span>Could not send "{failedPrompt.slice(0, 35)}..."</span>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="px-2.5 py-1 rounded bg-primary text-on-primary font-semibold flex items-center gap-1 hover:brightness-110 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Chips */}
        <div className="px-4 py-2 bg-surface-container-low border-t border-surface-container-high/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {STARTER_PROMPTS.map((starter, i) => (
            <button
              key={`starter-${i}`}
              type="button"
              disabled={loading}
              onClick={() => handleSendMessage(starter.prompt)}
              className="shrink-0 px-2.5 py-1 rounded-full text-xs bg-surface-container hover:bg-primary/10 text-on-surface hover:text-primary border border-surface-container-high transition-colors disabled:opacity-50 cursor-pointer"
            >
              {starter.label}
            </button>
          ))}
        </div>


        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-surface-container border-t border-surface-container-high flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about dishes, reservations, allergies, or MRT..."
            disabled={loading}
            className="flex-1 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high text-base sm:text-sm text-on-surface placeholder:text-tertiary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
