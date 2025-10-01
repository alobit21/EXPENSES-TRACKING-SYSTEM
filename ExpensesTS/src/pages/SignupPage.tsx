import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import RegisterForm from "../components/forms/RegisterForm";

export default function SignupPage() {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
          {/* Visual / Brand Panel */}
          <div className="relative hidden lg:block overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
            <img
              src="/assets/2.jpg"
              alt="Signup visual"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-900/60 to-blue-900/60" />

            <div className="relative z-10 h-full w-full p-10 flex flex-col">
              <div className="flex items-center gap-3 text-white/90">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M3 5a2 2 0 0 1 2-2h3.382a2 2 0 0 1 1.789 1.106l.447.894A2 2 0 0 0 12.407 6H19a2 2 0 0 1 2 2v1H3V5Z" />
                    <path d="M3 10.5h18V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6.5Z" />
                  </svg>
                </span>
                <p className="text-sm tracking-wide uppercase text-white/70">Expenses Manager</p>
              </div>

              <h1 className="mt-8 text-3xl font-bold leading-tight text-white sm:text-4xl">
                Join and start saving smarter
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/80">
                Create an account to track expenses, set goals, and visualize your progress.
              </p>

              <div className="mt-auto pt-8 text-sm text-white/70">
                © {new Date().getFullYear()} Expenses Manager
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <div className="flex items-center">
            <div className="w-full rounded-2xl bg-white/90 backdrop-blur dark:bg-gray-800/90 shadow-lg ring-1 ring-black/5 p-6 sm:p-8 lg:p-10">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
                  Create your account
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Get started in minutes — it's free
                </p>
              </div>

              <RegisterForm />

              <div className="mt-4 text-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">Already have an account? </span>
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
