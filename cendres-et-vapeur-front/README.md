# Cendres et Vapeur - Frontend

React + TypeScript + Vite application for the Cendres et Vapeur project.

## Environment Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

#### Available Variables

- **`VITE_API_URL`** (optional in development)
  - The base URL of your backend API
  - In **development mode**: Leave empty `''` - Vite proxy will handle routing to backend
  - In **production**: Set to your production API URL (e.g., `https://api.example.com`)
  
- **`VITE_APP_NAME`** (default: `Cendres et Vapeur`)
  - Application name displayed in the UI
  
- **`VITE_APP_VERSION`** (default: `1.0.0`)
  - Current version of the application
  
- **`VITE_DEBUG`** (default: `false`)
  - Enable detailed console logging for debugging
  - Set to `true` for verbose API call logs

### Development Server Configuration

The Vite development server (running on `http://localhost:5173`) is configured to proxy API requests to the backend server at `http://89.168.38.93/`. This configuration is in `vite.config.ts`.

Proxied routes:
- `/api/*` - Main API endpoints
- `/products/*` - Product endpoints
- `/shift-notes/*` - Shift notes management
- `/orders/*` - Order management
- `/users/*` - User management
- `/stats/*` - Statistics
- `/logs/*` - Logs
- `/categories/*` - Product categories
- `/colony-events/*` - Colony events
- WebSocket connections for `/mail` and `/chat`

### Installation

```bash
npm install
```

### Running the Application

```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

- `src/api/` - API client and endpoints
- `src/components/` - Reusable React components
- `src/contexts/` - React contexts (Auth, Notifications)
- `src/hooks/` - Custom React hooks
- `src/pages/` - Page components
- `src/services/` - Business logic services
- `src/styles/` - Global styles
- `src/types/` - TypeScript type definitions

## Technology Stack

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **ESLint** - Code linting

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
