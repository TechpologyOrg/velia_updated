import React, { useState, useRef, useEffect } from 'react';

/**
 * V_Tooltip Component - Renders a tooltip with help icon
 * @param {Object} props
 * @param {string} props.hint - Tooltip content text
 * @param {string} props.position - Tooltip position: 'top', 'bottom', 'left', 'right' (default: 'top')
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Optional custom trigger element
 */
const V_Tooltip = ({ hint, position = 'top', className = '', children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  // Handle positioning and visibility
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const rect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // Reset positioning
      tooltip.style.top = 'auto';
      tooltip.style.bottom = 'auto';
      tooltip.style.left = 'auto';
      tooltip.style.right = 'auto';
      
      switch (position) {
        case 'top':
          tooltip.style.bottom = `${rect.height + 8}px`;
          tooltip.style.left = '50%';
          tooltip.style.transform = 'translateX(-50%)';
          break;
        case 'bottom':
          tooltip.style.top = `${rect.height + 8}px`;
          tooltip.style.left = '50%';
          tooltip.style.transform = 'translateX(-50%)';
          break;
        case 'left':
          tooltip.style.right = `${rect.width + 8}px`;
          tooltip.style.top = '50%';
          tooltip.style.transform = 'translateY(-50%)';
          break;
        case 'right':
          tooltip.style.left = `${rect.width + 8}px`;
          tooltip.style.top = '50%';
          tooltip.style.transform = 'translateY(-50%)';
          break;
      }
    }
  }, [isVisible, position]);

  if (!hint) return null;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center justify-center w-4 h-4 ml-1 cursor-help"
        tabIndex={0}
        role="button"
        aria-label="Show help"
      >
        {children || (
          <svg
            className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-normal max-w-xs"
          role="tooltip"
        >
          {hint}
          {/* Tooltip arrow */}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2' :
              position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' :
              position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
              position === 'right' ? '-left-1 top-1/2 -translate-y-1/2' : ''
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default V_Tooltip;
