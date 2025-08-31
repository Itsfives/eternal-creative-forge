import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { register as registerSW } from './utils/serviceWorker'

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for performance optimization
if (process.env.NODE_ENV === 'production') {
  registerSW({
    onSuccess: () => console.log('Service worker registered successfully'),
    onUpdate: () => console.log('New content available; please refresh')
  });
}
