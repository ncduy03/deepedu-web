import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import SignupChoice from './pages/auth/SignupChoice.jsx';
import Login from './pages/auth/Login.jsx';
import ChatPage from './pages/chat/ChatPage.jsx';
import PersonalAccount from './pages/auth/personal/PersonalAccount.jsx';
import PersonalVerify from './pages/auth/personal/PersonalVerify.jsx';
import PersonalProfile from './pages/auth/personal/PersonalProfile.jsx';
import PersonalSuccess from './pages/auth/personal/PersonalSuccess.jsx';
import OrgInfo from './pages/auth/org/OrgInfo.jsx';
import OrgContact from './pages/auth/org/OrgContact.jsx';
import OrgReview from './pages/auth/org/OrgReview.jsx';
import OrgSuccess from './pages/auth/org/OrgSuccess.jsx';
import { SignupProvider } from './state/SignupContext.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <SignupProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/tro-ly" element={<ChatPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/dang-ky" element={<SignupChoice />} />

          <Route path="/dang-ky/ca-nhan" element={<PersonalAccount />} />
          <Route path="/dang-ky/ca-nhan/xac-minh" element={<PersonalVerify />} />
          <Route path="/dang-ky/ca-nhan/ho-so" element={<PersonalProfile />} />
          <Route path="/dang-ky/ca-nhan/thanh-cong" element={<PersonalSuccess />} />

          <Route path="/dang-ky/to-chuc" element={<OrgInfo />} />
          <Route path="/dang-ky/to-chuc/lien-he" element={<OrgContact />} />
          <Route path="/dang-ky/to-chuc/xac-nhan" element={<OrgReview />} />
          <Route path="/dang-ky/to-chuc/thanh-cong" element={<OrgSuccess />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SignupProvider>
  );
}
