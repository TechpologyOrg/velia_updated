import React from 'react';

/**
 * I_V_Button Component - A customizable button component with multiple variants and sizes
 * Based on the lovable designs button component but adapted for the template system
 * @param {Object} props
 * @param {string} props.title - Button text/label
 * @param {string} props.type - "editable" or "display" mode
 * @param {string} props.value - URL or action value for the button
 * @param {string} props.className - CSS class name
 * @param {string} props.variant - Button variant (default, destructive, outline, secondary, ghost, link, warning, success, outline-destructive)
 * @param {string} props.size - Button size (default, sm, lg, icon)
 * @param {string} props.var - Variable name for dynamic value resolution
 * @param {Function} props.onChange - Callback when button is clicked (for editable mode)
 */
export function I_V_Button({ 
    title, 
    type, 
    value, 
    className = '', 
    variant = 'default', 
    size = 'default',
    var: varName,
    onChange,
    onClick
}) {
    // Button variant styles
    const getVariantStyles = (variant) => {
        const variants = {
            default: "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
            destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
            outline: "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900",
            secondary: "bg-gray-200 text-gray-900 shadow-sm hover:bg-gray-300",
            ghost: "hover:bg-gray-100 hover:text-gray-900",
            link: "text-blue-600 underline-offset-4 hover:underline",
            warning: "bg-yellow-500 text-white shadow-sm hover:bg-yellow-600",
            success: "bg-green-600 text-white shadow-sm hover:bg-green-700",
            "outline-destructive": "border border-red-600 text-red-600 bg-white hover:bg-red-600 hover:text-white shadow-sm",
        };
        return variants[variant] || variants.default;
    };

    // Button size styles
    const getSizeStyles = (size) => {
        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        };
        return sizes[size] || sizes.default;
    };

    // Base button styles
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variantStyles = getVariantStyles(variant);
    const sizeStyles = getSizeStyles(size);
    
    const buttonClasses = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`;

    if (type && type.toLowerCase() === 'display') {
        return (
            <div className="gap-2 flex flex-row items-center">
                {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                <button
                    className={`${buttonClasses} opacity-50 cursor-not-allowed`}
                    disabled
                >
                    {title || 'Button'}
                </button>
            </div>
        );
    } else {
        // Editable or standard
        return (
            <div className="gap-2 flex flex-row items-center">
                {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                <button
                    className={buttonClasses}
                    onClick={() => {
                        console.log('I_V_Button clicked, value:', value, 'var:', varName);
                        if (onClick) {
                            onClick();
                        } else if (onChange) {
                            onChange(value || '#');
                        }
                        // Open URL in new tab if value is a URL
                        if (value && (value.startsWith('http') || value.startsWith('mailto:') || value.startsWith('tel:'))) {
                            window.open(value, '_blank');
                        }
                    }}
                >
                    {title || 'Button'}
                </button>
            </div>
        );
    }
}
