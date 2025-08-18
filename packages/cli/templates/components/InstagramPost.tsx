import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface InstagramPostProps {
  username: string;
  avatar?: string;
  image: string;
  likes: number;
  caption: string;
  timestamp?: string;
  verified?: boolean;
  startAt?: number;
  animateIn?: boolean;
  className?: string;
}

export const InstagramPost: React.FC<InstagramPostProps> = ({
  username,
  avatar,
  image,
  likes,
  caption,
  timestamp = '2 hours ago',
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
        from: 100,
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

  const heartScale = spring({
    frame: frame - startAt - 30,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 20,
    config: {
      damping: 10,
      stiffness: 200,
    },
  });

  return (
    <div
      className={className}
      style={{
        transform: `translateY(${slideIn}px)`,
        opacity: fadeIn,
        width: 400,
        backgroundColor: 'white',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 12,
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: avatar ? `url(${avatar})` : 'linear-gradient(45deg, #f093fb, #f5576c)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginRight: 12,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{username}</span>
            {verified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DA1F2">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: 12, color: '#6b7280' }}>{timestamp}</span>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="1.5" fill="black" />
          <circle cx="6" cy="12" r="1.5" fill="black" />
          <circle cx="18" cy="12" r="1.5" fill="black" />
        </svg>
      </div>

      {/* Image */}
      <div
        style={{
          width: '100%',
          height: 400,
          background: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Actions */}
      <div style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={heartScale > 0 ? '#ef4444' : 'none'}
            stroke={heartScale > 0 ? '#ef4444' : 'black'}
            strokeWidth="2"
            style={{
              transform: `scale(${heartScale})`,
              cursor: 'pointer',
            }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>

        {/* Likes */}
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 8,
            opacity: interpolate(frame, [startAt + 35, startAt + 45], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {likes.toLocaleString()} likes
        </div>

        {/* Caption */}
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.4,
            opacity: interpolate(frame, [startAt + 40, startAt + 50], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <span style={{ fontWeight: 600, marginRight: 8 }}>{username}</span>
          <span>{caption}</span>
        </div>
      </div>
    </div>
  );
};