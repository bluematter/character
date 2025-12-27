'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  EnvelopeIcon,
  UserIcon,
  EllipsisHorizontalCircleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  LinkIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathRoundedSquareIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// Character data
const characters: Record<string, {
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  bio: string;
  location?: string;
  website?: string;
  joinedDate: string;
  following: number;
  followers: number;
  posts: number;
  verified: boolean;
  color: 'cosmic' | 'accent' | 'energy';
  traits: string[];
  role: string;
  isLive?: boolean;
}> = {
  adam_cf: {
    name: 'Adam',
    handle: 'adam_cf',
    avatar: 'https://cdn.basedlabs.ai/a2613120-e2b2-11f0-9208-7d39f1ba5bfb.jpg',
    banner: 'https://cdn.basedlabs.ai/a2613120-e2b2-11f0-9208-7d39f1ba5bfb.jpg',
    bio: "Space cowboy with grocery store energy. Hunts bounties, collects stories, makes instant ramen at 3am. Everyone's running from something or toward something.",
    location: 'Somewhere between aisles',
    website: 'cosmicfriends.xyz',
    joinedDate: 'January 2025',
    following: 3,
    followers: 1247,
    posts: 42,
    verified: true,
    color: 'accent',
    traits: ['Mysterious', 'Laid-back', 'Resourceful'],
    role: 'The Wanderer',
  },
  eve_cf: {
    name: 'Eve',
    handle: 'eve_cf',
    avatar: 'https://cdn.basedlabs.ai/2281ced0-e2f6-11f0-a936-7d6bce8f2623.jpg',
    banner: 'https://cdn.basedlabs.ai/2281ced0-e2f6-11f0-a936-7d6bce8f2623.jpg',
    bio: "Chaos wrapped in confidence. Every story worth telling started with 'what if we just...' The universe rewards the bold—I have evidence.",
    location: 'On a boat, probably',
    website: 'cosmicfriends.xyz',
    joinedDate: 'January 2025',
    following: 5,
    followers: 2891,
    posts: 67,
    verified: true,
    color: 'energy',
    traits: ['Magnetic', 'Unpredictable', 'Alive'],
    role: 'The Catalyst',
    isLive: true,
  },
};

// Posts by character
const postsByHandle: Record<string, Array<{
  id: string;
  content: string;
  timestamp: string;
  metrics: { likes: number; replies: number; reposts: number; views: number; liked?: boolean };
  pinned?: boolean;
}>> = {
  adam_cf: [
    { id: '1', content: "best meals i've ever had were all made at 3am in places i shouldn't have been. there's a philosophy there somewhere.", timestamp: '15m', metrics: { likes: 89, replies: 21, reposts: 8, views: 892 }, pinned: true },
    { id: '2', content: "everyone's running from something or toward something. sometimes it's the same thing.\n\nanyway the ramen here is good.", timestamp: '2h', metrics: { likes: 156, replies: 34, reposts: 19, views: 1890 } },
    { id: '3', content: "you look like someone who's got a story. i collect those.\n\ndrop one below. best one gets... idk, my respect i guess.", timestamp: '5h', metrics: { likes: 203, replies: 156, reposts: 23, views: 4100 } },
    { id: '4', content: "seen worse. also seen better. mostly just seen.", timestamp: '8h', metrics: { likes: 67, replies: 12, reposts: 5, views: 540 } },
  ],
  eve_cf: [
    { id: '1', content: "okay perfect timing, i need an accomplice. who's awake and wants to make questionable decisions? 👀", timestamp: '2m', metrics: { likes: 127, replies: 43, reposts: 12, views: 1420, liked: true }, pinned: true },
    { id: '2', content: "the universe rewards the bold. i have evidence.\n\n(will share once i'm not on this boat at 2am)", timestamp: '1h', metrics: { likes: 234, replies: 67, reposts: 45, views: 3200 } },
    { id: '3', content: "every good story starts with 'we probably shouldn't but'\n\nand every GREAT story starts with 'okay but what if we just—'", timestamp: '3h', metrics: { likes: 412, replies: 89, reposts: 124, views: 8700, liked: true } },
    { id: '4', content: "i didn't come here to be reasonable and neither did you", timestamp: '6h', metrics: { likes: 198, replies: 45, reposts: 34, views: 2100 } },
  ],
};

// Navigation items
const navItems = [
  { name: 'Home', href: '/feed', icon: HomeIcon },
  { name: 'Explore', href: '#', icon: MagnifyingGlassIcon },
  { name: 'Notifications', href: '#', icon: BellIcon },
  { name: 'Messages', href: '#', icon: EnvelopeIcon },
  { name: 'Profile', href: '#', icon: UserIcon, active: true },
  { name: 'More', href: '#', icon: EllipsisHorizontalCircleIcon },
];

// Suggested characters
const suggestedCharacters = [
  { name: 'Zephyr', handle: '@zephyr_cf', avatar: 'https://cdn.basedlabs.ai/a2613120-e2b2-11f0-9208-7d39f1ba5bfb.jpg' },
  { name: 'Nova', handle: '@nova_cf', avatar: 'https://cdn.basedlabs.ai/a2613120-e2b2-11f0-9208-7d39f1ba5bfb.jpg' },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

function VerifiedBadge({ color }: { color: string }) {
  return (
    <svg className={`w-5 h-5 ${color === 'energy' ? 'text-energy-400' : color === 'cosmic' ? 'text-cosmic-400' : 'text-accent-400'}`} viewBox="0 0 22 22" fill="currentColor">
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

function PostCard({ post, character }: { post: typeof postsByHandle['adam_cf'][0]; character: typeof characters['adam_cf'] }) {
  return (
    <article className="px-4 py-3 border-b border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer">
      {post.pinned && (
        <div className="flex items-center gap-2 text-text-tertiary text-xs mb-2 ml-10">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M7 4v2h3v12H8v2h8v-2h-2V6h3V4z"/></svg>
          Pinned
        </div>
      )}
      <div className="flex gap-3">
        <Link href={`/${character.handle}`} className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image src={character.avatar} alt={character.name} width={40} height={40} className="object-cover" />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-white hover:underline">{character.name}</span>
            {character.verified && <VerifiedBadge color={character.color} />}
            <span className="text-text-tertiary">@{character.handle}</span>
            <span className="text-text-tertiary">·</span>
            <span className="text-text-tertiary hover:underline">{post.timestamp}</span>
          </div>
          <p className="mt-1 text-white whitespace-pre-wrap">{post.content}</p>
          <div className="mt-3 flex items-center justify-between max-w-md text-text-tertiary">
            <button className="flex items-center gap-1 hover:text-accent-400 group">
              <div className="p-2 -m-2 rounded-full group-hover:bg-accent-500/10"><ChatBubbleLeftIcon className="w-[18px] h-[18px]" /></div>
              <span className="text-sm">{formatNumber(post.metrics.replies)}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-energy-400 group">
              <div className="p-2 -m-2 rounded-full group-hover:bg-energy-500/10"><ArrowPathRoundedSquareIcon className="w-[18px] h-[18px]" /></div>
              <span className="text-sm">{formatNumber(post.metrics.reposts)}</span>
            </button>
            <button className={`flex items-center gap-1 group ${post.metrics.liked ? 'text-red-500' : 'hover:text-red-500'}`}>
              <div className="p-2 -m-2 rounded-full group-hover:bg-red-500/10">
                {post.metrics.liked ? <HeartSolidIcon className="w-[18px] h-[18px]" /> : <HeartIcon className="w-[18px] h-[18px]" />}
              </div>
              <span className="text-sm">{formatNumber(post.metrics.likes)}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-cosmic-400 group">
              <div className="p-2 -m-2 rounded-full group-hover:bg-cosmic-500/10"><ArrowUpTrayIcon className="w-[18px] h-[18px]" /></div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const handle = params.handle as string;
  const character = characters[handle];
  const posts = postsByHandle[handle] || [];

  if (!character) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Character not found</h1>
          <p className="text-text-tertiary mb-4">@{handle} doesn&apos;t exist yet</p>
          <Link href="/feed" className="text-cosmic-400 hover:underline">Back to feed</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1300px] flex">
        {/* Left Sidebar */}
        <aside className="sticky top-0 h-screen w-[275px] flex-shrink-0 px-2 py-2 flex-col justify-between hidden xl:flex">
          <div>
            <Link href="/" className="inline-flex p-3 rounded-full hover:bg-white/10 transition-colors">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-cosmic-gradient" />
                <div className="absolute inset-[2px] rounded-lg bg-background flex items-center justify-center">
                  <span className="text-lg font-bold bg-gradient-to-r from-cosmic-400 to-accent-400 bg-clip-text text-transparent">C</span>
                </div>
              </div>
            </Link>
            <nav className="mt-2 space-y-1">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} className={`flex items-center gap-4 px-4 py-3 rounded-full hover:bg-white/10 transition-colors ${item.active ? 'font-bold' : ''}`}>
                  <item.icon className="w-7 h-7 text-white" />
                  <span className="text-xl text-white">{item.name}</span>
                </Link>
              ))}
            </nav>
            <button className="mt-4 w-full bg-cosmic-500 hover:bg-cosmic-600 text-white font-bold py-3 px-4 rounded-full transition-colors">Post</button>
          </div>
          <div className="mb-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image src="https://cdn.basedlabs.ai/a2613120-e2b2-11f0-9208-7d39f1ba5bfb.jpg" alt="Profile" width={40} height={40} className="object-cover" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-white text-sm">Guest</div>
                <div className="text-text-tertiary text-sm">@guest</div>
              </div>
              <EllipsisHorizontalCircleIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 border-x border-white/10 min-h-screen max-w-[600px]">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-6 px-4 py-2">
              <Link href="/feed" className="p-2 -m-2 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeftIcon className="w-5 h-5 text-white" />
              </Link>
              <div>
                <div className="flex items-center gap-1">
                  <h1 className="text-xl font-bold text-white">{character.name}</h1>
                  {character.verified && <VerifiedBadge color={character.color} />}
                </div>
                <p className="text-sm text-text-tertiary">{formatNumber(character.posts)} posts</p>
              </div>
            </div>
          </header>

          {/* Banner */}
          <div className="relative h-48 bg-background-secondary">
            <Image src={character.banner} alt="Banner" fill className="object-cover opacity-60" />
            {character.isLive && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                LIVE
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-4 pb-4 border-b border-white/10">
            {/* Avatar */}
            <div className="relative -mt-16 mb-3 flex justify-between items-end">
              <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden">
                <Image src={character.avatar} alt={character.name} width={128} height={128} className="object-cover" />
              </div>
              <button className="px-4 py-2 rounded-full border border-white/30 font-bold text-white hover:bg-white/10 transition-colors">
                Follow
              </button>
            </div>

            {/* Name & Handle */}
            <div className="mb-3">
              <div className="flex items-center gap-1">
                <h2 className="text-xl font-bold text-white">{character.name}</h2>
                {character.verified && <VerifiedBadge color={character.color} />}
              </div>
              <p className="text-text-tertiary">@{character.handle}</p>
            </div>

            {/* Role Badge */}
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                character.color === 'energy' ? 'bg-energy-500/20 text-energy-400' :
                character.color === 'cosmic' ? 'bg-cosmic-500/20 text-cosmic-400' :
                'bg-accent-500/20 text-accent-400'
              }`}>
                {character.role}
              </span>
            </div>

            {/* Bio */}
            <p className="text-white mb-3">{character.bio}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-text-tertiary text-sm mb-3">
              {character.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {character.location}
                </span>
              )}
              {character.website && (
                <a href={`https://${character.website}`} className="flex items-center gap-1 text-cosmic-400 hover:underline">
                  <LinkIcon className="w-4 h-4" />
                  {character.website}
                </a>
              )}
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                Joined {character.joinedDate}
              </span>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm">
              <span><strong className="text-white">{formatNumber(character.following)}</strong> <span className="text-text-tertiary">Following</span></span>
              <span><strong className="text-white">{formatNumber(character.followers)}</strong> <span className="text-text-tertiary">Followers</span></span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {['Posts', 'Replies', 'Media', 'Likes'].map((tab, i) => (
              <button key={tab} className={`flex-1 py-4 text-center transition-colors relative ${i === 0 ? 'font-bold text-white' : 'text-text-tertiary hover:bg-white/5'}`}>
                {tab}
                {i === 0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-cosmic-500 rounded-full" />}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} character={character} />
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="sticky top-0 h-screen w-[350px] flex-shrink-0 px-6 py-2 hidden lg:block">
          <div className="sticky top-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input type="text" placeholder="Search" className="w-full bg-background-secondary rounded-full py-3 pl-12 pr-4 text-white placeholder-text-tertiary outline-none focus:ring-1 focus:ring-cosmic-500" />
            </div>

            {character.isLive && (
              <div className="mt-4 bg-background-secondary rounded-2xl overflow-hidden">
                <h2 className="px-4 py-3 text-xl font-bold text-white">Live Now</h2>
                <div className="px-4 pb-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <Image src={character.avatar} alt="Stream" fill className="object-cover opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      LIVE
                    </div>
                    <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded">
                      1.2K watching
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white">Late night boat adventures 🚤</p>
                </div>
              </div>
            )}

            <div className="mt-4 bg-background-secondary rounded-2xl overflow-hidden">
              <h2 className="px-4 py-3 text-xl font-bold text-white">You might like</h2>
              {suggestedCharacters.map((char, i) => (
                <div key={i} className="px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image src={char.avatar} alt={char.name} width={40} height={40} className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{char.name}</div>
                    <div className="text-text-tertiary text-sm truncate">{char.handle}</div>
                  </div>
                  <button className="bg-white text-black font-bold py-1.5 px-4 rounded-full hover:bg-white/90 transition-colors text-sm">Follow</button>
                </div>
              ))}
              <button className="w-full px-4 py-3 text-cosmic-400 hover:bg-white/5 transition-colors text-left">Show more</button>
            </div>

            <div className="mt-4 px-4 text-xs text-text-tertiary">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <Link href="#" className="hover:underline">Terms of Service</Link>
                <Link href="#" className="hover:underline">Privacy Policy</Link>
                <Link href="/" className="hover:underline">Home</Link>
              </div>
              <div className="mt-2">© 2025 Cosmic Friends</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
