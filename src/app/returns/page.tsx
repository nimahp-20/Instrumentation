import React from 'react';

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: "1",
      title: "درخواست بازگشت",
      description: "از طریق حساب کاربری یا تماس با ما درخواست بازگشت دهید",
      icon: "📝"
    },
    {
      step: "2", 
      title: "تایید درخواست",
      description: "تیم ما درخواست شما را بررسی و تایید می‌کند",
      icon: "✅"
    },
    {
      step: "3",
      title: "ارسال محصول",
      description: "محصول را به آدرس ما ارسال کنید",
      icon: "📦"
    },
    {
      step: "4",
      title: "بازپرداخت",
      description: "پس از بررسی، مبلغ به حساب شما بازگردانده می‌شود",
      icon: "💰"
    }
  ];

  const conditions = [
    {
      title: "محصولات قابل بازگشت",
      items: [
        "محصولات الکترونیکی تا 7 روز پس از تحویل",
        "پوشاک و لوازم شخصی تا 14 روز پس از تحویل",
        "کتاب‌ها و محصولات فرهنگی تا 30 روز پس از تحویل"
      ]
    },
    {
      title: "محصولات غیرقابل بازگشت",
      items: [
        "محصولات بهداشتی و آرایشی",
        "محصولات شخصی‌سازی شده",
        "محصولات فاسدشدنی",
        "محصولات آسیب‌دیده توسط مشتری"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            سیاست بازگشت
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اطلاعات کامل درباره قوانین و شرایط بازگشت و تعویض محصولات
          </p>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            فرآیند بازگشت
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{conditions[0].title}</h2>
            </div>
            <ul className="space-y-3">
              {conditions[0].items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{conditions[1].title}</h2>
            </div>
            <ul className="space-y-3">
              {conditions[1].items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-3">✗</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            اطلاعات مهم
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">زمان بازگشت</h3>
              <p className="text-gray-600">بازگشت وجه ظرف 3-5 روز کاری پس از دریافت محصول</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">هزینه بازگشت</h3>
              <p className="text-gray-600">هزینه ارسال بازگشت بر عهده مشتری است</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">شرایط محصول</h3>
              <p className="text-gray-600">محصول باید در شرایط اولیه و بدون استفاده باشد</p>
            </div>
          </div>
        </div>

        {/* Return Form */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            درخواست بازگشت
          </h2>
          <form className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  شماره سفارش
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="شماره سفارش خود را وارد کنید"
                />
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  دلیل بازگشت
                </label>
                <select
                  id="reason"
                  name="reason"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="defective">محصول معیوب</option>
                  <option value="wrong">محصول اشتباه</option>
                  <option value="not-satisfied">عدم رضایت</option>
                  <option value="other">سایر موارد</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="توضیحات بیشتری درباره دلیل بازگشت ارائه دهید..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 font-medium"
            >
              ارسال درخواست بازگشت
            </button>
          </form>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            نیاز به کمک دارید؟
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            تیم پشتیبانی ما آماده کمک به شما در فرآیند بازگشت و تعویض محصولات است
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              تماس با ما
            </a>
            <a
              href="tel:+982112345678"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              تماس تلفنی
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
