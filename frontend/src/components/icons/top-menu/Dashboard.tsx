import { SVGProps } from 'react'

export const DashboardTop = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={48} height={48} fill='none' {...props}>
    <path
      stroke='#B9B8B8'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M7.5 19.875V42A1.5 1.5 0 0 0 9 43.5h9V30.75a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 30 30.75V43.5h9a1.5 1.5 0 0 0 1.5-1.5V19.875'
    />
    <path
      stroke='#B9B8B8'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M45 24 25.02 4.875c-.468-.495-1.564-.5-2.04 0L3 24m34.5-7.219V6H33v6.469'
    />
  </svg>
)
