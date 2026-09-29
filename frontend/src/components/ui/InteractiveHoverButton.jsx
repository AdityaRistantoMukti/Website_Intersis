import React from 'react';
import { Link } from 'react-router-dom';
import './InteractiveHoverButton.css';

/**
 * InteractiveHoverButton (Faithful to Magic UI specification)
 * A single organic dot expands with a fluid spring curve to fully flood the button,
 * while the initial text smoothly exits and reveals the new label with an animated arrow.
 */
export default function InteractiveHoverButton({
  children,
  text,
  to,
  onClick,
  className = '',
  variant = 'light', // 'light' (white button, floods dark teal on dark banner) or 'teal' (teal button on light background)
  ...props
}) {
  const content = children || text;

  const innerContent = (
    <>
      {/* Resting State: A single little dot + label text */}
      <div className="ihb-content-rest">
        <span className="ihb-dot" aria-hidden="true" />
        <span className="ihb-text-rest">{content}</span>
      </div>

      {/* Hover State: Absolute overlay text + animated arrow sliding in */}
      <div className="ihb-content-hover" aria-hidden="true">
        <span className="ihb-text-hover">{content}</span>
        <svg
          className="ihb-arrow"
          width="18"
          height="18"
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
