import { SVGProps } from "react";

export const Star = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 25 25"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="m12.71 3.45 2.46 4.49a.81.81 0 0 0 .56.41l5 .95a.81.81 0 0 1 .44 1.35l-3.51 3.73a.81.81 0 0 0-.21.66l.64 5.08a.8.8 0 0 1-1.14.83l-4.63-2.18a.78.78 0 0 0-.7 0l-4.63 2.18a.81.81 0 0 1-1.15-.83l.65-5.08a.81.81 0 0 0-.21-.66l-3.51-3.73a.81.81 0 0 1 .44-1.35l5-.95a.81.81 0 0 0 .56-.41l2.51-4.49a.81.81 0 0 1 1.43 0v0Z"
    />
  </svg>
)