import SearchBar from './components/SearchBar'
import AddBusiness from './components/AddBusiness'
import './App.css'

function App() {
  return (
    <div className="App">
      <div className="home-container">
        <header className="app-header">
          <h1 className="app-title">Small Business Web</h1>
          <p className="app-subtitle">Discover and connect with local businesses</p>
        </header>
        
        <main className="main-content">
          <SearchBar />
          <AddBusiness />
        </main>
      </div>
    </div>
  )
}

export default App

