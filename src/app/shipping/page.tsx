import React from 'react';

export default function ShippingPage() {
  const shippingMethods = [
    {
      name: "ارسال عادی",
      duration: "3-5 روز کاری",
      cost: "رایگان برای خرید بالای 500,000 تومان",
      description: "ارسال به تمام نقاط کشور با پست عادی"
    },
    {
      name: "ارسال سریع",
      duration: "1-2 روز کاری", 
      cost: "25,000 تومان",
      description: "ارسال با پست پیشتاز به مراکز استان‌ها"
    },
    {
      name: "ارسال فوری",
      duration: "همان روز",
      cost: "50,000 تومان",
      description: "ارسال فوری در تهران (فقط شهر تهران)"
    }
  ];

  const coverage = [
    {
      city: "تهران",
      duration: "1-2 روز کاری",
      freeShipping: "خرید بالای 300,000 تومان"
    },
    {
      city: "اصفهان، شیراز، مشهد",
      duration: "2-3 روز کاری", 
      freeShipping: "خرید بالای 400,000 تومان"
    },
    {
      city: "سایر شهرها",
      duration: "3-5 روز کاری",
      freeShipping: "خرید بالای 500,000 تومان"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            اطلاعات ارسال
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            تمام اطلاعات مورد نیاز درباره روش‌ها، هزینه‌ها و زمان ارسال سفارشات
          </p>
        </div>

        {/* Shipping Methods */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            روش‌های ارسال
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingMethods.map((method, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.name}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">زمان: {method.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-gray-600">{method.cost}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Areas */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            پوشش ارسال
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coverage.map((area, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{area.city}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">زمان ارسال:</span>
                    <span className="font-medium">{area.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ارسال رایگان:</span>
                    <span className="font-medium text-green-600">{area.freeShipping}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Process */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            فرآیند ارسال
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ثبت سفارش</h3>
              <p className="text-gray-600 text-sm">سفارش شما ثبت و پردازش می‌شود</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">آماده‌سازی</h3>
              <p className="text-gray-600 text-sm">محصولات بسته‌بندی و آماده ارسال می‌شوند</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ارسال</h3>
              <p className="text-gray-600 text-sm">سفارش با روش انتخابی ارسال می‌شود</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">تحویل</h3>
              <p className="text-gray-600 text-sm">سفارش به آدرس شما تحویل داده می‌شود</p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            نکات مهم
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-600 mr-3">⚠️</span>
              <span>لطفاً آدرس دقیق و کامل خود را وارد کنید</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-3">⚠️</span>
              <span>در صورت عدم حضور، سفارش به همسایه تحویل داده می‌شود</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-3">⚠️</span>
              <span>زمان‌های تعطیل رسمی در زمان‌بندی ارسال محاسبه نمی‌شود</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-3">⚠️</span>
              <span>در صورت مشکل در تحویل، با ما تماس بگیرید</span>
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            سوالی درباره ارسال دارید؟
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شما درباره ارسال و تحویل سفارشات است
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              تماس با ما
            </a>
            <a
              href="/help"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              راهنمای خرید
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
