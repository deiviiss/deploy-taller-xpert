import { SVGProps } from "react";
export const Alert = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}
  >
    <path
      stroke="#252525"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.29 4.36 1.82 18.5a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 4.36a2 2 0 0 0-3.42 0v0ZM12 9.5v4M12 16.5v.5"
    />
  </svg>
)