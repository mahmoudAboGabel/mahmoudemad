'use client';

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ENDPOINTS,
  getJSON,
  getAuthToken,
  clearAuthTokens,
} from "@/app/Apiconfig";

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let requestId = 0;

    async function loadCurrentUser() {
      const currentRequestId = ++requestId;
      const token = getAuthToken();

      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoadingUser(false);
        }
        return;
      }

      try {
        const data = await getJSON(ENDPOINTS.GetCurrentUser);

        const currentUser =
          data?.user ??
          data?.User ??
          data?.data?.user ??
          data?.data?.User ??
          data?.data ??
          data;

        if (isMounted && currentRequestId === requestId) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to load current user:", error);

        if (isMounted && currentRequestId === requestId) {
          if (!getAuthToken()) {
            setUser(null);
          }
        }
      } finally {
        if (isMounted && currentRequestId === requestId) {
          setLoadingUser(false);
        }
      }
    }

    function handleAuthChange() {
      loadCurrentUser();
    }

    loadCurrentUser();

    window.addEventListener("auth-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener("auth-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  function handleLogout() {
    clearAuthTokens();
    setUser(null);
    window.location.href = "/";
  }

  const userName =
    user?.fullName ||
    user?.name ||
    user?.userName ||
    user?.username ||
    user?.email ||
    "المستخدم";

  const isLoggedIn = Boolean(user);

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-black antialiased">
        {/* Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            {/* الشعار وزر قائمة الموبايل */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800 hover:bg-slate-800 transition-colors"
                aria-label="القائمة"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  AI
                </div>
                <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  البرمجة والذكاء الاصطناعي
                </span>
              </Link>
            </div>

            {/* روابط التنقل للشاشات الكبيرة */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800 text-sm font-medium">
              <Link href="/" className="px-4 py-2 rounded-full hover:bg-slate-800 hover:text-cyan-400 transition-all">
                الرئيسية
              </Link>
              <Link href="/CourseInformation" className="px-4 py-2 rounded-full hover:bg-slate-800 hover:text-cyan-400 transition-all">
                عن المقرر
              </Link>
              <Link href="/About" className="px-4 py-2 rounded-full hover:bg-slate-800 hover:text-cyan-400 transition-all">
                المعلم
              </Link>

              {/* المساعد الذكي يظهر فقط عند تسجيل الدخول */}
              {isLoggedIn && (
                <Link href="/smarthelper" className="px-4 py-2 rounded-full hover:bg-slate-800 hover:text-cyan-400 transition-all text-cyan-300">
                  المساعد الذكي
                </Link>
              )}

              <Link href="/Supervision" className="px-4 py-2 rounded-full hover:bg-slate-800 hover:text-cyan-400 transition-all">
                الإشراف
              </Link>
              <Link href="/Instructions" className="px-4 py-2 rounded-full hover:bg-slate-800 hover:text-cyan-400 transition-all">
                التعليمات
              </Link>
            </nav>

            {/* جهة اليسار: بيانات المستخدم وأزرار تسجيل الدخول والخروج */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <div className="font-bold text-xs sm:text-sm text-white max-w-[120px] truncate">
                      {userName}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-medium">
                      مرحبًا بك
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors rounded-xl px-3 py-2 bg-red-500/10 border border-red-500/20"
                    title="تسجيل الخروج"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">خروج</span>
                  </button>
                </div>
              ) : (
                !loadingUser && (
                  <Link
                    href="/users/login"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-md shadow-cyan-500/20"
                  >
                    تسجيل الدخول
                  </Link>
                )
              )}
            </div>

          </div>

          {/* قائمة الموبايل المنسدلة */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-2 p-3 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl flex flex-col gap-2 text-sm font-medium text-slate-300">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-cyan-400 transition-all"
              >
                📚 الرئيسية
              </Link>
              <Link
                href="/CourseInformation"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-cyan-400 transition-all"
              >
                📋 عن المقرر
              </Link>
              <Link
                href="/About"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-cyan-400 transition-all"
              >
                👨‍🏫 المعلم
              </Link>

              {/* المساعد الذكي في الموبايل يظهر فقط عند تسجيل الدخول */}
              {isLoggedIn && (
                <Link
                  href="/smarthelper"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                >
                  🤖 المساعد الذكي
                </Link>
              )}

              <Link
                href="/Supervision"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-cyan-400 transition-all"
              >
                🎓 الإشراف
              </Link>
              <Link
                href="/Instructions"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-cyan-400 transition-all"
              >
                💡 التعليمات
              </Link>
            </nav>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12 text-center text-slate-500 text-sm">
          <p>© 2026 منصة البرمجة والذكاء الاصطناعي - الصف الثاني بكالوريا</p>
        </footer>
      </body>
    </html>
  );
}