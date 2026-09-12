import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'normalize.css/normalize.css'
import '@/styles/global.css'
import '@/styles/font/font.css'
import App from './App'
import { GameStoreProvider } from './store/GameStoreContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameStoreProvider>
      <App />
    </GameStoreProvider>
  </StrictMode>,
)
