import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { BrandingProvider } from './context/BrandingContext';

// ── Lazy load pages for code splitting ──
const HomePage      = lazy(() => import('./pages/public/HomePage'));
const AboutPage     = lazy(() => import('./pages/public/AboutPage'));
const AutomationPage = lazy(() => import('./pages/public/AutomationPage'));
const ProductsPage  = lazy(() => import('./pages/public/ProductsPage'));
const GalleryPage   = lazy(() => import('./pages/public/GalleryPage'));
const CareerPage    = lazy(() => import('./pages/public/CareerPage'));
const JobDetailPage = lazy(() => import('./pages/public/JobDetailPage'));
const BenefitsPage  = lazy(() => import('./pages/public/BenefitsPage'));
const ProgramsPage  = lazy(() => import('./pages/public/ProgramsPage'));
const FaqPage       = lazy(() => import('./pages/public/FaqPage'));
const ContactPage   = lazy(() => import('./pages/public/ContactPage'));
const NotFoundPage  = lazy(() => import('./pages/public/NotFoundPage'));

// Admin pages
const AdminLoginPage    = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));

// Suspense fallback
const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', gap: '12px'
  }}>
    <div style={{
      width: 40, height: 40, border: '3px solid var(--gray-200)',
      borderTop: '3px solid var(--teal)', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,              element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: 'about',            element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense> },
      { path: 'automation',       element: <Suspense fallback={<PageLoader />}><AutomationPage /></Suspense> },
      { path: 'products',         element: <Suspense fallback={<PageLoader />}><ProductsPage /></Suspense> },
      { path: 'gallery',          element: <Suspense fallback={<PageLoader />}><GalleryPage /></Suspense> },
      { path: 'career',           element: <Suspense fallback={<PageLoader />}><CareerPage /></Suspense> },
      { path: 'career/jobs/:id',  element: <Suspense fallback={<PageLoader />}><JobDetailPage /></Suspense> },
      { path: 'career/benefits',  element: <Suspense fallback={<PageLoader />}><BenefitsPage /></Suspense> },
      { path: 'career/programs',  element: <Suspense fallback={<PageLoader />}><ProgramsPage /></Suspense> },
      { path: 'faq',              element: <Suspense fallback={<PageLoader />}><FaqPage /></Suspense> },
      { path: 'contact',          element: <Suspense fallback={<PageLoader />}><ContactPage /></Suspense> },
      { path: '*',                element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense> },
    ],
  },
  // Admin routes (no shared layout)
  { path: '/admin/login',   element: <Suspense fallback={<PageLoader />}><AdminLoginPage /></Suspense> },
  { path: '/admin/*',       element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
]);
export default function App() {
  return (
    <AdminAuthProvider>
      <BrandingProvider>
        <RouterProvider router={router} />
      </BrandingProvider>
    </AdminAuthProvider>
  );
}

