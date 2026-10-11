import LeagueFilter from './LeagueFilter';
import Settings from './Settings';
import SpinHistory from './SpinHistory';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <LeagueFilter />
      <Settings />
      <SpinHistory />
    </aside>
  );
}