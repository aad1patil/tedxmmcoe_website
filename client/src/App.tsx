import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Speakers from './pages/Speakers';
import EventDetails from './pages/EventDetails';
import Timeline from './pages/Timeline';
import Register from './pages/Register';
import Login from './pages/Login';
import Payment from './pages/Payment';
import Success from './pages/Success';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="speakers" element={<Speakers />} />
                        <Route
                            path="event-details"
                            element={
                                <PrivateRoute>
                                    <EventDetails />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="timeline"
                            element={
                                <PrivateRoute>
                                    <Timeline />
                                </PrivateRoute>
                            }
                        />
                        <Route path="register" element={<Register />} />
                        <Route path="login" element={<Login />} />
                        <Route
                            path="payment"
                            element={
                                <PrivateRoute>
                                    <Payment />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="success"
                            element={
                                <PrivateRoute>
                                    <Success />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="admin"
                            element={
                                <PrivateRoute>
                                    <AdminDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
