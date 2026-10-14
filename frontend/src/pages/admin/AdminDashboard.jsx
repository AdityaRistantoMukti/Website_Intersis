import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

// Submodules
import OverviewModule from './modules/OverviewModule';
import BrandingModule from './modules/BrandingModule';
import HomeModule from './modules/HomeModule';
import AboutModule from './modules/AboutModule';
import ProductsModule from './modules/ProductsModule';
import AutomationModule from './modules/AutomationModule';
import GalleryModule from './modules/GalleryModule';
import CareerModule from './modules/CareerModule';
import ContactModule from './modules/ContactModule';
import UsersModule from './modules/UsersModule';
import LogsModule from './modules/LogsModule';

export default function AdminDashboard() {
  const { isAuthenticated, user, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') || 'overview';

  // Protect Route — Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#070d18',
        color: '#94a3b8',
        gap: '12px',
      }}>
        <div className="admin-spinner" style={{ width: '32px', height: '32px' }} />
        <span>Memverifikasi izin akses dashboard...</span>
      </div>
    );
  }

  const handleSelectTab = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  const isFullAdmin = user?.role === 'administrator' || user?.role === 'hrd';

  // Render appropriate module
  const renderModule = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewModule onNavigateTab={handleSelectTab} />;
      case 'branding':
        return <BrandingModule />;
      case 'home':
        return <HomeModule />;
      case 'about':
      case 'company':
        return <AboutModule />;
      case 'products':
        return <ProductsModule />;
      case 'automation':
        return <AutomationModule />;
      case 'gallery':
        return <GalleryModule />;
      case 'career':
      case 'jobs':
      case 'categories':
      case 'benefits':
      case 'programs':
      case 'faqs':
        return <CareerModule />;
      case 'contact':
        return <ContactModule />;
      case 'users':
        if (!isFullAdmin) {
          return (
            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ color: '#f87171' }}>Akses Dibatasi</h3>
              <p style={{ color: '#94a3b8' }}>
                Halaman Manajemen Pengguna hanya dapat diakses oleh Administrator atau HRD Manager.
              </p>
            </div>
          );
        }
        return <UsersModule />;
      case 'logs':
        if (!isFullAdmin) {
          return (
            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ color: '#f87171' }}>Akses Dibatasi</h3>
              <p style={{ color: '#94a3b8' }}>
                Halaman Log Aktivitas hanya dapat diakses oleh Administrator atau HRD Manager.
              </p>
            </div>
          );
        }
        return <LogsModule />;
      default:
        return <OverviewModule onNavigateTab={handleSelectTab} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Admin | PT GPT</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout activeTab={currentTab} onSelectTab={handleSelectTab}>
        {renderModule()}
      </AdminLayout>
    </>
  );
}
