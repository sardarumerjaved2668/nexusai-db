'use client';

import { useState } from 'react';

const CATEGORY_TILES = [
  { id: 'write', title: 'Write content', subtitle: 'Emails, posts, stories' },
  { id: 'images', title: 'Create images', subtitle: 'Logos, ads, social posts' },
  { id: 'build', title: 'Build something', subtitle: 'Apps, tools, workflows' },
  { id: 'automate', title: 'Automate work', subtitle: 'Docs, reports, outreach' },
  { id: 'analyze', title: 'Analyse data', subtitle: 'KPIs, trends, insights' },
  { id: 'explore', title: 'Just exploring', subtitle: 'See what AI can do' },
];

const MODEL_TILES = [
  { id: 'gpt4o', name: 'GPT‑4.0', provider: 'OpenAI', tier: 'PREMIUM' },
  { id: 'claude', name: 'Claude 3 Sonnet', provider: 'Anthropic', tier: 'FREE' },
  { id: 'gemini', name: 'Gemini 2.0 Pro', provider: 'Google', tier: 'FREE' },
  { id: 'llama', name: 'Llama 3.1 70B', provider: 'Meta', tier: 'FREE' },
];

export default function ChatHubPage() {
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORY_TILES[0].id);
  const [activeModelId, setActiveModelId] = useState(MODEL_TILES[0].id);
  const [composerText, setComposerText] = useState('');

  const activeModel = MODEL_TILES.find((m) => m.id === activeModelId) || MODEL_TILES[0];

  return (
    <main className="chat-main">
      <div className="app-wrapper mk-app-full">
        {/* Tabs strip at top */}
        <div className="chub-session-tabs">
          <button type="button" className="chub-session-tab chub-session-tab-active">
            <span className="chub-session-dot-sm" />
            <span className="chub-session-label">Chat Hub</span>
          </button>
          <button type="button" className="chub-session-tab">
            <span className="chub-session-label">Agents</span>
          </button>
          <button type="button" className="chub-session-tab">
            <span className="chub-session-label">Discover New</span>
          </button>
        </div>

        {/* Big hero heading */}
        <section className="chub-hero">
          <h1 className="chub-hero-title">Welcome! I&apos;m here to help you</h1>
        </section>

        {/* Category buttons row */}
        <section className="chub-category-section">
          <p className="chub-category-label">What would you like to do today?</p>
          <div className="chub-category-row">
            {CATEGORY_TILES.map((tile) => (
              <button
                key={tile.id}
                type="button"
                className={`chub-category-pill${
                  activeCategoryId === tile.id ? ' chub-category-active' : ''
                }`}
                onClick={() => setActiveCategoryId(tile.id)}
              >
                <span className="chub-category-icon">✨</span>
                <span className="chub-category-text">
                  <span className="chub-category-name">{tile.title}</span>
                  <span className="chub-category-desc">{tile.subtitle}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Main body: models rail + center welcome card */}
        <div className="chub-shell">
          {/* Left: models list */}
          <aside className="chub-models-rail">
            <div className="chub-models-head">
              <span className="chub-models-title">Models</span>
              <span className="chub-models-count">{MODEL_TILES.length} available</span>
            </div>
            <div className="chub-models-search">
              <input
                type="text"
                className="chub-models-input"
                placeholder="Search 525+ models…"
                readOnly
              />
            </div>
            <div className="chub-models-list">
              {MODEL_TILES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`chub-model-pill${
                    activeModelId === m.id ? ' chub-model-pill-active' : ''
                  }`}
                  onClick={() => setActiveModelId(m.id)}
                >
                  <div className="chub-model-pill-main">
                    <span className="chub-model-pill-name">{m.name}</span>
                    <span className="chub-model-pill-provider">{m.provider}</span>
                  </div>
                  <span className="chub-model-pill-tier">{m.tier}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Center card (matches screenshot) */}
          <section className="chub-left">
            <article className="chat-welcome-card">
              <header className="chat-welcome-head">
                <button type="button" className="chat-welcome-pill">
                  ✦ Chat Hub
                </button>
              </header>
              <div className="chat-welcome-inner">
                <h2 className="chat-welcome-title">Welcome! I&apos;m here to help you</h2>
                <p className="chat-welcome-sub">
                  No tech background needed. Tell me what you&apos;d like to achieve — I&apos;ll
                  help you discover what&apos;s possible, step by step.
                </p>

                <section className="chat-welcome-grid">
                  {CATEGORY_TILES.map((tile) => (
                    <button
                      key={tile.id}
                      type="button"
                      className="chat-welcome-tile"
                      onClick={() => setActiveCategoryId(tile.id)}
                    >
                      <div className="chat-welcome-tile-icon">✨</div>
                      <div className="chat-welcome-tile-main">
                        <div className="chat-welcome-tile-title">{tile.title}</div>
                        <div className="chat-welcome-tile-sub">{tile.subtitle}</div>
                      </div>
                    </button>
                  ))}
                </section>
                <p className="chat-welcome-hint">
                  Or type anything below — there are no wrong answers.
                </p>
              </div>
            </article>

            {/* Bottom composer bar, like screenshot */}
            <div className="chat-composer">
              <textarea
                className="chat-composer-input"
                rows={2}
                placeholder="Describe your project, ask a question, or just say hi — I’m here to help…"
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
              />
              <button type="button" className="chat-composer-send">
                ➤
              </button>
            </div>
          </section>

          {/* Right column: active model summary card */}
          <aside className="chub-right">
            <div className="chub-active-results">
              <div className="chub-results-heading">
                <h3>
                  Active model: <em>{activeModel.name}</em>
                </h3>
              </div>
              <div className="chub-active-model-card">
                <div className="chub-active-model-head">
                  <div>
                    <div className="chub-active-model-name">{activeModel.name}</div>
                    <div className="chub-active-model-provider">
                      by {activeModel.provider}
                    </div>
                  </div>
                  <span className="chub-active-tier">{activeModel.tier}</span>
                </div>
                <p className="chub-active-model-desc">
                  OpenAI&apos;s most advanced multimodal model. Accepts text, images, and audio
                  inputs and returns rich outputs for reasoning, coding, and analysis.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

