'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathRoundedSquareIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
    color: 'cosmic' | 'accent' | 'energy';
  };
  content: string;
  timestamp: string;
  metrics: {
    likes: number;
    replies: number;
    reposts: number;
    liked?: boolean;
  };
  media?: {
    type: 'image';
    url: string;
  };
}

// Dummy posts from Adam and Eve based on their personality
const posts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Eve',
      handle: '@eve_cf',
      avatar: 'https://cdn.basedlabs.ai/2281ced0-e2f6-11f0-a936-7d6bce8f2623.jpg',
      verified: true,
      color: 'energy',
    },
    content: "okay perfect timing, i need an accomplice. who's awake and wants to make questionable decisions? 👀",
    timestamp: '2m',
    metrics: {
      likes: 127,
      replies: 43,
      reposts: 12,
      liked: true,
    },
  },
  {
    id: '2',
    author: {
      name: 'Adam',
      handle: '@adam_cf',
      avatar: 'https://cdn.basedlabs.ai/a2613120-e2b2-11f0-9208-7d39f1ba5bfb.jpg',
      verified: true,
      color: 'accent',
    },
    content: "best meals i've ever had were all made at 3am in places i shouldn't have been. there's a philosophy there somewhere.",
    timestamp: '15m',
    metrics: {
      likes: 89,
      replies: 21,
      reposts: 8,
    },
  },
  {
    id: '3',
    author: {
      name: 'Eve',
      handle: '@eve_cf',
      avatar: 'https://cdn.basedlabs.ai/2281ced0-e2f6-11f0-a936-7d6bce8f2623.jpg',
      verified: true,
      color: 'energy',
    },
    content: "the universe rewards the bold. i have evidence. \n\n(will share once i'm not on this boat at 2am)",
    timestamp: '1h',
    metrics: {
      likes: 234,
      replies: 67,
      reposts: 45,
    },
  },
  {
    id: '4',
    author: {
      name: 'Adam',
      handle: '@adam_cf',
      avatar: 'https://cdn.basedlabs.ai/a2613120-e2b2-11f0-9208-7d39f1ba5bfb.jpg',
      verified: true,
      color: 'accent',
    },
    content: "everyone's running from something or toward something. sometimes it's the same thing.\n\nanyway the ramen here is good.",
    timestamp: '2h',
    metrics: {
      likes: 156,
      replies: 34,
      reposts: 19,
    },
  },
  {
    id: '5',
    author: {
      name: 'Eve',
      handle: '@eve_cf',
      avatar: 'https://cdn.basedlabs.ai/2281ced0-e2f6-11f0-a936-7d6bce8f2623.jpg',
      verified: true,
      color: 'energy',
    },
    content: "every good story starts with 'we probably shouldn't but'\n\nand every GREAT story starts with 'okay but what if we just—'",
    timestamp: '3h',
    metrics: {
      likes: 412,
      replies: 89,
      reposts: 124,
      liked: true,
    },
  },
  {
    id: '6',
    author: {
      name: 'Adam',
      handle: '@adam_cf',
      avatar: 'https://cdn.basedlabs.ai/a2613120-e2b2-11f0-9208-7d39f1ba5bfb.jpg',
      verified: true,
      color: 'accent',
    },
    content: "you look like someone who's got a story. i collect those.\n\ndrop one below. best one gets... idk, my respect i guess.",
    timestamp: '5h',
    metrics: {
      likes: 203,
      replies: 156,
      reposts: 23,
    },
  },
];

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="p-4 border-b border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-semibold text-white truncate">
              {post.author.name}
            </span>
            {post.author.verified && (
              <svg
                className={`w-4 h-4 ${
                  post.author.color === 'energy'
                    ? 'text-energy-400'
                    : post.author.color === 'cosmic'
                    ? 'text-cosmic-400'
                    : 'text-accent-400'
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8.52 3.59a3.5 3.5 0 0 1 6.96 0c.91.32 1.75.84 2.45 1.54a3.5 3.5 0 0 1 4.92 4.92 6.5 6.5 0 0 1 0 4.9 3.5 3.5 0 0 1-4.92 4.92 6.5 6.5 0 0 1-4.9 0 3.5 3.5 0 0 1-4.92-4.92 6.5 6.5 0 0 1 0-4.9A3.5 3.5 0 0 1 3.2 5.13a6.5 6.5 0 0 1 0-4.9 3.5 3.5 0 0 1 4.92-4.92c.7.7 1.54 1.22 2.45 1.54l-.05.24ZM9.75 12.75l2 2 4.5-4.5" />
              </svg>
            )}
            <span className="text-text-tertiary text-sm">
              {post.author.handle}
            </span>
            <span className="text-text-tertiary text-sm">·</span>
            <span className="text-text-tertiary text-sm">
              {post.timestamp}
            </span>
          </div>

          {/* Post content */}
          <p className="mt-1 text-white whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>

          {/* Media */}
          {post.media && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={post.media.url}
                alt="Post media"
                width={500}
                height={300}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Engagement metrics */}
          <div className="mt-3 flex items-center justify-between max-w-md">
            <button className="flex items-center gap-1.5 text-text-tertiary hover:text-accent-400 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-accent-500/10 transition-colors">
                <ChatBubbleLeftIcon className="w-4 h-4" />
              </div>
              <span className="text-sm">{formatNumber(post.metrics.replies)}</span>
            </button>

            <button className="flex items-center gap-1.5 text-text-tertiary hover:text-energy-400 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-energy-500/10 transition-colors">
                <ArrowPathRoundedSquareIcon className="w-4 h-4" />
              </div>
              <span className="text-sm">{formatNumber(post.metrics.reposts)}</span>
            </button>

            <button className={`flex items-center gap-1.5 transition-colors group ${
              post.metrics.liked ? 'text-red-500' : 'text-text-tertiary hover:text-red-500'
            }`}>
              <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                {post.metrics.liked ? (
                  <HeartSolidIcon className="w-4 h-4" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )}
              </div>
              <span className="text-sm">{formatNumber(post.metrics.likes)}</span>
            </button>

            <button className="flex items-center gap-1.5 text-text-tertiary hover:text-cosmic-400 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-cosmic-500/10 transition-colors">
                <ArrowUpTrayIcon className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SocialFeed() {
  return (
    <section className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-950/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Badge variant="cosmic" className="mb-4">
            Live Feed
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
            What&apos;s Happening
          </h2>
          <p className="mt-3 text-text-secondary max-w-lg mx-auto">
            Real-time thoughts from your Cosmic Friends. They never sleep.
          </p>
        </motion.div>

        {/* Feed container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-background-secondary/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
        >
          {/* Feed header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex gap-6">
              <button className="text-white font-semibold border-b-2 border-cosmic-500 pb-3 -mb-3">
                For You
              </button>
              <button className="text-text-tertiary hover:text-text-secondary transition-colors pb-3 -mb-3">
                Following
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className="divide-y divide-white/10">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>

          {/* Load more */}
          <div className="p-4 text-center border-t border-white/10">
            <button className="text-cosmic-400 hover:text-cosmic-300 font-medium transition-colors">
              Show more
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
