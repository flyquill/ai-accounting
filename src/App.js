import logo from './logo.svg';
import './App.css';
import ChatUI from './components/ChatUI';
import Sidebar from './components/Sidebar';

function App() {

  const n8nServer = process.env.REACT_APP_N8N_WEB_SERVER;
  const n8nProductionUrl = process.env.REACT_APP_N8N_PRODUCTION_URL;

  return (
    <>
      <div className="d-flex">
        {/* Sidebar */}
        {/* <Sidebar /> */}

        {/* Main Content */}
        <div className="flex-grow-1">
          <ChatUI apiUrl={`${n8nServer}${n8nProductionUrl}`} />
        </div>
      </div>
    </>

  );
}

export default App;
