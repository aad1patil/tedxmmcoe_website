import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Speakers from './pages/Speakers';
import EventDetails from './pages/EventDetails';
import Timeline from './pages/Timeline';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="speakers" element={<Speakers />} />
                    <Route path="event-details" element={<EventDetails />} />
                    <Route path="timeline" element={<Timeline />} />
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<Login />} />
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
