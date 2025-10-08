import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            درباره ما
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ما یک تیم متخصص هستیم که با هدف ارائه بهترین تجربه خرید آنلاین برای شما تلاش می‌کنیم
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ماموریت ما
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              ماموریت ما ارائه بهترین محصولات با کیفیت بالا و قیمت مناسب به مشتریان عزیز است. 
              ما اعتقاد داریم که هر مشتری باید تجربه خرید منحصر به فردی داشته باشد.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              چشم‌انداز ما
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              ما می‌خواهیم به یکی از معتبرترین و محبوب‌ترین فروشگاه‌های آنلاین در منطقه تبدیل شویم، 
              جایی که مشتریان همیشه بهترین محصولات را با اعتماد کامل خریداری کنند.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            ارزش‌های ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">کیفیت</h3>
              <p className="text-gray-600">ما تنها محصولات با کیفیت بالا را ارائه می‌دهیم</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">امنیت</h3>
              <p className="text-gray-600">اطلاعات و تراکنش‌های شما کاملاً محفوظ است</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">پشتیبانی</h3>
              <p className="text-gray-600">تیم پشتیبانی ما همیشه آماده کمک به شماست</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            تیم ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">اح</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">احمد محمدی</h3>
              <p className="text-gray-600 mb-4">مدیر عامل</p>
              <p className="text-gray-500 text-sm">
                بیش از 10 سال تجربه در زمینه تجارت الکترونیک
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">س</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">سارا احمدی</h3>
              <p className="text-gray-600 mb-4">مدیر فنی</p>
              <p className="text-gray-500 text-sm">
                متخصص در توسعه نرم‌افزار و مدیریت پروژه
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">ع</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">علی رضایی</h3>
              <p className="text-gray-600 mb-4">مدیر بازاریابی</p>
              <p className="text-gray-500 text-sm">
                متخصص در بازاریابی دیجیتال و مدیریت مشتری
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
