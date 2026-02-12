import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { createShiftNote } from './api/api';

// Optional: when VITE_CREATE_SHIFT_ON_CLICK=true, create a shift note on any button click.
if (import.meta.env.VITE_CREATE_SHIFT_ON_CLICK === 'true') {
  try {
    document.addEventListener('click', async (ev) => {
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      // find closest button element
      const btn = target.closest && target.closest('button');
      if (!btn) return;

      const content = `Auto note: clicked button "${(btn.textContent || '').trim().slice(0, 200)}" on ${location.pathname} at ${new Date().toISOString()}`;
      const payload = {
        order_id: 0,
        date: new Date().toISOString().slice(0, 10),
        shift_type: 'bouton',
        content,
      };
      try { await createShiftNote(payload); } catch (e) { /* ignore */ }
    });
  } catch (e) {
    // silence in non-browser environments
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
