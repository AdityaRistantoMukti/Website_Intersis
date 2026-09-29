import React from 'react';
import { Link } from 'react-router-dom';
import './InteractiveHoverButton.css';

/**
 * InteractiveHoverButton (Inspired by Magic UI)
 * Features an expanding fluid dot on hover that floods the button background,
 * while smoothly sliding in the label text with an animated arrow.
 */
export default function InteractiveHoverButton({
  children,
  text,
  to,
  onClick,
  className = '',
  variant = 'light', // 'light' (white with dark teal flood) or 'teal' (teal with dark flood)
  ...props
}) {
  const content = children || text;

  const innerContent = (
    <>
      {/* Expanding Fluid Ripple Dot */}
      <div className="ihb-dot" aria-hidden="true" />

      {/* Initial resting state (dot + text) */}
      <div className="ihb-initial">
        <span className="ihb-initial-dot" aria-hidden="true" />
        <span className="ihb-initial-text">{content}</span>
      </div>

      {/* Hover reveal state (centered text + arrow) */}
      <div className="ihb-hover" aria-hidden="true">
        <span className="ihb-hover-text">{content}</span>
        <svg
          className="ihb-hover-arrow"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </>
  );

  const combinedClass = `interactive-hover-btn interactive-hover-btn--${variant} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClass} onClick={onClick} {...props}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button type="button" className={combinedClass} onClick={onClick} {...props}>
      {innerContent}
    </button>
  );
}
