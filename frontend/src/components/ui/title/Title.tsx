import { titleFont } from '@/config/fonts'

interface TitleProps {
  title: string
  subtitle?: string
  className?: string
}

export const Title = ({ title, subtitle, className }: TitleProps) => {
  return (
    <div className={`${className}`}>
      <h1 className={`${titleFont.className} antialiased font-black`}>{title}</h1>
      {subtitle && <h2 className='text-xl mb-5'>{subtitle}</h2>}
    </div>
  )
}
