type ButtonProps = {
  title: string;
  onClick: () => void
}

export const Button = ({ title, onClick }: ButtonProps) => {
  const handleOnClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <button
      onClick={handleOnClick}
      className='w-[200px] h-10 bg-primary hover:opacity-70 rounded text-white text-base font-bold'
    >
      {title}
    </button>
  )
}
