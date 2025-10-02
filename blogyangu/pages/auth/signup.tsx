import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/auth/signin?message=Account created successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 dark:bg-gray-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full bg-card text-foreground dark:bg-gray-900 dark:text-gray-100 border border-border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-foreground">
            Create your account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Fill in the details to sign up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-600 border border-red-400 text-white px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground">
                  Username *
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-foreground">
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={formData.displayName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

             <div className="flex flex-col md:flex-row md:space-x-4">
  <div className="w-full md:w-1/2">
    <label htmlFor="password" className="block text-sm font-medium text-foreground">
      Password *
    </label>
    <input
      id="password"
      name="password"
      type="password"
      required
      className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
      value={formData.password}
      onChange={handleChange}
    />
  </div>

  <div className="w-full md:w-1/2 mt-4 md:mt-0">
    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
      Confirm Password *
    </label>
    <input
      id="confirmPassword"
      name="confirmPassword"
      type="password"
      required
      className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
      value={formData.confirmPassword}
      onChange={handleChange}
    />
  </div>
</div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-muted-foreground">OR</span>
          </div>

          <button
            onClick={() => window.location.href = "/api/auth/signin"}
            className="w-full flex justify-center items-center py-2 px-4 border border-input text-sm font-medium rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.24 10.4V13.6H16.06C15.92 14.44 15.48 15.24 14.76 15.88V18.24H17.36C18.92 16.88 19.8 14.96 19.8 12.8C19.8 11.92 19.64 11.08 19.36 10.32L12.24 10.4Z" fill="#4285F4"/>
              <path d="M12 20C14.96 20 17.44 18.92 19.36 16.88L14.76 15.88C13.6 16.64 12.24 17.2 12 17.2C9.16 17.2 6.76 15.12 5.92 12.48H3.24V14.88C5.16 18.48 8.44 20 12 20Z" fill="#34A853"/>
              <path d="M5.92 12.48C5.72 11.84 5.6 11.16 5.6 10.4C5.6 9.64 5.72 8.96 5.92 8.32V5.92H3.24C2.56 7.36 2.2 8.96 2.2 10.4C2.2 11.84 2.56 13.44 3.24 14.88L5.92 12.48Z" fill="#FBBC05"/>
              <path d="M12 7.2C13.48 7.2 14.84 7.76 15.88 8.76L18.16 6.48C17.44 5.8 16.44 5.32 15.36 5.04C13.44 4.52 12 4.52 10.08 5.04L7.8 7.32C8.84 6.32 10.2 5.76 12 5.76V7.2Z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}