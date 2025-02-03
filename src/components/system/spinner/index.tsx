export function Spinner({ color = 'primary' }) {
  return (
    <div
      className={`w-5 h-5 border-2 border-b-transparent border-${color} rounded-full animate-spin`}
    />
  )
}
