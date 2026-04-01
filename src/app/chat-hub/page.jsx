'use client';

import { useState, useRef, useEffect } from 'react';
import RecommendPanel from '../../components/RecommendPanel';
import ResultsSection from '../../components/ResultsSection';
import ModelModal from '../../components/ModelModal';
import { useModels } from '../../hooks/useModels';

const CATEGORIES = [
  { key: 'me', label: 'Just me', icon: '👤', desc: 'Personal projects & learning' },
  { key: 'team', label: 'My team', icon: '👥', desc: 'Team collaboration & workflows' },
  { key: 'company', label: 'My company', icon: '🏢', desc: 'Enterprise-scale deployment' },
];

export default function ChatHubPage() {
  const { models, loading: modelsLoading } = useModels();
  const [sessions, setSessions] = useState([]);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState(null);
  const [category, setCategory] = useState('me');
  const [chatMessages, setChatMessages] = useState([
    { id: 'welcome', role: 'bot', text: 'Hi! I\u2019m your NexusAI guide. Describe what you\u2019re building and I\u2019ll recommend the best models for you.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const activeSession = sessions[activeSessionIndex] || { query: '', results: [] };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleResults = (results, query) => {
    const session = {
      id: Date.now(),
      query,
      createdAt: new Date().toISOString(),
      results,
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionIndex(0);

    // Add bot message about results
    if (results.length > 0) {
      const names = results.map((r) => r.model?.name).filter(Boolean);
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'user', text: query },
        {
          id: `${Date.now()}-bot`,
          role: 'bot',
          text: `Great question! I found ${results.length} strong matches: ${names.join(', ')}. The top pick is ${names[0]} with a ${results[0].matchPercentage}% match. Check the results on the right for full details!`,
        },
      ]);
    } else {
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'user', text: query },
        {
          id: `${Date.now()}-bot`,
          role: 'bot',
          text: 'I couldn\u2019t find strong matches for that. Try mentioning what you want to create \u2014 like "generate images", "write code", "transcribe audio", or "translate content".',
        },
      ]);
    }
  };

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const nextMessages = [
      ...chatMessages,
      { id: Date.now(), role: 'user', text: trimmed },
    ];

    const topModels = (activeSession.results || []).slice(0, 3).map((r) => r.model?.name).filter(Boolean);
    const categoryHint = category === 'company'
      ? ' For enterprise use, I\u2019d prioritize models with API access and strong reliability.'
      : category === 'team'
        ? ' For team use, consider models with good cost efficiency and collaboration-friendly APIs.'
        : '';

    const suggestionText = topModels.length
      ? `Based on your current search, I\u2019d recommend ${topModels.join(', ')}.${categoryHint} Click any result card to see full capability scores and pricing.`
      : `Tell me what you\u2019re building \u2014 mention the type of content (images, code, audio, text) and any constraints like budget or speed.${categoryHint}`;

    nextMessages.push({
      id: `${Date.now()}-bot`,
      role: 'bot',
      text: suggestionText,
    });

    setChatMessages(nextMessages);
    setChatInput('');
  };

  const handleChatKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main>
      <div className="app-wrapper">

        {/* Hero */}
        <section className="chub-hero">
          <div className="hero-badge">
            <span>💬</span>
            <span>Guided Discovery</span>
          </div>
          <h1 className="chub-hero-title">
            Tell us what you&apos;re building.
            <br />
            <span className="hero-title-highlight">We&apos;ll match the right models.</span>
          </h1>
          <p className="hero-sub">
            Describe your use case in plain language and we&apos;ll recommend the top AI models
            from our database of {models.length || '17'}+ options — with match scores, reasoning, and pricing.
          </p>
        </section>

        {/* Category selector */}
        <section className="chub-category-section">
          <span className="chub-category-label">Who is this for?</span>
          <div className="chub-category-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`chub-category-pill${category === cat.key ? ' chub-category-active' : ''}`}
                onClick={() => setCategory(cat.key)}
              >
                <span className="chub-category-icon">{cat.icon}</span>
                <div className="chub-category-text">
                  <span className="chub-category-name">{cat.label}</span>
                  <span className="chub-category-desc">{cat.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Loading state */}
        {modelsLoading && (
          <div className="chub-status">
            <div className="spinner spinner-dark" />
            <span>Loading AI models…</span>
          </div>
        )}

        {/* Main two-column layout */}
        <div className="chub-grid">

          {/* Left: Recommend + Chat */}
          <div className="chub-left">
            <RecommendPanel onResults={handleResults} models={models} />

            {/* Chat thread */}
            <div className="chub-chat-card">
              <div className="chub-chat-head">
                <span className="chub-chat-dot" />
                <span className="chub-chat-label">Chat with NexusAI</span>
              </div>
              <div className="chub-chat-body">
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`chub-bubble ${m.role === 'bot' ? 'chub-bubble-bot' : 'chub-bubble-user'}`}
                  >
                    {m.role === 'bot' && <span className="chub-bubble-avatar">✦</span>}
                    <span className="chub-bubble-text">{m.text}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="chub-chat-foot">
                <textarea
                  className="chub-chat-input"
                  rows={2}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  placeholder="Ask about models, pricing, capabilities…"
                />
                <button
                  type="button"
                  className="chub-chat-send"
                  onClick={handleSendMessage}
                >
                  Send →
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results + Session history */}
          <div className="chub-right">
            {sessions.length === 0 ? (
              <div className="chub-welcome-card">
                <div className="chub-welcome-orb chub-welcome-orb-1" />
                <div className="chub-welcome-orb chub-welcome-orb-2" />
                <div className="chub-welcome-icon">🔮</div>
                <h3 className="chub-welcome-title">Your recommendations appear here</h3>
                <p className="chub-welcome-text">
                  Type a question or pick a quick prompt on the left. We&apos;ll show the top 3 AI models that match your needs.
                </p>
                <div className="chub-welcome-features">
                  <div className="chub-welcome-feat"><span>🎯</span> Match scoring</div>
                  <div className="chub-welcome-feat"><span>📊</span> Capability breakdown</div>
                  <div className="chub-welcome-feat"><span>💰</span> Pricing comparison</div>
                </div>
              </div>
            ) : (
              <>
                {/* Session tabs */}
                {sessions.length > 1 && (
                  <div className="chub-session-tabs">
                    {sessions.map((s, index) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`chub-session-tab${index === activeSessionIndex ? ' chub-session-tab-active' : ''}`}
                        onClick={() => setActiveSessionIndex(index)}
                      >
                        <span className="chub-session-dot-sm" />
                        <span className="chub-session-label">{s.query || 'Query'}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Active results */}
                <div className="chub-active-results">
                  <div className="chub-results-heading">
                    <h3>Top matches for: <em>&ldquo;{activeSession.query}&rdquo;</em></h3>
                    <span className="results-tag">✦ {activeSession.results.length} matches</span>
                  </div>
                  <ResultsSection results={activeSession.results || []} onModelClick={setSelectedModel} />
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {selectedModel && (
        <ModelModal model={selectedModel} onClose={() => setSelectedModel(null)} />
      )}
    </main>
  );
}
