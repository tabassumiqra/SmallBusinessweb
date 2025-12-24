import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, AddBusinessPage, AuthCallbackPage } from './pages';
import './App.css';

/**
 * Main App Component
 * Handles routing for the application
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-business" element={<AddBusinessPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
