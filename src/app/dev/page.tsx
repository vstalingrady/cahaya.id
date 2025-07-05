import Link from 'next/link';
import CuanLogo from '@/components/icons/cuanlogo';

const routes = [
  { path: '/', name: 'Welcome / Onboarding' },
  { path: '/login', name: 'Login Page' },
  { path: '/signup', name: 'Sign Up (Phone First)' },
  { path: '/verify-phone', name: 'Verify Phone OTP' },
  { path: '/complete-profile', name: 'Complete Profile (Name/Email/Pass)' },
  { path: '/setup-security', name: 'Setup Security' },
  { path: '/link-account', name: 'Link Account (List)' },
  { path: '/link-account/bca', name: 'Link Account (BCA Auth)' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/transfer', name: 'Pay (Bills & Transfer)' },
  { path: '/subscriptions', name: 'Subscriptions Tracker' },
  { path: '/vaults', name: 'Vaults Page' },
  { path: '/history', name: 'Transaction History Calendar' },
];

export default function DevMenuPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 font-mono">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <CuanLogo className="w-24 h-auto" />
          <div className="w-px h-8 bg-gray-600"></div>
          <h1 className="text-2xl font-bold text-gray-300">Developer Menu</h1>
        </div>
        <p className="text-gray-400 mb-8">
          Use this menu to quickly navigate to any page in the application without going through the authentication flow.
        </p>
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <ul>
            {routes.map((route, index) => (
              <li key={route.path} className={index !== routes.length - 1 ? "border-b border-gray-700" : ""}>
                <Link href={route.path} className="flex justify-between items-center p-4 hover:bg-gray-700/50 transition-colors duration-200">
                    <div>
                      <p className="font-semibold text-green-400">{route.path}</p>
                      <p className="text-sm text-gray-400">{route.name}</p>
                    </div>
                    <span className="text-gray-500 text-xl font-light">&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
         <p className="text-center text-gray-500 mt-8 text-sm">
            This page is for development purposes only and should not be present in a production build.
        </p>
      </div>
    </div>
  );
}
