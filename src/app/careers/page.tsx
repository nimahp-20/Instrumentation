import React from 'react';

export default function CareersPage() {
  const positions = [
    {
      title: "توسعه‌دهنده فرانت‌اند",
      department: "فناوری",
      location: "تهران",
      type: "تمام وقت",
      description: "ما به دنبال یک توسعه‌دهنده فرانت‌اند با تجربه در React و Next.js هستیم."
    },
    {
      title: "توسعه‌دهنده بک‌اند",
      department: "فناوری", 
      location: "تهران",
      type: "تمام وقت",
      description: "به دنبال توسعه‌دهنده بک‌اند با تجربه در Node.js و MongoDB هستیم."
    },
    {
      title: "طراح UI/UX",
      department: "طراحی",
      location: "تهران",
      type: "تمام وقت",
      description: "به دنبال طراح خلاق و با تجربه در طراحی رابط کاربری هستیم."
    }
  ];

  const benefits = [
    {
      icon: "💰",
      title: "حقوق رقابتی",
      description: "حقوق و مزایای رقابتی در بازار"
    },
    {
      icon: "🏠",
      title: "کار از راه دور",
      description: "امکان کار از راه دور و انعطاف‌پذیری"
    },
    {
      icon: "📚",
      title: "آموزش و توسعه",
      description: "دوره‌های آموزشی و فرصت‌های یادگیری"
    },
    {
      icon: "🏥",
      title: "بیمه درمان",
      description: "پوشش کامل بیمه درمانی"
    },
    {
      icon: "🎉",
      title: "تفریحات تیمی",
      description: "فعالیت‌های تفریحی و تیم‌بیلدینگ"
    },
    {
      icon: "☕",
      title: "محیط دوستانه",
      description: "محیط کاری صمیمی و دوستانه"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            فرصت‌های شغلی
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            به تیم ما بپیوندید و در ساخت آینده تجارت الکترونیک مشارکت کنید
          </p>
        </div>

        {/* Company Culture */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            فرهنگ سازمانی ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">ارزش‌های ما</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  نوآوری و خلاقیت در همه جنبه‌های کار
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  کار تیمی و همکاری صمیمانه
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  شفافیت و صداقت در روابط
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  تعهد به رشد و یادگیری مداوم
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">چرا ما؟</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">→</span>
                  پروژه‌های چالش‌برانگیز و جذاب
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">→</span>
                  محیط کاری مدرن و پویا
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">→</span>
                  فرصت‌های رشد و پیشرفت شغلی
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">→</span>
                  تعادل بین کار و زندگی
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            مزایا و امکانات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            موقعیت‌های شغلی باز
          </h2>
          <div className="space-y-6">
            {positions.map((position, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {position.department}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {position.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
                    درخواست شغل
                  </button>
                </div>
                <p className="text-gray-600">{position.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            آماده پیوستن به تیم ما هستید؟
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            اگر موقعیت مناسب خود را پیدا نکردید، باز هم رزومه خود را برای ما ارسال کنید. 
            ما همیشه به دنبال استعدادهای جدید هستیم.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@example.com"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              ارسال رزومه
            </a>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              تماس با ما
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
