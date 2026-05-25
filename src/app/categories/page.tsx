import { CategoriesBrowser } from '@/components/categories/CategoriesBrowser';
import { CategoriesDesktopHub } from '@/components/categories/CategoriesDesktopHub';

export const metadata = {
  title: 'دسته\u200cبندی\u200cها | فروشگاه ابزار',
  description: 'مرور دسته\u200cبندی\u200cها و زیردسته\u200cهای محصولات',
};

export default function CategoriesIndexPage() {
  return (
    <>
      <div className="lg:hidden">
        <CategoriesBrowser />
      </div>
      <div className="hidden lg:block">
        <CategoriesDesktopHub />
      </div>
    </>
  );
}
