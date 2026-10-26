"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getJSON, ENDPOINTS } from "./Apiconfig";

const API_BASE_URL = "https://mahmoudemad.runasp.net";

export default function HomePage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchLessons() {
      setLoading(true);
      setError("");

      try {
        const url =
          typeof ENDPOINTS.GetAllLessons === "string"
            ? ENDPOINTS.GetAllLessons
            : `${API_BASE_URL}/api/lessons`;

        const data = await getJSON(url, true);

        if (cancelled) return;

        // استخراج المصفوفة سواء رجعت مباشرة أو داخل مفتاح آخر
        const lessonsList = Array.isArray(data)
          ? data
          : data?.data ?? data?.items ?? [];

        // تخزين البيانات ديناميكياً مع أخذ العنوان والوصف من الـ API
        const formattedLessons = lessonsList.map((item, index) => ({
          id: item.id || index + 1,
          title: item.title || `الدرس رقم ${index + 1}`,
          desc: item.description || "لا يوجد وصف متاح لهذا الدرس حالياً.",
          duration: "45 دقيقة", // قيمة افتراضية تكميلية للتصميم
          icon: ["🤖", "🐍", "🧠", "🌐", "⚡", "💻"][index % 6], // أيقونات تتناوب جمالياً
          gradient: [
            "from-cyan-500/20 via-slate-900 to-slate-900",
            "from-indigo-500/20 via-slate-900 to-slate-900",
            "from-purple-500/20 via-slate-900 to-slate-900",
            "from-emerald-500/20 via-slate-900 to-slate-900",
          ][index % 4],
          borderColor: [
            "border-cyan-500/30",
            "border-indigo-500/30",
            "border-purple-500/30",
            "border-emerald-500/30",
          ][index % 4],
          tag: `الدرس ${index + 1}`,
        }));

        setLessons(formattedLessons);
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.message || "حدث خطأ أثناء تحميل قائمة الدروس. حاول مرة أخرى."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchLessons();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 text-center space-y-6 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          المقرر الدراسي العام 2026
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
          رحلتك نحو إتقان <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">البرمجة والذكاء الاصطناعي</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          منصة تعليمية تفاعلية مخصصة لطلاب الصف الثاني بكالوريا لتسهيل فهم الدروس والتطبيقات البرمجية الحديثة.
        </p>
      </section>

      {/* Lessons Cards Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">📚</span> دروس المقرر الدراسي
          </h2>
          <span className="text-sm text-slate-400">
            {loading ? "جاري التحميل..." : `${lessons.length} دروس متاحة`}
          </span>
        </div>

        {/* حالة التحميل */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            </div>
          </div>
        )}

        {/* حالة الخطأ */}
        {error && !loading && (
          <div className="rounded-2xl border border-red-500/30 bg-slate-900 p-6 text-center text-red-400">
            <p>{error}</p>
          </div>
        )}

        {/* عرض الدروس بعد جلبها من الـ API */}
        {!loading && !error && lessons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`group relative rounded-2xl p-6 bg-gradient-to-br ${lesson.gradient} border ${lesson.borderColor} hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-cyan-500/5`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{lesson.icon}</span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {lesson.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {lesson.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    ⏱️ {lesson.duration}
                  </span>
                  <Link
                    href={`/lessons/${lesson.id}`}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black transition-all shadow-sm"
                  >
                    عرض تفاصيل الدرس ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* إذا لم تكن هناك دروس */}
        {!loading && !error && lessons.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
            لا توجد دروس مضافة حالياً.
          </div>
        )}
      </section>

      {/* Gallery Section for Provided Images */}
      {/* <section className="rounded-2xl p-8 bg-slate-900/50 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-indigo-400">🖼️</span> معرض الصور والمستندات المرفقة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video group">
            <Image
              src="../src//WhatsApp Image 2025-04-20 at 4.45.40 PM.jpeg"
              alt="صورة توضيحية 1"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video group">
            <Image
              src="/images/WhatsApp Image 2025-04-20 at 4.45.41 PM - Copy.jpeg"
              alt="صورة توضيحية 2"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section> */}
    </div>
  );
}