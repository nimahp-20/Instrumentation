import '@/styles/shell-tokens.css';
import '@/styles/profile-shell.css';

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <div className="categories-route-shell">{children}</div>;
}
