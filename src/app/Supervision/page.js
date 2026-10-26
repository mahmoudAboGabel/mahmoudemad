// src/app/Supervision/page.js
export default function SupervisionPage() {
  const supervisors = [
    { name: "أ.د / محمد مسعد", role: "المشرف الأول على المشروع والمادة", icon: "👨‍🏫" },
    { name: "أ.د / أحمد نوفل", role: "المشرف الثاني على المشروع والمادة", icon: "👨‍🏫" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          الهيئة الأكاديمية
        </span>
        <h1 className="text-3xl font-bold text-white">صفحة الإشراف الأكاديمي</h1>
        <p className="text-slate-400 text-sm">تحت إشراف وقيم القامات الأكاديمية بالمؤسسة التعليمية</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {supervisors.map((sup, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-3xl p-8 text-center space-y-4 transition-all"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
              {sup.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{sup.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{sup.role}</p>
            </div>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-slate-950 text-purple-300 border border-slate-800">
                إشراف علمي وتطويري
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}