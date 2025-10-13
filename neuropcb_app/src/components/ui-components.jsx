import React from 'react';

// Utility function for class names
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Button Component
export const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-600 bg-transparent hover:bg-gray-800 text-white",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    ghost: "hover:bg-gray-800 text-white",
    link: "text-green-400 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

// Input Component
export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Label Component
export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium leading-none text-white", className)}
    {...props}
  />
));
Label.displayName = "Label";

// Switch Component
export const Switch = React.forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-green-600" : "bg-gray-600",
        className
      )}
      onClick={() => onChange?.(!checked)}
      ref={ref}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
});
Switch.displayName = "Switch";

// Complete toast function with all methods
export const toast = {
  success: (message, options = {}) => {
    console.log('✅ Toast Success:', message, options);
    showToast(message, 'success', options);
  },
  error: (message, options = {}) => {
    console.error('❌ Toast Error:', message, options);
    showToast(message, 'error', options);
  },
  warning: (message, options = {}) => {
    console.warn('⚠️ Toast Warning:', message, options);
    showToast(message, 'warning', options);
  },
  info: (message, options = {}) => {
    console.info('ℹ️ Toast Info:', message, options);
    showToast(message, 'info', options);
  }
};

// Function to show actual toast notifications
const showToast = (message, type = 'info', options = {}) => {
  // Create toast element
  const toast = document.createElement('div');
  const duration = options.duration || 5000;
  
  const typeStyles = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    warning: 'bg-yellow-600 border-yellow-500',
    info: 'bg-blue-600 border-blue-500'
  };

  const icons = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  };

  toast.className = `fixed top-4 right-4 z-50 glass-card border-l-4 p-4 min-w-80 max-w-md animate-slide-down ${typeStyles[type]}`;
  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-1">
        <h4 class="font-semibold text-white flex items-center gap-2">
          <span>${icons[type]}</span>
          ${message}
        </h4>
        ${options.description ? `<p class="text-sm text-gray-200 mt-1">${options.description}</p>` : ''}
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-gray-300 hover:text-white transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;

  // Add to page
  document.body.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, duration);

  // Add click to dismiss
  toast.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
      toast.remove();
    }
  });
};