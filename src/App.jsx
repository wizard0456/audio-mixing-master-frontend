import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import Cookies from 'js-cookie';
import axios from 'axios';

// Importing Pages
import Home from './pages/Home';
import Upload from './pages/Upload';
import Samples from './pages/Samples';
import Faq from './pages/Faq';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import About from './pages/About';
import Account from './pages/Account';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgetPassword from './pages/ForgetPassoword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import OrderConfirmation from './pages/OrderConfirmation';
import NotFound from './pages/NotFound';

// Importing Components
import RestrictedRoute from './components/RestrictedRoute';
import Preloader from './components/Preloader';  // Ensure Preloader component is imported

// Importing Reducers
import { addUser, logout, selectUser, getUserToken } from './reducers/authSlice';
import { API_ENDPOINT } from './utils/constants';
import { clearUser, setUser } from './reducers/userSlice';
import { addToCart, fetchCartItems, getCartItems, saveCartItemsToLocalStorage } from './reducers/cartSlice';
import { clearFavorites, setFavorites } from './reducers/userFavirotesSlice';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TermsConditions from './pages/TermsConditions';
import MFIT from './pages/MFIT';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

import GiftCard from './pages/GiftCard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/upload', element: <Upload /> },
      { path: '/select-services', element: <Services /> },
      { path: '/samples', element: <Samples /> },
      { path: '/faq', element: <Faq /> },
      { path: '/reviews', element: <Reviews /> },
      { path: '/contact', element: <Contact /> },
      { path: '/about', element: <About /> },
      { path: '/account', element: <Account /> },
      { path: '/cart', element: <Cart /> },
      { path: '/favorites', element: (<RestrictedRoute redirectIfNotLoggedIn="/"><Favorites /></RestrictedRoute>) },
      { path: '/user-gift-coupon', element: (<RestrictedRoute redirectIfNotLoggedIn="/"><GiftCard /></RestrictedRoute>) },
      { path: '/services', element: <Products /> },
      { path: '/service-details/:productName', element: <ProductDetail /> },
      { path: '/order-confirmation/:orderId', element: <OrderConfirmation /> },
      { path: '/orders', element: <RestrictedRoute redirectIfNotLoggedIn="/"><OrderListPage /></RestrictedRoute> },
      { path: '/order/:orderId', element: <RestrictedRoute redirectIfNotLoggedIn="/"><OrderDetailPage /></RestrictedRoute> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/refund-policy', element: <RefundPolicy /> },
      { path: '/terms-and-conditions', element: <TermsConditions /> },
      { path: '/mfit', element: <MFIT /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:postId', element: <BlogPost /> },

    ],
  },
  {
    path: '/login',
    element: (<RestrictedRoute redirectIfLoggedIn="/"><Login /></RestrictedRoute>),
  },
  {
    path: '/signup',
    element: (<RestrictedRoute redirectIfLoggedIn="/"><Signup /></RestrictedRoute>),
  },
  {
    path: "/forgot-password",
    element: (<RestrictedRoute redirectIfLoggedIn="/"><ForgetPassword /></RestrictedRoute>),
  },
  {
    path: "/reset-password/:email/:token",
    element: (<RestrictedRoute redirectIfLoggedIn="/"><ResetPassword /></RestrictedRoute>),
  },
  {
    path: "/verify-email/:userId/:token",
    element: (<RestrictedRoute redirectIfLoggedIn="/"><EmailVerification /></RestrictedRoute>),
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const cartItems = useSelector(getCartItems);
  const [loading, setLoading] = useState(true);  // State for managing initial loading

  useEffect(() => {
    const fetchUser = async () => {
      let user = null;
      
      const localStorageUser = localStorage.getItem("user");
      const cookieUser = Cookies.get("user");

      if (localStorageUser !== null && localStorageUser !== 'undefined') {
        try {
          user = JSON.parse(localStorageUser);
        } catch (error) {
          localStorage.removeItem("user");
        }
      } else if (cookieUser !== undefined && cookieUser !== 'undefined') {
        try {
          user = JSON.parse(cookieUser);
        } catch (error) {
          Cookies.remove("user");
        }
      }

      if (user) {
        dispatch(addUser(user));
      } else {
        dispatch(addUser(null));
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Extract token from user object
          const token = getUserToken(user);
          
          const userInfoData = await axios.get(`${API_ENDPOINT}auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
              "Accept": "application/json",
            },
          });

          dispatch(setUser(userInfoData.data));

          if (cartItems.length > 0) {
            dispatch(addToCart({
              services: cartItems,
              isIntialPageLoad: true,
            }));
          } else {
            dispatch(fetchCartItems());
          }

          const userFavoritesData = await axios.get(`${API_ENDPOINT}my-favourites`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
              "Accept": "application/json",
            },
          });

          // Handle the new JSON structure with pagination
          let favoritesData = [];
          if (userFavoritesData.data && userFavoritesData.data.data && Array.isArray(userFavoritesData.data.data)) {
            favoritesData = userFavoritesData.data.data;
          } else if (Array.isArray(userFavoritesData.data)) {
            favoritesData = userFavoritesData.data;
          }

          dispatch(setFavorites(favoritesData));
        } catch (error) {
          if (error?.response?.status == 401) {
            dispatch(logout());
            dispatch(clearUser());
            dispatch(saveCartItemsToLocalStorage());
            dispatch(clearFavorites());
          }
        }
      }

      setLoading(false);  // Set loading to false once data is fetched
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Preloader />;  // Show Preloader until loading is false
  }

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
