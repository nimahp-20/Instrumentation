'use client';

import React from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

interface OrdersTabProps {
  orders: Order[];
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'تحویل شده';
      case 'shipped':
        return 'ارسال شده';
      case 'pending':
        return 'در انتظار';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">📦</span>
        سفارش‌های من
      </h2>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
          <p className="text-gray-600 mb-6">سفارش‌های خود را اینجا مشاهده کنید</p>
          <Link href="/products" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <span className="mr-2">🛍️</span>
            شروع خرید
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="font-bold text-gray-900">#{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">تاریخ سفارش:</span>
                      <p className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString('fa-IR')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">تعداد آیتم:</span>
                      <p className="font-medium text-gray-900">{order.items} عدد</p>
                    </div>
                    <div className="sm:col-span-1 col-span-2">
                      <span className="text-gray-500">مبلغ کل:</span>
                      <p className="font-bold text-blue-600 text-lg">{order.total.toLocaleString('fa-IR')} تومان</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                    مشاهده جزئیات
                  </button>
                  {order.status === 'delivered' && (
                    <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm">
                      سفارش مجدد
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
