import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TweetEmbedProps {
  username: string;
  handle: string;
  avatar?: string;
  content: string;
  timestamp?: string;
  likes?: number;
  retweets?: number;
  replies?: number;
  verified?: boolean;
  startAt?: number;
  animateIn?: boolean;
  className?: string;
}

export const TweetEmbed: React.FC<TweetEmbedProps> = ({
  username,
  handle,
  avatar,
  content,
  timestamp = '2h',
  likes = 0,
  retweets = 0,
  replies = 0,
  verified = false,
  startAt = 0,
  animateIn = true,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = animateIn
    ? spring({
        frame: frame - startAt,
        fps,
        from: 50,
        to: 0,
        durationInFrames: 30,
      })
    : 0;

  const fadeIn = animateIn
    ? interpolate(frame, [startAt, startAt + 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const statsProgress = interpolate(frame, [startAt + 20, startAt + 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className={className}
      style={{
        transform: `translateX(${slideIn}px)`,
        opacity: fadeIn,
        width: 600,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        border: '1px solid #e5e7eb',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: avatar ? `url(${avatar})` : 'linear-gradient(45deg, #1DA1F2, #0d8bd9)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginRight: 12,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{username}</span>
            {verified && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280' }}>
            <span style={{ fontSize: 15 }}>@{handle}</span>
            <span>·</span>
            <span style={{ fontSize: 15 }}>{timestamp}</span>
          </div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#6b7280">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </div>

      {/* Content */}
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.5,
          marginBottom: 16,
          color: '#0f172a',
        }}
      >
        {content}
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 40,
          paddingTop: 12,
          borderTop: '1px solid #e5e7eb',
          opacity: statsProgress,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{replies}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <path d="M17 2.1l4 4-4 4" />
            <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" />
            <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
          </svg>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{retweets}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{likes}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </div>
      </div>
    </div>
  );
};