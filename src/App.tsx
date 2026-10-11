import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SpinArea from './components/SpinArea';

export default function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar />
        <SpinArea />
      </div>
      <footer className="footer">
        Takım verileri 2026/27 sezonuna aittir · Arkadaşlarınla FC takım seçimi için
      </footer>
    </div>
  );
}