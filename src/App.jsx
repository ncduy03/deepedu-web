import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import SignupChoice from './pages/auth/SignupChoice.jsx';
import Login from './pages/auth/Login.jsx';
import AssistantLayout from './pages/chat/AssistantLayout.jsx';
import ChatPage from './pages/chat/ChatPage.jsx';
import ProfilePage from './pages/chat/ProfilePage.jsx';
import ProfileEditPage from './pages/chat/ProfileEditPage.jsx';
import FeedbackPage from './pages/chat/FeedbackPage.jsx';
import ConsoleLayout from './pages/console/ConsoleLayout.jsx';
import DashboardPage from './pages/console/DashboardPage.jsx';
import PlansPage from './pages/console/PlansPage.jsx';
import PricingPage from './pages/console/PricingPage.jsx';
import TransactionsPage from './pages/console/TransactionsPage.jsx';
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
        <Route path="/tro-ly" element={<AssistantLayout />}>
          <Route index element={<ChatPage />} />
          <Route path="ho-so" element={<ProfilePage />} />
          <Route path="ho-so/chinh-sua" element={<ProfileEditPage />} />
          <Route path="gop-y" element={<FeedbackPage />} />
        </Route>
        <Route path="/tai-khoan" element={<ConsoleLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="goi-dich-vu" element={<PlansPage />} />
          <Route path="goi-cuoc-chi-tiet" element={<PricingPage />} />
          <Route path="lich-su-thanh-toan" element={<TransactionsPage />} />
          {/* Old links: transactions and payment methods are now one page. */}
          <Route path="lich-su-giao-dich" element={<Navigate to="/tai-khoan/lich-su-thanh-toan" replace />} />
          <Route path="phuong-thuc-thanh-toan" element={<Navigate to="/tai-khoan/lich-su-thanh-toan" replace />} />
        </Route>

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
