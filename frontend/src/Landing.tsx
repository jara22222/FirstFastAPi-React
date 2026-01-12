import React from "react";
import { Link } from "react-router-dom";
import { Camera, Share2, Shield, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <div className="w-3 h-3 bg-current rounded-full" />
              </div>
              PixelShare
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Testimonials
              </a>
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-4">
            <a
              href="#features"
              className="block text-sm font-medium text-gray-600"
            >
              Features
            </a>
            <Link
              to="/login"
              className="block text-sm font-semibold text-gray-900"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="block w-full text-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Now Available in Beta v2.0
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
            Capture life,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              share the story.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            PixelShare is the modern platform for visual storytellers. Upload
            high-quality images, connect with a vibrant community, and showcase
            your portfolio with elegance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Start Sharing for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/feed"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
            >
              Explore the Feed
            </Link>
          </div>
        </div>

        {/* Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to create
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Powerful features designed for photographers, artists, and casual
              sharers alike.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="w-6 h-6 text-indigo-600" />,
                title: "High Res Uploads",
                desc: "Store your memories in crystal clear quality with our advanced compression algorithms that preserve detail.",
              },
              {
                icon: <Share2 className="w-6 h-6 text-purple-600" />,
                title: "Instant Sharing",
                desc: "Share your portfolio with a single link. Seamlessly integrate with other social platforms.",
              },
              {
                icon: <Shield className="w-6 h-6 text-pink-600" />,
                title: "Secure Storage",
                desc: "Your data is encrypted and backed up daily. You own your content, always.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all border border-gray-100 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-3xl overflow-hidden relative text-center py-16 px-6 sm:px-12 shadow-2xl shadow-indigo-500/20">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 to-purple-900/80"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to start your journey?
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                Join our community of over 10,000 creators sharing their stories
                today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-all transform hover:-translate-y-1"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-transparent border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <div className="w-3 h-3 bg-current rounded-full" />
              </div>
              PixelShare
            </div>
            <div className="text-gray-500 text-sm">
              © 2026 PixelShare Inc. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
