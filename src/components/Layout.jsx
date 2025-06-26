import { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../reducers/userSlice';
import { LiveChatWidget } from "@livechat/widget-react";

// Configure the topbar progress indicator
TopBarProgress.config({
  barColors: {
    "0": "#4DC801",
    "1.0": "#4DC801"
  },
  shadowBlur: 5,
});

const Layout = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(false);  // State for progress indicator
  const initialRender = useRef(true);
  const [isScrolled, setIsScrolled] = useState(false); // State for scroll background
  const userInfo = useSelector(selectUserInfo);

  // Save the previous page URL into sessionStorage based on specific conditions
  useEffect(() => {
    const currentPage = location.pathname;
    const lastStoredPage = sessionStorage.getItem('currentPage');

    if (lastStoredPage && lastStoredPage !== currentPage) {
      // Update 'previousPage' with the last stored 'currentPage' if it's different from the current page
      sessionStorage.setItem('previousPage', lastStoredPage);
    }

    // Update 'currentPage' with the new current path
    sessionStorage.setItem('currentPage', currentPage);
  }, [location]);



  useEffect(() => {
    const handleLoad = () => setProgress(false);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      setProgress(false);
    } else {
      setProgress(true);  // Show progress indicator on route change
      setTimeout(() => {
        setProgress(false);  // Hide progress indicator after loading
      }, 1000);
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {progress && <TopBarProgress />}

      <header className={`sticky top-0 z-[999] px-5 md:px-10 xl:px-0 transition-colors duration-300 ${isScrolled ? 'bg-[#060505]' : ''}`}>
        <Navbar />
      </header>
      <Outlet />
      <Footer />
      {
        userInfo ?
          <LiveChatWidget
            license="1816872"
            visibility="minimized"
            customerName={`${userInfo ? userInfo.first_name : ''}`}
            customerEmail={`${userInfo ? userInfo.email : ''}`}
          />
          :
          <LiveChatWidget
            license="1816872"
            visibility="minimized"
          />
      }
    </>
  );
};

export default Layout;
