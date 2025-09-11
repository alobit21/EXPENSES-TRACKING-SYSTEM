import { ToastContainer } from "react-toastify";
import LoginForm from "../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <ToastContainer position="top-right" autoClose={3000} />

      <LoginForm />
    </div>
  );
}
