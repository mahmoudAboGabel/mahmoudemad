// src/app/CourseInformation/page.js
export default function CourseInformationPage() {
  const courseDetails = [
    { label: "اسم المقرر الدراسي", value: "البرمجة والذكاء الاصطناعي", icon: "⚡" },
    { label: "المرحلة الدراسية", value: "الصف الثاني بكالوريا", icon: "🏫" },
    { label: "الفصل الدراسي", value: "الصف الدراسي الأول", icon: "📖" },
    { label: "العام الدراسي", value: "2026 م", icon: "🗓️" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          تفاصل المنهج
        </span>
        <h1 className="text-3xl font-bold text-white">بيانات المقرر الدراسي</h1>
        <p className="text-slate-400 text-sm">تأصيل وتفاصيل مادة البرمجة والذكاء الاصطناعي المعتمدة</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courseDetails.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div>
                <span className="text-xs text-slate-500 block">{item.label}</span>
                <span className="text-base font-bold text-white">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
          <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            🎯 أهداف المقرر العامة:
          </h3>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
            <li>تمكين الطالب من الفهم العميق لأساسيات خوارزميات الذكاء الاصطناعي.</li>
            <li>إكساب المهارات التطبيقية للبرمجة باستخدام الأساليب واللغات الحديثة.</li>
            <li>القدرة على تحليل وتقييم حلول الذكاء الاصطناعي وتطبيقها في الحياة اليومية.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}