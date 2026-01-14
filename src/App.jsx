import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/index.css';

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <Router>
          <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-outfit transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </Router>
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;
