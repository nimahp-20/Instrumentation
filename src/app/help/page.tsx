import React from 'react';

export default function HelpPage() {
  const faqs = [
    {
      question: "چگونه می‌توانم سفارش خود را ثبت کنم؟",
      answer: "برای ثبت سفارش، ابتدا محصول مورد نظر خود را انتخاب کرده و به سبد خرید اضافه کنید. سپس روی دکمه 'تکمیل خرید' کلیک کرده و اطلاعات خود را وارد کنید."
    },
    {
      question: "آیا امکان بازگشت محصول وجود دارد؟",
      answer: "بله، شما می‌توانید تا 7 روز پس از دریافت محصول، درخواست بازگشت دهید. محصول باید در شرایط اولیه باشد."
    },
    {
      question: "زمان ارسال سفارش چقدر است؟",
      answer: "سفارشات معمولاً ظرف 1-3 روز کاری آماده و ارسال می‌شوند. زمان تحویل بستگی به شهر مقصد دارد."
    },
    {
      question: "چگونه می‌توانم وضعیت سفارش خود را پیگیری کنم؟",
      answer: "پس از ثبت سفارش، کد پیگیری به شما ارسال می‌شود. می‌توانید با استفاده از این کد، وضعیت سفارش را در بخش 'پیگیری سفارش' مشاهده کنید."
    },
    {
      question: "چه روش‌های پرداختی پذیرفته می‌شود؟",
      answer: "ما انواع روش‌های پرداخت شامل کارت‌های بانکی، پرداخت آنلاین، و پرداخت در محل را پذیرا هستیم."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            راهنمای خرید
          </h1>
          <p className="text-xl text-gray-600">
            پاسخ سوالات متداول و راهنمای کامل خرید
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو در سوالات متداول..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">خرید و سفارش</h3>
            <p className="text-gray-600 text-sm">راهنمای خرید و ثبت سفارش</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ارسال و تحویل</h3>
            <p className="text-gray-600 text-sm">اطلاعات مربوط به ارسال سفارش</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">بازگشت و تعویض</h3>
            <p className="text-gray-600 text-sm">قوانین بازگشت و تعویض محصول</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            سوالات متداول
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            هنوز پاسخ سوال خود را پیدا نکردید؟
          </h2>
          <p className="text-blue-100 mb-6">
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              تماس با ما
            </a>
            <a
              href="tel:+982112345678"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              تماس تلفنی
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
