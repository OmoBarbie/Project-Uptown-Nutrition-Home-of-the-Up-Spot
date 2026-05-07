import clsx from 'clsx'
import Link from 'next/link'

const baseStyles = {
  solid:
    'group inline-flex items-center justify-center rounded-full py-3 px-6 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200',
  outline:
    'group inline-flex ring-2 items-center justify-center rounded-full py-3 px-6 text-sm font-semibold transition-all duration-200',
}

const variantStyles = {
  solid: {
    slate:
      'bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900',
    indigo:
      'bg-indigo-600 text-white hover:text-slate-100 hover:bg-indigo-500 active:bg-indigo-800 active:text-indigo-100 focus-visible:outline-indigo-600',
    emerald:
      'bg-emerald-600 text-white hover:text-slate-100 hover:bg-emerald-500 active:bg-emerald-800 active:text-emerald-100 focus-visible:outline-emerald-600',
    forest:
      'bg-forest-600 text-cream-100 hover:bg-forest-500 active:bg-forest-700 focus-visible:outline-forest-600',
    white:
      'bg-white text-slate-900 hover:bg-emerald-50 active:bg-emerald-200 active:text-slate-600 focus-visible:outline-white',
  },
  outline: {
    slate:
      'ring-slate-300 text-slate-700 hover:text-slate-900 hover:ring-slate-400 hover:bg-slate-50 active:bg-slate-100 active:text-slate-600 focus-visible:outline-emerald-600 focus-visible:ring-slate-300',
    white:
      'ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 active:text-slate-400 focus-visible:outline-white',
  },
}

type ButtonProps = (
  | {
    variant?: 'solid'
    color?: keyof typeof variantStyles.solid
  }
  | {
    variant: 'outline'
    color?: keyof typeof variantStyles.outline
  }
)
& (
  | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'color'>
  | (Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> & {
    href?: undefined
  })
  )

export function Button({ className, ...props }: ButtonProps) {
  props.variant ??= 'solid'
  props.color ??= 'emerald'

  className = clsx(
    baseStyles[props.variant],
    props.variant === 'outline'
      ? variantStyles.outline[props.color!]
      : props.variant === 'solid'
        ? variantStyles.solid[props.color]
        : undefined,
    className,
  )

  return typeof props.href === 'undefined'
    ? (
        <button className={className} {...props} />
      )
    : (
        <Link className={className} {...props} />
      )
}
