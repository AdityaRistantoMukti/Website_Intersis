import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import api from '../../lib/api';

function getOrCreateSessionId() {
  try {
    let sid = sessionStorage.getItem('gpt_visitor_session');
    if (!sid) {
      sid = 'vs_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
      sessionStorage.setItem('gpt_visitor_session', sid);
    }
    return sid;
  } catch {
    return 'anon_' + Date.now();
  }
}

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    try {
      const sessionId = getOrCreateSessionId();
      api.post('/public/telemetry/visit', {
        sessionId,
        pageUrl: location.pathname,
      }).catch(() => {});
    } catch {
      // ignore telemetry failure
    }
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
