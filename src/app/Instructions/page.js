// src/app/Instructions/page.js
export default function InstructionsPage() {
  const steps = [
    { title: "التنقل بين الدروس", desc: "يمكنك الوصول لجميع الدروس من الصفحة الرئيسية بالنقر على زر (عرض تفاصيل الدرس).", icon: "🧭" },
    { title: "الاطلاع على بيانات المقرر", desc: "استخدم شريط التنقل العلوي لمعرفة أهداف المنهج والسنة الدراسية.", icon: "📋" },
    { title: "التواصل والإشراف", desc: "يمكنك استعراض المشرفين والمعلم المسؤول لمعرفة خلفية المحتوى.", icon: "🤝" },
    { title: "عرض المرفقات والوسائط", desc: "يوجد في الصفحة الرئيسية قسم لمعاينة الصور التوضيحية المرفقة مع المقرر.", icon: "🖼️" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          دليل الاستخدام
        </span>
        <h1 className="text-3xl font-bold text-white">التعليمات وإرشادات المنصة</h1>
        <p className="text-slate-400 text-sm">كيفية التنقل والاستفادة القصوى من محتوى الذكاء الاصطناعي</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{step.icon}</span>
                <h3 className="font-bold text-white text-base">{step.title}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}