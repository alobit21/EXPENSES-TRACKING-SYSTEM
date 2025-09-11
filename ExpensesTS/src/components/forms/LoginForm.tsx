import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function AuthForms() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden">
        {/* Welcome Panel */}
        <div
          className="bg-gradient-to-br from-blue-800 to-indigo-900 text-white p-8 lg:p-12 flex flex-col justify-center lg:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/1.jpg')" }}
        >
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">Control Your Expenses</h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Take control of your money. Track every expense, stay on budget, and watch your savings grow.
          </p>
          <div className="mt-auto">
            <p className="text-blue-200 text-sm font-medium mb-4">GET CONNECTED WITH</p>
            <div className="flex space-x-4">
              <button className="bg-blue-700 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="bg-blue-500 hover:bg-blue-400 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10 10 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button className="bg-red-500 hover:bg-red-400 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 lg:p-12 flex flex-col w-full lg:w-1/2">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLoginForm ? "Login" : "Register"}
            </h2>
            <p className="text-gray-500">
              {isLoginForm ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          {isLoginForm ? <LoginForm /> : <RegisterForm />}

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
             <button className="bg-blue-700 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            <button className="bg-blue-500 hover:bg-blue-400 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10 10 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button className="bg-red-500 hover:bg-red-400 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
              </svg>
            </button>
          </div>

          <div className="text-center text-gray-600 text-sm">
            {isLoginForm ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLoginForm(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLoginForm(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully!");

      window.location.href = "/dashboard";
    } catch (err) {
      toast.error("Login failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          EMAIL
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          placeholder="*********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
          disabled={isLoading}
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <BeatLoader color="#ffffff" size={10} />
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}

function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    agree: false 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: { target: { checked: any; }; }) => {
    setForm({ ...form, agree: e.target.checked });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (!form.agree) {
      alert("You must agree to the terms of service.");
      return;
    }
    
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("User Created successfully!");

      window.location.href = "/dashboard";
    } catch (err) {
      toast.error("Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          FULL NAME
        </label>
        <input
          name="name"
          type="text"
          id="name"
          placeholder="Enter Your Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus极速:border-blue-500 transition"
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          EMAIL
        </label>
        <input
          name="email"
          type="email"
          id="email"
          placeholder="Enter Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          PASSWORD
        </label>
        <input
          name="password"
          type="password"
          id="password"
          placeholder="*********"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id="agree"
            checked={form.agree}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="agree" className="text-gray-700">
            I agree All the Statements in <strong>Terms of service</strong>
          </label>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <BeatLoader color="#ffffff" size={10} />
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
}