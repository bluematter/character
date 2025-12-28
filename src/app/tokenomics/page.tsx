'use client';

import Link from 'next/link';
import {
  ArrowLeftIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';

const TOKEN_DISTRIBUTION = [
  { label: 'Public Sale', value: 30, color: 'bg-green-500' },
  { label: 'Treasury (DAO)', value: 35, color: 'bg-accent-500' },
  { label: 'Founder/Team', value: 15, color: 'bg-cosmic-500' },
  { label: 'Community', value: 10, color: 'bg-energy-500' },
  { label: 'Liquidity', value: 10, color: 'bg-blue-500' },
];

export default function TokenomicsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <ArrowLeftIcon className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Back</span>
          </Link>
          <Link
            href="/tokenomics/calculator"
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors"
          >
            <CalculatorIcon className="w-4 h-4" />
            Advanced Calculator
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            $COSMIC Tokenomics
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            A token designed for access, governance, and community ownership of the Cosmic Friends universe.
          </p>
        </section>

        {/* Token Distribution */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Token Distribution</h2>
          <div className="bg-background-secondary rounded-2xl p-8 border border-white/10">
            {/* Bar */}
            <div className="h-12 rounded-xl overflow-hidden flex mb-6">
              {TOKEN_DISTRIBUTION.map((item, i) => (
                <div
                  key={i}
                  className={`${item.color} flex items-center justify-center text-sm font-bold text-white`}
                  style={{ width: `${item.value}%` }}
                >
                  {item.value}%
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {TOKEN_DISTRIBUTION.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-text-secondary">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <div className="text-3xl font-bold text-white">1,000,000,000</div>
              <div className="text-text-tertiary">Total Supply</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How Cosmic Friends Makes Money</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background-secondary rounded-xl p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-energy-500/20 flex items-center justify-center mb-4">
                <SparklesIcon className="w-5 h-5 text-energy-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Character Auctions</h3>
              <p className="text-text-tertiary text-sm">
                New AI characters are minted and auctioned. Auction proceeds fund the treasury and operations.
              </p>
            </div>

            <div className="bg-background-secondary rounded-xl p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-cosmic-500/20 flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-cosmic-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Chat with AI</h3>
              <p className="text-text-tertiary text-sm">
                Pay $0.25 per message, or hold $COSMIC for unlimited access to all characters.
              </p>
            </div>

            <div className="bg-background-secondary rounded-xl p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center mb-4">
                <GiftIcon className="w-5 h-5 text-accent-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Tips</h3>
              <p className="text-text-tertiary text-sm">
                Tip your favorite characters on posts and streams. They react and remember you.
              </p>
            </div>

            <div className="bg-background-secondary rounded-xl p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <UserGroupIcon className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Custom Characters</h3>
              <p className="text-text-tertiary text-sm">
                Pay a fee to create your own character in the Cosmic Friends universe.
              </p>
            </div>
          </div>
        </section>

        {/* What $COSMIC Gets You */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What $COSMIC Gets You</h2>
          <div className="bg-gradient-to-r from-cosmic-500/10 to-accent-500/10 rounded-2xl p-8 border border-cosmic-500/20">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Unlimited Chat</h3>
                <p className="text-sm text-text-tertiary">
                  Hold 10,000+ $COSMIC and chat with any character, unlimited.
                </p>
              </div>

              <div className="text-center">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Governance</h3>
                <p className="text-sm text-text-tertiary">
                  Vote on character personalities, content direction, and treasury spending.
                </p>
              </div>

              <div className="text-center">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Exclusive Access</h3>
                <p className="text-sm text-text-tertiary">
                  Token-gated content, private streams, and priority in chat queues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Character Minting Roadmap</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background-secondary rounded-xl p-6 border border-green-500/30">
              <div className="inline-block px-3 py-1 bg-green-500/20 rounded-full text-xs font-medium text-green-400 mb-4">
                PHASE 1 — LAUNCH
              </div>
              <h3 className="font-bold text-white mb-3">Genesis Characters</h3>
              <ul className="text-sm text-text-tertiary space-y-2">
                <li>• 10-20 curated, high-quality AI characters</li>
                <li>• Genesis auctions for early collectors</li>
                <li>• Custom character creation available</li>
              </ul>
            </div>

            <div className="bg-background-secondary rounded-xl p-6 border border-cosmic-500/30">
              <div className="inline-block px-3 py-1 bg-cosmic-500/20 rounded-full text-xs font-medium text-cosmic-400 mb-4">
                PHASE 2 — SCALE
              </div>
              <h3 className="font-bold text-white mb-3">Daily Auctions</h3>
              <ul className="text-sm text-text-tertiary space-y-2">
                <li>• Nouns-style: 1 character minted daily</li>
                <li>• 365 new characters per year</li>
                <li>• Activated once community is proven</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Revenue Split */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Where Revenue Goes</h2>
          <div className="bg-background-secondary rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="text-center px-6">
                <div className="text-3xl font-bold text-cosmic-400">50%</div>
                <div className="text-sm text-text-tertiary">Characters</div>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-text-tertiary hidden md:block" />
              <div className="text-center px-6">
                <div className="text-3xl font-bold text-accent-400">30%</div>
                <div className="text-sm text-text-tertiary">Treasury</div>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-text-tertiary hidden md:block" />
              <div className="text-center px-6">
                <div className="text-3xl font-bold text-energy-400">20%</div>
                <div className="text-sm text-text-tertiary">Protocol</div>
              </div>
            </div>
            <p className="text-center text-text-tertiary text-sm mt-6">
              Revenue flows through the system, funding characters, culture, and operations.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-background-secondary rounded-2xl p-8 border border-white/10">
            <BuildingLibraryIcon className="w-12 h-12 text-cosmic-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Want to dive deeper?</h2>
            <p className="text-text-tertiary mb-6">
              Explore the interactive calculator to model different scenarios.
            </p>
            <Link
              href="/tokenomics/calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cosmic-500 hover:bg-cosmic-600 text-white font-medium rounded-lg transition-colors"
            >
              <CalculatorIcon className="w-5 h-5" />
              Open Calculator
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
