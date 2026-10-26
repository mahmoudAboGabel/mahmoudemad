"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getJSON, ENDPOINTS } from "../../Apiconfig";

const API_BASE_URL = "https://mahmoudemad.runasp.net";

function getResourceUrl(path) {
  if (!path) return "";

  // لو الرابط كامل بالفعل
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // تحويل المسار النسبي لرابط كامل
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function getResourceType(resource) {
  const type = (resource.resourceType || "").toLowerCase();
  const path = (resource.urlOrPath || "").toLowerCase();

  if (type === "image") return "image";
  if (type === "video") return "video";
  if (type === "link") return "link";

  if (
    type === "file" &&
    (path.endsWith(".pdf") || path.includes(".pdf?"))
  ) {
    return "pdf";
  }

  if (
    path.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)
  ) {
    return "image";
  }

  if (
    path.match(/\.(mp4|webm|ogg)(\?.*)?$/i)
  ) {
    return "video";
  }

  if (path.match(/\.pdf(\?.*)?$/i)) {
    return "pdf";
  }

  return "file";
}

export default function LessonDetailsContent() {
  const params = useParams();
  const lessonId = params?.id;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lessonId) return;

    let cancelled = false;

    async function fetchLesson() {
      setLoading(true);
      setError("");

      try {
        const url =
          typeof ENDPOINTS.GetLesson === "function"
            ? ENDPOINTS.GetLesson(lessonId)
            : `${API_BASE_URL}/api/Lessons/${lessonId}`;

        const data = await getJSON(url, true);

        if (cancelled) return;

        if (!data || !data.id) {
          throw new Error("لم يتم العثور على بيانات الدرس.");
        }

        setLesson(data);
      } catch (err) {
        if (cancelled) return;

        setError(
          err?.message ||
            "حدث خطأ أثناء تحميل الدرس. حاول مرة أخرى."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchLesson();

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4"
      >
        <div className="text-center space-y-4">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-indigo-500/20 border-b-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
          </div>
          <p className="text-cyan-400 font-medium tracking-wide animate-pulse">جاري تحميل بيئة الدرس البرمجية...</p>
        </div>
      </main>
    );
  }

  if (error || !lesson) {
    return (
      <main
        dir="rtl"
        className="min-h-[70vh] bg-slate-950 px-4 py-16 flex items-center justify-center"
      >
        <div className="mx-auto max-w-xl w-full rounded-3xl border border-red-500/30 bg-slate-900/80 backdrop-blur-xl p-8 text-center shadow-2xl shadow-red-950/50">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            ⚠️
          </div>
          <h1 className="mb-3 text-xl font-bold text-white">
            تعذر تحميل الدرس
          </h1>

          <p className="mb-8 text-sm text-red-400/90 leading-relaxed">
            {error || "بيانات الدرس غير متاحة."}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 font-semibold text-black transition hover:opacity-90 shadow-lg shadow-cyan-500/20"
            >
              إعادة المحاولة
            </button>

            <Link
              href="/"
              className="rounded-2xl border border-slate-700 bg-slate-800/50 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              العودة للدروس
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const resources = Array.isArray(lesson.resources)
    ? lesson.resources
    : [];

  const images = resources.filter(
    (resource) => getResourceType(resource) === "image"
  );

  const videos = resources.filter(
    (resource) => getResourceType(resource) === "video"
  );

  const documents = resources.filter((resource) => {
    const type = getResourceType(resource);
    return type === "pdf" || type === "file";
  });

  const links = resources.filter(
    (resource) => getResourceType(resource) === "link"
  );

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* رأس الصفحة العصري */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 px-4 py-12 text-white sm:py-16 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl relative z-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-cyan-400 transition hover:text-cyan-300 font-medium bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800"
          >
            <span aria-hidden="true">←</span>
            العودة إلى جميع الدروس
          </Link>

          <div className="mb-4">
            <span className="rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-bold tracking-wide text-cyan-400 border border-cyan-500/20">
              محتوى تفاعلي - الذكاء الاصطناعي
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-black leading-tight sm:text-4xl text-white tracking-tight">
            {lesson.title || "بدون عنوان"}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-slate-300">
            {lesson.description || "لا يوجد وصف لهذا الدرس."}
          </p>

          {lesson.createdAt && (
            <p className="mt-5 text-xs text-slate-400 flex items-center gap-2">
              <span className="text-cyan-400">📅</span>
              <span>تاريخ الإضافة:</span>
              <span className="font-semibold">{new Date(lesson.createdAt).toLocaleDateString("ar-EG")}</span>
            </p>
          )}
        </div>
      </section>

      {/* محتوى الدرس */}
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:py-12">
        {/* الشرح */}
        {lesson.explanation && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 text-xl border border-cyan-500/20">
                📘
              </span>
              شرح الدرس
            </h2>

            <div className="prose max-w-none text-slate-300 leading-9 whitespace-pre-wrap text-base font-normal">
              {lesson.explanation}
            </div>
          </section>
        )}

        {/* الملخص */}
        {lesson.summary && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 text-xl border border-emerald-500/20">
                📝
              </span>
              ملخص الدرس
            </h2>

            <div className="prose max-w-none text-slate-300 leading-9 whitespace-pre-wrap text-base font-normal">
              {lesson.summary}
            </div>
          </section>
        )}

        {/* الصور */}
        {images.length > 0 && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 text-xl border border-purple-500/20">
                🖼️
              </span>
              صور الدرس
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {images.map((resource) => (
                <a
                  key={resource.id}
                  href={getResourceUrl(resource.urlOrPath)}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg hover:border-cyan-500/40 transition-all"
                >
                  <div className="bg-slate-950 p-2 flex items-center justify-center">
                    <img
                      src={getResourceUrl(resource.urlOrPath)}
                      alt={resource.title || "صورة من الدرس"}
                      loading="lazy"
                      className="h-64 w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>

                  {resource.title && (
                    <p className="p-4 text-sm font-semibold text-slate-200 border-t border-slate-800/80 bg-slate-900/90">
                      {resource.title}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* الفيديوهات */}
        {videos.length > 0 && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 text-xl border border-rose-500/20">
                🎬
              </span>
              فيديوهات الدرس
            </h2>

            <div className="space-y-6">
              {videos.map((resource) => (
                <div
                  key={resource.id}
                  className="overflow-hidden rounded-2xl bg-black border border-slate-800 shadow-2xl"
                >
                  <video
                    controls
                    preload="metadata"
                    className="max-h-[550px] w-full"
                  >
                    <source
                      src={getResourceUrl(resource.urlOrPath)}
                    />
                    متصفحك لا يدعم تشغيل الفيديو.
                  </video>

                  {resource.title && (
                    <p className="bg-slate-900 border-t border-slate-800 p-4 text-sm font-semibold text-slate-200">
                      {resource.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* الملفات */}
        {documents.length > 0 && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 text-xl border border-amber-500/20">
                📂
              </span>
              ملفات ومراجع الدرس
            </h2>

            <div className="space-y-4">
              {documents.map((resource) => {
                const url = getResourceUrl(resource.urlOrPath);
                const isPdf = getResourceType(resource) === "pdf";

                return (
                  <div
                    key={resource.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 p-4 sm:flex-row sm:items-center bg-slate-950/60 hover:bg-slate-950 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 bg-slate-900 rounded-xl shadow-inner border border-slate-800">
                        {isPdf ? "📕" : "📄"}
                      </span>

                      <div>
                        <p className="font-bold text-slate-200">
                          {resource.title ||
                            (isPdf ? "ملف PDF" : "ملف مرفق")}
                        </p>

                        <p className="mt-1 text-xs text-slate-400 font-medium">
                          {isPdf ? "مستند PDF" : "ملف للتحميل أو العرض"}
                        </p>
                      </div>
                    </div>

                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-black transition hover:opacity-90 shadow-md shadow-cyan-500/20"
                    >
                      {isPdf ? "عرض الملف" : "فتح الملف"}
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* الروابط */}
        {links.length > 0 && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 text-xl border border-blue-500/20">
                🔗
              </span>
              روابط إضافية
            </h2>

            <div className="space-y-3">
              {links.map((resource) => (
                <a
                  key={resource.id}
                  href={getResourceUrl(resource.urlOrPath)}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all rounded-2xl border border-slate-800 p-4 text-cyan-400 font-medium transition hover:bg-slate-950 bg-slate-950/60"
                >
                  {resource.title || resource.urlOrPath}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* لا توجد موارد */}
        {resources.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center shadow-xl">
            <p className="mb-3 text-4xl">📚</p>
            <h2 className="font-bold text-white text-lg">
              لا توجد موارد مرفقة
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              لم تتم إضافة صور أو فيديوهات أو ملفات لهذا الدرس حتى الآن.
            </p>
          </div>
        )}

        {/* العودة */}
        <div className="pb-8 text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 py-3.5 font-bold text-black transition hover:opacity-90 shadow-xl shadow-cyan-500/20"
          >
            العودة إلى قائمة الدروس
          </Link>
        </div>
      </div>
    </main>
  );
}