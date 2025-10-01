import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
          {/* Visual / Brand Panel */}
          <div className="relative hidden lg:block overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
            <img
              src="/assets/1.jpg"
              alt="Budgeting and expense tracking"
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
                Take control of your spending
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/80">
                Track expenses, visualize insights, and hit your financial goals with clarity.
              </p>

              <ul className="mt-8 space-y-3 text-white/85">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/90 text-white">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L8.75 11.543l6.543-6.543a1 1 0 0 1 1.414 0Z" clipRule="evenodd"/></svg>
                  </span>
                  <span>Clear, distraction-free interface</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/90 text-white">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L8.75 11.543l6.543-6.543a1 1 0 0 1 1.414 0Z" clipRule="evenodd"/></svg>
                  </span>
                  <span>Secure login with feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/90 text-white">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L8.75 11.543l6.543-6.543a1 1 0 0 1 1.414 0Z" clipRule="evenodd"/></svg>
                  </span>
                  <span>Responsive across all devices</span>
                </li>
              </ul>

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
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Sign in to continue tracking your expenses
                </p>
              </div>

              <LoginForm />

              <div className="mt-4 flex items-center justify-between text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Forgot password?
                </a>
                <Link to="/signup" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
