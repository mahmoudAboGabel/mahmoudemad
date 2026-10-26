'use client';

import { useState } from 'react';
import {
  ENDPOINTS,
  postJSON,
  getAuthToken
} from '../Apiconfig';

export default function SmartHelperPage() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'ما هو تعريف الذكاء الاصطناعي',
    'قارن بين البرمجة و الذكاء الاصطناعي',
    'ما أهمية الذكاء الاصطناعي',
    'مجالات أستخدام الذكاء الأصطناعي'
  ];

  // تحويل الصور والفيديوهات إلى Array
  const parseMedia = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  const handleSend = async (textToSend) => {
    const q = (textToSend || question).trim();

    if (!q || loading) return;

    const chatId = Date.now();

    setLoading(true);
    setQuestion('');

    setChatHistory((prev) => [
      {
        id: chatId,
        question: q,
        answer: '',
        images: [],
        videos: [],
        loading: true,
        error: false
      },
      ...prev
    ]);

    try {
      // استدعاء ASP.NET API
      const response = await postJSON(
        ENDPOINTS.askAi,
        {
          question: q
        },
        true // إرسال Access Token تلقائياً
      );

      // دعم اختلاف شكل الاستجابة
      const data = response?.data ?? response;

      // لو الـ API رجّع JSON داخل string
      const result =
        typeof data === 'string' ? JSON.parse(data) : data;

      const answer =
        result?.aiResponseText ??
        result?.AiResponseText ??
        result?.answer ??
        result?.response ??
        '';

      const images = parseMedia(
        result?.imagesJson ?? result?.ImagesJson
      );

      const videos = parseMedia(
        result?.videosJson ?? result?.VideosJson
      );

      if (!answer && images.length === 0 && videos.length === 0) {
        throw new Error('لم يتم العثور على رد في استجابة المساعد الذكي.');
      }

      setChatHistory((prev) =>
        prev.map((item) =>
          item.id === chatId
            ? {
                ...item,
                answer:
                  typeof answer === 'string'
                    ? answer
                    : JSON.stringify(answer),
                images,
                videos,
                loading: false
              }
            : item
        )
      );
    } catch (error) {
      console.error('AI API Error:', error);

      setChatHistory((prev) =>
        prev.map((item) =>
          item.id === chatId
            ? {
                ...item,
                answer:
                  error?.message ||
                  'تعذر الاتصال بالمساعد الذكي حالياً.',
                loading: false,
                error: true
              }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 flex flex-col items-center min-h-[650px] relative overflow-hidden">
        {/* خلفية ضوئية جمالية */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* العنوان */}
        <div className="w-full flex flex-col items-center relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-cyan-500/20 mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 text-center tracking-tight">
            المساعد الذكي لمادة البرمجة والذكاء الاصطناعي
          </h1>

          <p className="text-cyan-400 text-xs sm:text-sm font-medium mb-8 text-center bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
            تُحفظ استفساراتك تلقائياً في السجل الرقمي للطالب
          </p>

          {/* الأسئلة المقترحة */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sq)}
                disabled={loading}
                className="bg-slate-950/60 hover:bg-slate-950 hover:border-cyan-500/40 disabled:opacity-50 text-slate-300 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-800 transition-all shadow-sm"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* المحادثات */}
          {chatHistory.length > 0 && (
            <div className="w-full space-y-6 mb-6">
              {chatHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4"
                >
                  {/* السؤال */}
                  <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                    <span>👤 سؤالك:</span>
                    <span className="text-slate-200 font-medium">{item.question}</span>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3">
                    {/* الإجابة */}
                    <div className="text-xs font-semibold text-indigo-400 mb-2 flex items-center gap-1.5">
                      <span>🤖</span> إجابة المساعد الذكي:
                    </div>

                    {item.loading ? (
                      <div className="text-sm text-cyan-400/80 animate-pulse flex items-center gap-2 py-2">
                        <div className="w-4 h-4 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                        جاري توليد الإجابة البرمجية...
                      </div>
                    ) : (
                      <div
                        className={`text-sm leading-8 whitespace-pre-wrap break-words ${
                          item.error ? 'text-red-400' : 'text-slate-300'
                        }`}
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>

                  {/* الصور */}
                  {item.images?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80">
                      <h3 className="font-bold text-xs text-slate-400 mb-3 flex items-center gap-1">
                        <span>🖼️</span> الصور المرفقة
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.images.map((image, index) => {
                          const url =
                            typeof image === 'string'
                              ? image
                              : image?.url ??
                                image?.imageUrl ??
                                image?.src;

                          if (!url) return null;

                          return (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900 block"
                            >
                              <img
                                src={url}
                                alt={`صورة توضيحية ${index + 1}`}
                                className="w-full max-h-60 object-contain p-1 group-hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* الفيديوهات */}
                  {item.videos?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80">
                      <h3 className="font-bold text-xs text-slate-400 mb-3 flex items-center gap-1">
                        <span>🎬</span> الفيديوهات التعليمية
                      </h3>

                      <div className="space-y-3">
                        {item.videos.map((video, index) => {
                          const url =
                            typeof video === 'string'
                              ? video
                              : video?.url ??
                                video?.videoUrl ??
                                video?.src;

                          if (!url) return null;

                          return (
                            <div key={index} className="overflow-hidden rounded-xl border border-slate-800 bg-black">
                              <video
                                src={url}
                                controls
                                preload="metadata"
                                className="w-full max-h-80"
                              >
                                متصفحك لا يدعم تشغيل الفيديو.
                              </video>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* إدخال السؤال */}
        <div className="w-full relative mt-auto pt-4 z-10">
          <input
            type="text"
            placeholder="اكتب سؤالك في البرمجة أو الذكاء الاصطناعي..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && handleSend(question)
            }
            disabled={loading}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-4 px-5 pl-16 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all disabled:opacity-60 shadow-inner"
          />

          <button
            onClick={() => handleSend(question)}
            disabled={loading || !question.trim()}
            aria-label="إرسال السؤال"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-black rounded-xl flex items-center justify-center shadow-md shadow-cyan-500/20 transition-all"
          >
            <svg
              className="w-5 h-5 rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}