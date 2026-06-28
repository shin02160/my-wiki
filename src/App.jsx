import Sidebar from './components/Sidebar';
import { CaptureModal, NewProjectModal } from './components/Modals';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import Interests from './pages/Interests';
import Projects from './pages/Projects';
import Ideas from './pages/Ideas';
import Reviews from './pages/Reviews';
import { useStore } from './store';

const PAGES = {
  dashboard: Dashboard,
  timeline:  Timeline,
  interests: Interests,
  projects:  Projects,
  ideas:     Ideas,
  reviews:   Reviews,
};

export default function App() {
  const route = useStore(s => s.route);
  const modal = useStore(s => s.modal);
  const Page = PAGES[route] || Dashboard;

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      padding: 16,
      gap: 16,
      background: 'var(--bg-app)',
      overflow: 'hidden',
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        overflowY: 'auto',
        minWidth: 0,
      }}>
        <Page />
      </main>

      {modal === 'capture' && <CaptureModal />}
      {modal === 'new-project' && <NewProjectModal />}
    </div>
  );
}
