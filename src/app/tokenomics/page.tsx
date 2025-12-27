'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  WalletIcon,
  ChartPieIcon,
  CalculatorIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

// Default values - easily tweakable
const DEFAULT_VALUES = {
  // Token Distribution (percentages, must sum to 100)
  founderAllocation: 15,
  treasuryAllocation: 35,
  communityAllocation: 10,
  liquidityAllocation: 10,
  publicSaleAllocation: 30,

  // Token Details
  totalSupply: 1_000_000_000,
  initialTokenPrice: 0.001,

  // Vesting
  founderVestingYears: 3,

  // Revenue Splits (percentages)
  chatCharacterSplit: 50,
  chatTreasurySplit: 30,
  chatProtocolSplit: 20,

  tipCharacterSplit: 70,
  tipTreasurySplit: 20,
  tipProtocolSplit: 10,

  mintTreasurySplit: 40,
  mintFounderSplit: 40,
  mintLiquiditySplit: 20,

  // Pricing
  chatPriceUSD: 0.25,
  avgTipUSD: 5,
  characterMintPriceETH: 0.1,
  ethPrice: 3500,

  // Projections
  monthlyActiveUsers: 10000,
  chatsPerUserPerMonth: 20,
  tipsPerUserPerMonth: 2,
  characterMintsPerMonth: 10,

  // Founder needs
  founderMonthlyNeed: 20000,
};

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function formatUSD(num: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = '%',
  description,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <span className="text-sm font-bold text-white">{value.toLocaleString()}{suffix}</span>
      </div>
      {description && <p className="text-xs text-text-tertiary mb-2">{description}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  description,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-text-secondary block mb-1">{label}</label>
      {description && <p className="text-xs text-text-tertiary mb-2">{description}</p>}
      <div className="flex items-center gap-2">
        {prefix && <span className="text-text-tertiary">{prefix}</span>}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-background border border-white/10 rounded-lg px-3 py-2 text-white text-right focus:outline-none focus:border-cosmic-500"
        />
        {suffix && <span className="text-text-tertiary">{suffix}</span>}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color = 'cosmic'
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  color?: 'cosmic' | 'accent' | 'energy' | 'green' | 'red';
}) {
  const colorClasses = {
    cosmic: 'from-cosmic-500/20 to-cosmic-900/20 border-cosmic-500/30',
    accent: 'from-accent-500/20 to-accent-900/20 border-accent-500/30',
    energy: 'from-energy-500/20 to-energy-900/20 border-energy-500/30',
    green: 'from-green-500/20 to-green-900/20 border-green-500/30',
    red: 'from-red-500/20 to-red-900/20 border-red-500/30',
  };
  const iconColors = {
    cosmic: 'text-cosmic-400',
    accent: 'text-accent-400',
    energy: 'text-energy-400',
    green: 'text-green-400',
    red: 'text-red-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${iconColors[color]}`} />
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subValue && <div className="text-xs text-text-tertiary mt-1">{subValue}</div>}
    </div>
  );
}

function AllocationBar({
  allocations
}: {
  allocations: { label: string; value: number; color: string }[]
}) {
  return (
    <div className="space-y-2">
      <div className="h-8 rounded-lg overflow-hidden flex">
        {allocations.map((item, i) => (
          <div
            key={i}
            className={`${item.color} flex items-center justify-center text-xs font-medium text-white`}
            style={{ width: `${item.value}%` }}
          >
            {item.value >= 10 && `${item.value}%`}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {allocations.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${item.color}`} />
            <span className="text-xs text-text-secondary">{item.label}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TokenomicsPage() {
  const [values, setValues] = useState(DEFAULT_VALUES);

  const updateValue = (key: keyof typeof DEFAULT_VALUES, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  // Calculated values
  const calculations = useMemo(() => {
    const {
      founderAllocation, treasuryAllocation, totalSupply, initialTokenPrice, founderVestingYears,
      chatCharacterSplit, chatTreasurySplit, chatProtocolSplit,
      tipCharacterSplit, tipTreasurySplit, tipProtocolSplit,
      mintTreasurySplit, mintFounderSplit,
      chatPriceUSD, avgTipUSD, characterMintPriceETH, ethPrice,
      monthlyActiveUsers, chatsPerUserPerMonth, tipsPerUserPerMonth, characterMintsPerMonth,
      founderMonthlyNeed,
    } = values;

    // Token values
    const founderTokens = totalSupply * (founderAllocation / 100);
    const treasuryTokens = totalSupply * (treasuryAllocation / 100);
    const founderTokensPerMonth = founderTokens / (founderVestingYears * 12);
    const founderTokenValueAtLaunch = founderTokens * initialTokenPrice;

    // Monthly volume calculations
    const monthlyChats = monthlyActiveUsers * chatsPerUserPerMonth;
    const monthlyChatRevenue = monthlyChats * chatPriceUSD;

    const monthlyTips = monthlyActiveUsers * tipsPerUserPerMonth;
    const monthlyTipRevenue = monthlyTips * avgTipUSD;

    const monthlyMintRevenue = characterMintsPerMonth * characterMintPriceETH * ethPrice;

    const totalMonthlyRevenue = monthlyChatRevenue + monthlyTipRevenue + monthlyMintRevenue;

    // Revenue splits
    const founderFromChat = monthlyChatRevenue * (chatProtocolSplit / 100);
    const founderFromTips = monthlyTipRevenue * (tipProtocolSplit / 100);
    const founderFromMints = monthlyMintRevenue * (mintFounderSplit / 100);
    const founderMonthlyRevenue = founderFromChat + founderFromTips + founderFromMints;

    const treasuryFromChat = monthlyChatRevenue * (chatTreasurySplit / 100);
    const treasuryFromTips = monthlyTipRevenue * (tipTreasurySplit / 100);
    const treasuryFromMints = monthlyMintRevenue * (mintTreasurySplit / 100);
    const treasuryMonthlyRevenue = treasuryFromChat + treasuryFromTips + treasuryFromMints;

    const characterFromChat = monthlyChatRevenue * (chatCharacterSplit / 100);
    const characterFromTips = monthlyTipRevenue * (tipCharacterSplit / 100);
    const characterMonthlyRevenue = characterFromChat + characterFromTips;

    // Users needed to hit founder goal
    const revenuePerUser = (chatsPerUserPerMonth * chatPriceUSD * (chatProtocolSplit / 100)) +
                          (tipsPerUserPerMonth * avgTipUSD * (tipProtocolSplit / 100));
    const usersNeededForGoal = Math.ceil(founderMonthlyNeed / revenuePerUser);

    // Founder meets goal?
    const founderMeetsGoal = founderMonthlyRevenue >= founderMonthlyNeed;
    const founderGap = founderMonthlyNeed - founderMonthlyRevenue;

    return {
      founderTokens,
      treasuryTokens,
      founderTokensPerMonth,
      founderTokenValueAtLaunch,
      monthlyChats,
      monthlyChatRevenue,
      monthlyTips,
      monthlyTipRevenue,
      monthlyMintRevenue,
      totalMonthlyRevenue,
      founderMonthlyRevenue,
      treasuryMonthlyRevenue,
      characterMonthlyRevenue,
      founderFromChat,
      founderFromTips,
      founderFromMints,
      usersNeededForGoal,
      founderMeetsGoal,
      founderGap,
      revenuePerUser,
    };
  }, [values]);

  const tokenAllocations = [
    { label: 'Founder', value: values.founderAllocation, color: 'bg-cosmic-500' },
    { label: 'Treasury', value: values.treasuryAllocation, color: 'bg-accent-500' },
    { label: 'Community', value: values.communityAllocation, color: 'bg-energy-500' },
    { label: 'Liquidity', value: values.liquidityAllocation, color: 'bg-blue-500' },
    { label: 'Public Sale', value: values.publicSaleAllocation, color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -m-2 rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <ChartPieIcon className="w-6 h-6 text-cosmic-400" />
                Tokenomics Calculator
              </h1>
              <p className="text-sm text-text-tertiary">Interactive model - adjust values to see projections</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setValues(DEFAULT_VALUES)}
              className="px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors"
            >
              Reset to Defaults
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-cosmic-500 hover:bg-cosmic-600 text-white font-medium rounded-lg transition-colors"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-cosmic-400" />
            Key Projections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={CurrencyDollarIcon}
              label="Monthly Revenue"
              value={formatUSD(calculations.totalMonthlyRevenue)}
              subValue={`${formatNumber(values.monthlyActiveUsers)} users`}
              color="cosmic"
            />
            <StatCard
              icon={WalletIcon}
              label="Founder Revenue"
              value={formatUSD(calculations.founderMonthlyRevenue)}
              subValue={calculations.founderMeetsGoal ? '✓ Meets goal' : `${formatUSD(calculations.founderGap)} short`}
              color={calculations.founderMeetsGoal ? 'green' : 'red'}
            />
            <StatCard
              icon={BuildingLibraryIcon}
              label="Treasury Revenue"
              value={formatUSD(calculations.treasuryMonthlyRevenue)}
              subValue="For culture & grants"
              color="accent"
            />
            <StatCard
              icon={UserGroupIcon}
              label="Users Needed"
              value={formatNumber(calculations.usersNeededForGoal)}
              subValue={`To hit ${formatUSD(values.founderMonthlyNeed)}/mo`}
              color="energy"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Inputs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Token Distribution */}
            <div className="bg-background-secondary rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ChartPieIcon className="w-5 h-5 text-cosmic-400" />
                Token Distribution
              </h3>
              <Slider
                label="Founder/Team"
                value={values.founderAllocation}
                onChange={(v) => updateValue('founderAllocation', v)}
                description="Vested over time"
              />
              <Slider
                label="Treasury (DAO)"
                value={values.treasuryAllocation}
                onChange={(v) => updateValue('treasuryAllocation', v)}
                description="Community-governed"
              />
              <Slider
                label="Community/Airdrop"
                value={values.communityAllocation}
                onChange={(v) => updateValue('communityAllocation', v)}
              />
              <Slider
                label="Liquidity Pool"
                value={values.liquidityAllocation}
                onChange={(v) => updateValue('liquidityAllocation', v)}
              />
              <Slider
                label="Public Sale"
                value={values.publicSaleAllocation}
                onChange={(v) => updateValue('publicSaleAllocation', v)}
              />
              <div className={`text-sm mt-2 ${
                tokenAllocations.reduce((a, b) => a + b.value, 0) === 100
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                Total: {tokenAllocations.reduce((a, b) => a + b.value, 0)}%
                {tokenAllocations.reduce((a, b) => a + b.value, 0) !== 100 && ' (must equal 100%)'}
              </div>
            </div>

            {/* Revenue Splits */}
            <div className="bg-background-secondary rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-accent-400" />
                Revenue Splits
              </h3>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Chat Revenue</h4>
                <Slider label="→ Character" value={values.chatCharacterSplit} onChange={(v) => updateValue('chatCharacterSplit', v)} />
                <Slider label="→ Treasury" value={values.chatTreasurySplit} onChange={(v) => updateValue('chatTreasurySplit', v)} />
                <Slider label="→ Protocol (You)" value={values.chatProtocolSplit} onChange={(v) => updateValue('chatProtocolSplit', v)} />
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Tip Revenue</h4>
                <Slider label="→ Character" value={values.tipCharacterSplit} onChange={(v) => updateValue('tipCharacterSplit', v)} />
                <Slider label="→ Treasury" value={values.tipTreasurySplit} onChange={(v) => updateValue('tipTreasurySplit', v)} />
                <Slider label="→ Protocol (You)" value={values.tipProtocolSplit} onChange={(v) => updateValue('tipProtocolSplit', v)} />
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">Mint Revenue</h4>
                <Slider label="→ Treasury" value={values.mintTreasurySplit} onChange={(v) => updateValue('mintTreasurySplit', v)} />
                <Slider label="→ Founder" value={values.mintFounderSplit} onChange={(v) => updateValue('mintFounderSplit', v)} />
                <Slider label="→ Liquidity" value={values.mintLiquiditySplit} onChange={(v) => updateValue('mintLiquiditySplit', v)} />
              </div>
            </div>
          </div>

          {/* Middle: Pricing & Volume */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pricing */}
            <div className="bg-background-secondary rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-energy-400" />
                Pricing
              </h3>
              <NumberInput
                label="Chat Price"
                value={values.chatPriceUSD}
                onChange={(v) => updateValue('chatPriceUSD', v)}
                prefix="$"
                suffix="per message"
                step={0.05}
                min={0.01}
                max={5}
              />
              <NumberInput
                label="Average Tip"
                value={values.avgTipUSD}
                onChange={(v) => updateValue('avgTipUSD', v)}
                prefix="$"
                step={1}
                min={1}
                max={100}
              />
              <NumberInput
                label="Character Mint Price"
                value={values.characterMintPriceETH}
                onChange={(v) => updateValue('characterMintPriceETH', v)}
                suffix="ETH"
                step={0.01}
                min={0.01}
                max={10}
              />
              <NumberInput
                label="ETH Price (USD)"
                value={values.ethPrice}
                onChange={(v) => updateValue('ethPrice', v)}
                prefix="$"
                step={100}
                min={1000}
                max={10000}
              />
            </div>

            {/* Volume Projections */}
            <div className="bg-background-secondary rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-green-400" />
                Volume Projections
              </h3>
              <NumberInput
                label="Monthly Active Users"
                value={values.monthlyActiveUsers}
                onChange={(v) => updateValue('monthlyActiveUsers', v)}
                step={1000}
                min={100}
                max={1000000}
              />
              <NumberInput
                label="Chats per User/Month"
                value={values.chatsPerUserPerMonth}
                onChange={(v) => updateValue('chatsPerUserPerMonth', v)}
                step={5}
                min={1}
                max={200}
              />
              <NumberInput
                label="Tips per User/Month"
                value={values.tipsPerUserPerMonth}
                onChange={(v) => updateValue('tipsPerUserPerMonth', v)}
                step={1}
                min={0}
                max={50}
              />
              <NumberInput
                label="Character Mints/Month"
                value={values.characterMintsPerMonth}
                onChange={(v) => updateValue('characterMintsPerMonth', v)}
                step={1}
                min={0}
                max={100}
              />
            </div>

            {/* Founder Goal */}
            <div className="bg-background-secondary rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CalculatorIcon className="w-5 h-5 text-red-400" />
                Founder Goal
              </h3>
              <NumberInput
                label="Monthly Income Need"
                value={values.founderMonthlyNeed}
                onChange={(v) => updateValue('founderMonthlyNeed', v)}
                prefix="$"
                step={1000}
                min={1000}
                max={100000}
                description="Your target monthly income"
              />
              <NumberInput
                label="Vesting Period"
                value={values.founderVestingYears}
                onChange={(v) => updateValue('founderVestingYears', v)}
                suffix="years"
                step={1}
                min={1}
                max={5}
              />
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-1 space-y-6">
            {/* Token Allocation Visual */}
            <div className="bg-background-secondary rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Token Allocation</h3>
              <AllocationBar allocations={tokenAllocations} />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Supply</span>
                  <span className="text-white font-medium">{formatNumber(values.totalSupply)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Your Tokens</span>
                  <span className="text-white font-medium">{formatNumber(calculations.founderTokens)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Tokens/Month (vested)</span>
                  <span className="text-white font-medium">{formatNumber(calculations.founderTokensPerMonth)}</span>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-background-secondary rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Monthly Revenue Breakdown</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Chat Revenue</span>
                    <span className="text-white">{formatUSD(calculations.monthlyChatRevenue)}</span>
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {formatNumber(calculations.monthlyChats)} messages × ${values.chatPriceUSD}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Tip Revenue</span>
                    <span className="text-white">{formatUSD(calculations.monthlyTipRevenue)}</span>
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {formatNumber(calculations.monthlyTips)} tips × ${values.avgTipUSD} avg
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Mint Revenue</span>
                    <span className="text-white">{formatUSD(calculations.monthlyMintRevenue)}</span>
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {values.characterMintsPerMonth} mints × {values.characterMintPriceETH} ETH
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-white">Total Monthly</span>
                    <span className="text-cosmic-400">{formatUSD(calculations.totalMonthlyRevenue)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Take */}
            <div className={`rounded-2xl p-6 border ${
              calculations.founderMeetsGoal
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <h3 className="text-lg font-bold text-white mb-4">
                {calculations.founderMeetsGoal ? '✓ You Hit Your Goal!' : '✗ Gap to Goal'}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">From Chat ({values.chatProtocolSplit}%)</span>
                  <span className="text-white">{formatUSD(calculations.founderFromChat)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">From Tips ({values.tipProtocolSplit}%)</span>
                  <span className="text-white">{formatUSD(calculations.founderFromTips)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">From Mints ({values.mintFounderSplit}%)</span>
                  <span className="text-white">{formatUSD(calculations.founderFromMints)}</span>
                </div>
                <div className="pt-3 border-t border-white/20">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Your Monthly Total</span>
                    <span className={calculations.founderMeetsGoal ? 'text-green-400' : 'text-red-400'}>
                      {formatUSD(calculations.founderMonthlyRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-text-tertiary">Your Goal</span>
                    <span className="text-text-tertiary">{formatUSD(values.founderMonthlyNeed)}</span>
                  </div>
                </div>

                {!calculations.founderMeetsGoal && (
                  <div className="mt-4 p-3 bg-background/50 rounded-lg">
                    <p className="text-sm text-text-secondary">
                      Need <strong className="text-white">{formatNumber(calculations.usersNeededForGoal)} users</strong> at current rates to hit your goal.
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      Each user generates ~{formatUSD(calculations.revenuePerUser)}/mo for you
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Annual Projections */}
            <div className="bg-background-secondary rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Annual Projections</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Your Annual Revenue</span>
                  <span className="text-white font-medium">{formatUSD(calculations.founderMonthlyRevenue * 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Treasury Annual</span>
                  <span className="text-white font-medium">{formatUSD(calculations.treasuryMonthlyRevenue * 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Characters Annual</span>
                  <span className="text-white font-medium">{formatUSD(calculations.characterMonthlyRevenue * 12)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-text-secondary">Total Annual</span>
                  <span className="text-cosmic-400 font-bold">{formatUSD(calculations.totalMonthlyRevenue * 12)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-background-secondary rounded-xl border border-white/10 text-center">
          <p className="text-sm text-text-tertiary">
            This is a projection tool. Actual results depend on user adoption, market conditions, and execution.
            <br />
            Share this page with potential investors to discuss tokenomics.
          </p>
        </div>
      </main>

      {/* Custom slider styles */}
      <style jsx global>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          cursor: pointer;
          border: 2px solid white;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
}
