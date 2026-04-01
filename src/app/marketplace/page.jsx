'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const FILTER_TABS = [
  'All Labs',
  'OpenAI',
  'Anthropic',
  'Google DeepMind',
  'Meta',
  'Mistral',
  'Cohere',
  'Microsoft',
  'Amazon',
];

// TODO: replace with API response from /api/models
const MOCK_MODELS = [
  {
    id: 'gpt5',
    name: 'GPT‑5',
    provider: 'OpenAI',
    badges: ['Flagship', 'Agents', 'Multimodal'],
    description:
      'OpenAI flagship: native compute‑aware agents, advanced reasoning, 2M context.',
    rating: '4.9',
    reviews: '2,120',
    inputPrice: '$2.50 / 1M',
    outputPrice: '$5.00 / 1M',
    tag: 'Premium',
  },
  {
    id: 'gpt52',
    name: 'GPT‑5.2',
    provider: 'OpenAI',
    badges: ['Balanced', 'Multimodal', 'Streaming'],
    description:
      'Mid‑tier GPT‑5 variant with improved instruction‑following and multimodal support.',
    rating: '4.8',
    reviews: '1,630',
    inputPrice: '$1.40 / 1M',
    outputPrice: '$2.80 / 1M',
    tag: 'Cost‑effective',
  },
  {
    id: 'gpt5turbo',
    name: 'GPT‑5 Turbo',
    provider: 'OpenAI',
    badges: ['Cost‑effective', 'High‑volume'],
    description:
      'Most cost‑effective GPT‑5 for high‑volume workloads and background automation.',
    rating: '4.7',
    reviews: '980',
    inputPrice: '$0.80 / 1M',
    outputPrice: '$1.60 / 1M',
    tag: 'Turbo',
  },
  {
    id: 'gpt45',
    name: 'GPT‑4.5',
    provider: 'OpenAI',
    badges: ['Creative', 'Long‑form', 'Language'],
    description:
      'Bridging model with improved creativity and long‑form generation capabilities.',
    rating: '4.7',
    reviews: '3,470',
    inputPrice: '$0.60 / 1M',
    outputPrice: '$1.20 / 1M',
    tag: 'Popular',
  },
  {
    id: 'gpt41mini',
    name: 'GPT‑4.1 mini',
    provider: 'OpenAI',
    badges: ['Everyday', 'Fast', 'Affordable'],
    description:
      'Lightweight GPT‑4.1 tier, ideal for everyday tasks and high‑volume chat workloads.',
    rating: '4.6',
    reviews: '5,420',
    inputPrice: '$0.15 / 1M',
    outputPrice: '$0.60 / 1M',
    tag: 'Everyday',
  },
  {
    id: 'gpt4o',
    name: 'GPT‑4o',
    provider: 'OpenAI',
    badges: ['Multimodal', 'Streaming'],
    description:
      'OpenAI’s flagship GPT‑4o for lightweight chat, realtime tools, and streaming responses.',
    rating: '4.8',
    reviews: '8,210',
    inputPrice: '$0.50 / 1M',
    outputPrice: '$1.50 / 1M',
    tag: 'Popular',
  },
  {
    id: 'o3',
    name: 'o3',
    provider: 'OpenAI',
    badges: ['Reasoning', 'Planning'],
    description:
      'OpenAI’s advanced reasoning model with chain‑of‑thought for complex tasks and analysis.',
    rating: '4.9',
    reviews: '910',
    inputPrice: '$3.00 / 1M',
    outputPrice: '$6.00 / 1M',
    tag: 'Reasoning',
  },
];

export default function MarketplacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeLab, setActiveLab] = useState(FILTER_TABS[0]);
  const [search, setSearch] = useState('');
  const [activeModelId, setActiveModelId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredModels = useMemo(() => {
    const term = search.trim().toLowerCase();

    return MOCK_MODELS.filter((model) => {
      const matchesLab =
        activeLab === FILTER_TABS[0] || model.provider.toLowerCase().includes(activeLab.toLowerCase());

      if (!matchesLab) return false;
      if (!term) return true;

      const haystack = [
        model.name,
        model.provider,
        model.description,
        ...(model.badges || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [activeLab, search]);

  const activeModel =
    MOCK_MODELS.find((m) => m.id === (activeModelId || 'gpt5')) || MOCK_MODELS[0];

  useEffect(() => {
    const modelFromQuery = searchParams.get('model');
    const details = searchParams.get('details');
    if (modelFromQuery && details === '1') {
      setActiveModelId(modelFromQuery);
      setShowModal(true);
    }
  }, [searchParams]);

  const handleOpenDetails = (modelId) => {
    setActiveModelId(modelId);
    setShowModal(true);
  };

  const handleCloseDetails = () => {
    setShowModal(false);
    router.replace('/marketplace');
  };

  return (
    <main>
      <div className="app-wrapper mk-app-full">
        {/* Header */}
        <header className="mk-header">
          <div>
            <h1 className="mk-title">Model Marketplace</h1>
            <p className="mk-sub">
              Search and compare frontier models across labs, pricing tiers, and capabilities.
            </p>
          </div>
          <div className="mk-header-meta">
            <span className="mk-pill">525+ models</span>
            <span className="mk-pill mk-pill-soft">Updated daily</span>
          </div>
        </header>

        {/* Search + filters bar */}
        <section className="mk-search-row">
          <div className="mk-search-box">
            <span className="mk-search-icon">🔎</span>
            <input
              className="mk-search-input"
              type="text"
              placeholder="Search models, capabilities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mk-filter-chips">
            {FILTER_TABS.map((label) => (
              <button
                key={label}
                type="button"
                className={`mk-filter-chip${
                  activeLab === label ? ' mk-filter-chip-active' : ''
                }`}
                onClick={() => setActiveLab(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Main layout: left filters + grid */}
        <section className="mk-shell">
          {/* Left rail: filters (static) */}
          <aside className="mk-left-rail">
            <div className="mk-help-card">
              <h2>Need help choosing?</h2>
              <p>
                Chat with our AI guide for a personalised model recommendation in under 60
                seconds.
              </p>
              <button
                type="button"
                className="mk-help-btn"
                onClick={() => router.push('/chat-hub')}
              >
                Open Chat Hub →
              </button>
            </div>

            <div className="mk-filter-section">
              <h3>Provider</h3>
              <ul>
                <li>OpenAI</li>
                <li>Anthropic</li>
                <li>Google DeepMind</li>
                <li>Meta</li>
              </ul>
            </div>

            <div className="mk-filter-section">
              <h3>Pricing model</h3>
              <ul>
                <li>Pay‑per‑use</li>
                <li>Subscription</li>
                <li>Free tier</li>
              </ul>
            </div>
          </aside>

          {/* Grid of model cards */}
          <div className="mk-grid">
            {filteredModels.map((model) => (
              <article
                key={model.id}
                className="model-card"
                onClick={() => handleOpenDetails(model.id)}
              >
                <div className="card-glow" />
                <header className="card-header">
                  <div className="card-icon">✨</div>
                  <div className="card-meta">
                    <div className="card-name">{model.name}</div>
                    <div className="card-provider">{model.provider}</div>
                  </div>
                  <div className="open-source-badge">{model.tag}</div>
                </header>
                <p className="card-description">{model.description}</p>
                <div className="card-categories">
                  {model.badges.map((b) => (
                    <span key={b} className="cat-badge">
                      {b}
                    </span>
                  ))}
                </div>
                <footer className="mk-card-footer">
                  <div className="mk-rating">
                    <span>⭐ {model.rating}</span>
                    <span className="mk-rating-count">({model.reviews})</span>
                  </div>
                  <div className="mk-pricing">
                    <span>{model.inputPrice}</span>
                    <span>•</span>
                    <span>{model.outputPrice}</span>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </section>

        {showModal && activeModel && (
          <div className="modal-overlay open" role="dialog" aria-modal="true">
            <div className="modal-panel">
              <button
                type="button"
                className="modal-close"
                onClick={handleCloseDetails}
                aria-label="Close"
              >
                ×
              </button>
              <div className="modal-body">
                <div className="modal-hero">
                  <div className="modal-icon">✨</div>
                  <div className="modal-title-group">
                    <h2 className="modal-model-name">{activeModel.name}</h2>
                    <div className="modal-provider-row">
                      <span className="modal-provider-name">by {activeModel.provider}</span>
                      <span className="modal-badge badge-open">Flagship model</span>
                      <span className="modal-badge badge-api">API available</span>
                    </div>
                  </div>
                </div>

                <section className="modal-section">
                  <h3 className="modal-section-title">Example prompt → output</h3>
                  <div>
                    <p className="modal-kicker">User</p>
                    <p className="modal-description">
                      “Summarise this research paper in 3 bullet points and suggest 2 follow‑up
                      questions.”
                    </p>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <p className="modal-kicker">GPT‑5</p>
                    <ul className="modal-list">
                      <li>The paper introduces a new attention mechanism reducing compute by 40%.</li>
                      <li>Results on MMLU show 32% improvement over baseline.</li>
                      <li>Authors release code and weights under MIT license.</li>
                    </ul>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <p className="modal-kicker">Follow‑up questions:</p>
                    <ol className="modal-followup">
                      <li>How does this scale to 100B+ parameter models?</li>
                      <li>What are the trade‑offs at inference time?</li>
                    </ol>
                  </div>
                </section>

                <section className="modal-section">
                  <h3 className="modal-section-title">Benchmark scores</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-item-label">MMLU</div>
                      <div className="info-item-value">87.2</div>
                    </div>
                    <div className="info-item">
                      <div className="info-item-label">HumanEval</div>
                      <div className="info-item-value">90.2</div>
                    </div>
                    <div className="info-item">
                      <div className="info-item-label">MATH</div>
                      <div className="info-item-value">76.6</div>
                    </div>
                    <div className="info-item">
                      <div className="info-item-label">Rating</div>
                      <div className="info-item-value">4.7 ★</div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

