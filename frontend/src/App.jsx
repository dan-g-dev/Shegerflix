import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

import Home from './pages/Home';
import Browse from './pages/Browse';
import Genres from './pages/Genres';
import Search from './pages/Search';
import TitleDetails from './pages/TitleDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyList from './pages/MyList';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Browse type="movie" heading="Movies" />} />
            <Route path="/series" element={<Browse type="series" heading="Series" />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/search" element={<Search />} />
            <Route path="/title/:slug" element={<TitleDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
