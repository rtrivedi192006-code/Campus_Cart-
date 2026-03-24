import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMemo, useRef, type ButtonHTMLAttributes } from 'react'

type MagneticButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragStart'
  | 'onDrop'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
> & {
  intensity?: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function MagneticButton({
  intensity = 10,
  onMouseMove,
  onMouseLeave,
  className,
  children,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 350, damping: 18, mass: 0.25 })
  const springY = useSpring(y, { stiffness: 350, damping: 18, mass: 0.25 })

  const limits = useMemo(() => ({ x: 14, y: 14 }), [])

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onMouseMove={(e) => {
        onMouseMove?.(e)
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) / intensity
        const dy = (e.clientY - cy) / intensity
        x.set(clamp(dx, -limits.x, limits.x))
        y.set(clamp(dy, -limits.y, limits.y))
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e)
        x.set(0)
        y.set(0)
      }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

