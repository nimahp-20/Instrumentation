import { NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { addSecurityHeaders } from '@/lib/security-middleware';
import { validateAndSaveAdminImageFile, AdminImageUploadError } from '@/lib/admin-image-file-save';

async function uploadProductImageHandler(request: AuthenticatedRequest) {
  try {
    const formData = await request.formData();
    const entry = formData.get('file');

    if (!(entry instanceof File)) {
      const r = NextResponse.json({ success: false, error: 'فایل تصویر ارسال نشده است' }, { status: 400 });
      return addSecurityHeaders(r);
    }

    const { url, mime } = await validateAndSaveAdminImageFile(entry, 'products');

    const r = NextResponse.json({
      success: true,
      data: { url, mime },
    });
    return addSecurityHeaders(r);
  } catch (error) {
    if (error instanceof AdminImageUploadError) {
      const r = NextResponse.json({ success: false, error: error.message }, { status: error.status });
      return addSecurityHeaders(r);
    }
    console.error('Product image upload error:', error);
    const r = NextResponse.json({ success: false, error: 'خطا در ذخیرهٔ تصویر' }, { status: 500 });
    return addSecurityHeaders(r);
  }
}

export const POST = withAdminAuth(uploadProductImageHandler);
