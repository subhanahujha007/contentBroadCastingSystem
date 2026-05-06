import { Loader2 } from 'lucide-react';

export function Button({ children, className = '', variant = 'primary', loading = false, type = 'button', ...props }) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  }[variant];

  return (
    <button className={`btn ${variantClass} ${className}`} disabled={loading || props.disabled} type={type} {...props}>
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
