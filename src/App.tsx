import '@/App.css';

import { Navigate, Route, Routes } from 'react-router-dom';

import AuthLayout from '@/components/layouts/AuthLayout';
import Layout from '@/components/layouts/Layout';
import MyPageLayout from '@/components/layouts/MyPageLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import IdolSearchPage from '@/pages/idolSearch/IdolSearchPage';
import LandingPage from '@/pages/landing/LandingPage';
import Login from '@/pages/Login';
import FanMainPage from '@/pages/main/fan/FanMainPage';
import IdolMainPage from '@/pages/main/idol/IdolMainPage';
import ManagerMainPage from '@/pages/main/manager/ManagerMainPage';
import MyProfile from '@/pages/MyProfile';
import MySchedule from '@/pages/MySchedule';
import Register from '@/pages/Register';
import { useUserStore } from '@/stores/userStore';

import Chat from './pages/chat/Chat';

function RootPage() {
  const { isLoggedIn, user } = useUserStore();

  if (isLoggedIn && user?.role === 'NORMAL') {
    return <Navigate to="/search" replace />;
  }

  return <LandingPage />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout component="landing" />}>
        <Route index element={<RootPage />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="/search" element={<Layout />}>
        <Route index element={<IdolSearchPage />} />
      </Route>

      <Route path="/idols" element={<Layout />}>
        <Route path=":idolId" element={<FanMainPage />} />
      </Route>

      <Route path="/main" element={<Layout />}>
        <Route path="idol" element={<IdolMainPage />} />
        <Route path="manager" element={<ManagerMainPage />} />
      </Route>

      <Route path="/mypage" element={<MyPageLayout />}>
        <Route path="myprofile" element={<MyProfile />} />
        <Route path="myschedule" element={<MySchedule />} />
      </Route>

      <Route path="/admin" element={<Layout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
      <Route path="/chat" element={<Layout component="chat" />}>
        <Route index element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;
