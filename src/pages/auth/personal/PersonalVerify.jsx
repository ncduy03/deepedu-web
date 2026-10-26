import { Navigate, useNavigate } from 'react-router-dom';
import { useSignup } from '../../../state/SignupContext.jsx';
import CheckEmailCard from '../CheckEmailCard.jsx';

/** Sign-up step 2: the activation link was sent. Opening it leads to "Xác nhận truy cập DeepEdu". */
export default function PersonalVerify() {
  const { personal } = useSignup();
  const navigate = useNavigate();

  if (!personal.email) return <Navigate to="/dang-ky/ca-nhan" replace />;

  return (
    <CheckEmailCard
      email={personal.email}
      resendLabel="Gửi lại liên kết"
      onChangeEmail={() => navigate('/dang-ky/ca-nhan')}
      onDemoOpen={() => navigate('/xac-nhan-dang-nhap', { state: { email: personal.email } })}
    />
  );
}
