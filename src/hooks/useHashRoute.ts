import { useEffect, useState } from 'react'

export function parseHash(hash: string): string {
  return hash.startsWith('#') ? hash.slice(1) : ''
}

export function useHashRoute(): string {
  const [path, setPath] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => setPath(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    if (!window.location.hash) {
      window.location.replace('#home')
    } else {
      onChange()
    }
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}
