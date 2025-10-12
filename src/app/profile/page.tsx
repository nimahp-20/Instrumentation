'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  ProfileHeader, 
  StatsCards, 
  TabNavigation, 
  PersonalInfoForm, 
  QuickActions, 
  FavoritesTab, 
  OrdersTab,
  TabType 
} from '@/components/profile';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const hasLoadedProfile = useRef(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Force redirect to login page
      window.location.href = '/login';
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    // Only call updateProfile once when user becomes authenticated
    if (isAuthenticated && !hasLoadedProfile.current) {
      hasLoadedProfile.current = true;
      updateProfile();
    }
  }, [isAuthenticated, updateProfile]);

  // Initialize edit form when user data is available
  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditError('');
    setEditSuccess('');
    if (!isEditing && user) {
      // Reset form to current user data when starting to edit
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
    setEditError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEditError('');
    setEditSuccess('');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        setEditSuccess('اطلاعات با موفقیت به‌روزرسانی شد');
        setIsEditing(false);
        // Refresh user data
        await updateProfile();
      } else {
        setEditError(data.message || 'خطا در به‌روزرسانی اطلاعات');
      }
    } catch (error) {
      setEditError('خطای شبکه - لطفاً دوباره تلاش کنید');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock data for favorites and orders
  const favoriteProducts = [
    {
      id: 1,
      name: 'دریل برقی حرفه‌ای',
      price: 2500000,
      image: '/product-drill.jpg',
      category: 'ابزار برقی'
    },
    {
      id: 2,
      name: 'آچار تخت چند منظوره',
      price: 450000,
      image: '/product-wrench.jpg',
      category: 'ابزار دستی'
    },
    {
      id: 3,
      name: 'کلاه ایمنی ساختمانی',
      price: 180000,
      image: '/product-helmet.jpg',
      category: 'تجهیزات ایمنی'
    }
  ];

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 2950000,
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 890000,
      items: 2
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'pending',
      total: 1200000,
      items: 1
    }
  ];


  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری پروفایل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Header Section */}
        <ProfileHeader user={user} />

        {/* Stats Cards */}
        <StatsCards user={user} />

        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          favoritesCount={favoriteProducts.length}
          ordersCount={orders.length}
        />

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Personal Information and Quick Actions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              <PersonalInfoForm
                user={user}
                isEditing={isEditing}
                editForm={editForm}
                editSuccess={editSuccess}
                editError={editError}
                isSubmitting={isSubmitting}
                onEditToggle={handleEditToggle}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
              <QuickActions user={user} onLogout={handleLogout} />
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <FavoritesTab favoriteProducts={favoriteProducts} />
        )}

        {activeTab === 'orders' && (
          <OrdersTab orders={orders} />
        )}

      </div>
    </div>
  );
}


