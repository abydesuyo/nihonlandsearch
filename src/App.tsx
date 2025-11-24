import LandSearchUI from './components/LandSearchUI'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <LandSearchUI />
      </div>
    </ThemeProvider>
  )
}

export default App