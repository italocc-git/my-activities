import { Header } from './components/Header';
import {DndProvider } from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import Routes from './routes'
import {BrowserRouter} from 'react-router-dom'
import './styles/global.scss'
import {CardsProvider } from './hooks/useCards'
import {ThemeProvider} from './hooks/useTheme'

function App() {
  

  return (
    <BrowserRouter>
    <DndProvider backend={HTML5Backend}>
    <ThemeProvider>    
    <CardsProvider>
   
        <Routes/>
        
    </CardsProvider>
    </ThemeProvider>
  </DndProvider>
  </BrowserRouter>
  );
}

export default App;
