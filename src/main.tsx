import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './index.css'


inject();
injectSpeedInsights();

createRoot(document.getElementById('root')!).render(
    <App />
)
