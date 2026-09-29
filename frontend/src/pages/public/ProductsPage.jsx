import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import ProductCatalogSection from '../../components/home/ProductCatalogSection';

export default function ProductsPage() {
  const { i18n } = useTranslation(['products', 'common']);
  const isId = i18n.language === 'id';

  return (
    <>
      <Helmet>
        <title>
          {isId
            ? 'Katalog Produk & Solusi Teknologi — PT. Global Philsonic Technologies'
            : 'Product Catalog & Technology Solutions — PT. Global Philsonic Technologies'}
        </title>
        <meta
          name="description"
          content={
            isId
              ? 'Daftar lengkap produk elektronik otomotif, sistem audio DSP, amplifier, perakitan SMT, dan modul otomasi industri PT. Global Philsonic Technologies Batam.'
              : 'Complete catalog of automotive electronics, DSP audio systems, amplifiers, SMT assemblies, and industrial automation modules by PT. Global Philsonic Technologies Batam.'
          }
        />
      </Helmet>

      <div style={{ paddingTop: '5rem', minHeight: '80vh' }}>
        <ProductCatalogSection />
      </div>
    </>
  );
}
