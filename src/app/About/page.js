// src/app/About/page.js
export default function AboutPage() {
  const teacherDetails = [
    { label: "اسم المعلم", value: "محمود عماد حمدي حسن", icon: "👨‍🏫", highlight: true },
    { label: "الفرقة الدراسية", value: "الفرقة الرابعة", icon: "🎓" },
    { label: "القسم الأكاديمي", value: "تكنولوجيا التعليم", icon: "💻" },
    { label: "الشعبة", value: "معلم حاسب ألي", icon: "🖥️" },
    { label: "العام الجامعي", value: "2026 - 2027", icon: "📅" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          البطاقة التعريفية
        </span>
        <h1 className="text-3xl font-bold text-white">عن مُعِـدّ المنصة والمعلم</h1>
        <p className="text-slate-400 text-sm">بيانات معلّم المادة والمُصمّم للمحتوى التعليمي الرقمي</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-5 border-b border-slate-800 pb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-3xl text-black font-bold shadow-lg shadow-cyan-500/20">
            👨‍💻
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">محمود عماد حمدي حسن</h2>
            <p className="text-cyan-400 text-sm">معلم حاسب آلي وتكنولوجيا التعليم</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teacherDetails.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border bg-slate-950/60 ${
                item.highlight ? "border-cyan-500/40 bg-cyan-500/5" : "border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="text-base font-semibold text-slate-200 mt-0.5">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}