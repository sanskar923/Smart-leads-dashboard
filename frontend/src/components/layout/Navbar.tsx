import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Navbar = ({ title, subtitle, actions }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        {actions}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
};
