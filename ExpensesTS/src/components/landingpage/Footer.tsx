import { ShieldCheck, FileText, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <p className="mb-6 text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="font-semibold text-white">FinanceMaster</span>. All rights reserved.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
          <a href="#" className="flex items-center gap-2 hover:text-green-400 transition-colors">
            <ShieldCheck className="w-4 h-4" />
            Privacy Policy
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-green-400 transition-colors">
            <FileText className="w-4 h-4" />
            Terms of Service
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-green-400 transition-colors">
            <Mail className="w-4 h-4" />
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
