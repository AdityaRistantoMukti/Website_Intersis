import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

// Submodules
import OverviewModule from './modules/OverviewModule';
import HomeModule from './modules/HomeModule';
import CompanyModule from './modules/CompanyModule';
import ContactModule from './modules/ContactModule';
import CoreValuesModule from './modules/CoreValuesModule';
import GalleryModule from './modules/GalleryModule';
import JobsModule from './modules/JobsModule';
import CategoriesModule from './modules/CategoriesModule';
import BenefitsModule from './modules/BenefitsModule';
import ProgramsModule from './modules/ProgramsModule';
import FaqsModule from './modules/FaqsModule';
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
      case 'home':
        return <HomeModule />;
      case 'company':
        return <CompanyModule />;
      case 'contact':
        return <ContactModule />;
      case 'core-values':
        return <CoreValuesModule />;
      case 'gallery':
        return <GalleryModule />;
      case 'jobs':
        return <JobsModule />;
      case 'categories':
        return <CategoriesModule />;
      case 'benefits':
        return <BenefitsModule />;
      case 'programs':
        return <ProgramsModule />;
      case 'faqs':
        return <FaqsModule />;
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
        <title>Dashboard Admin — PT. Intersis Sejahtera Abadi / GPT</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout activeTab={currentTab} onSelectTab={handleSelectTab}>
        {renderModule()}
      </AdminLayout>
    </>
  );
}
