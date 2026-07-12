const variants = {
  solid: 'bg-indigo text-white shadow-cta hover:shadow-lg',
  gold: 'bg-gold text-indigo hover:bg-gold-soft',
  ghost: 'bg-transparent text-indigo border border-line hover:bg-black/5',
  ghostLight: 'bg-transparent text-white border border-white/30 hover:bg-white/10',
}

export default function Button({
  as: Component = 'button',
  variant = 'solid',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[14.5px] transition-transform active:scale-[0.97] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
