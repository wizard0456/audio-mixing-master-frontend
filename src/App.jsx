import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import OrderConfirmation from './pages/OrderConfirmation';
import NotFound from './pages/NotFound';

// Importing Components
import RestrictedRoute from './components/RestrictedRoute';
import Preloader from './components/Preloader';  // Ensure Preloader component is imported

// Importing Reducers
import { addUser, logout, selectUser } from './reducers/authSlice';
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
import GiftCard from './pages/GiftCard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/upload', element: <Upload /> },
      { path: '/services', element: <Services /> },
      { path: '/samples', element: <Samples /> },
      { path: '/faq', element: <Faq /> },
      { path: '/reviews', element: <Reviews /> },
      { path: '/contact', element: <Contact /> },
      { path: '/about', element: <About /> },
      { path: '/account', element: <Account /> },
      { path: '/cart', element: <Cart /> },
      { path: '/favorites', element: (<RestrictedRoute redirectIfNotLoggedIn="/"><Favorites /></RestrictedRoute>) },
      { path: '/user-gift-coupon', element: (<RestrictedRoute redirectIfNotLoggedIn="/"><GiftCard /></RestrictedRoute>) },
      { path: '/services-all', element: <Products /> },
      { path: '/services/:productName', element: <ProductDetail /> },
      { path: '/order-confirmation/:orderId', element: <RestrictedRoute redirectIfNotLoggedIn="/"><OrderConfirmation /></RestrictedRoute> },
      { path: '/orders', element: <RestrictedRoute redirectIfNotLoggedIn="/"><OrderListPage /></RestrictedRoute> },
      { path: '/order/:orderId', element: <RestrictedRoute redirectIfNotLoggedIn="/"><OrderDetailPage /></RestrictedRoute> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/refund-policy', element: <RefundPolicy /> },
      { path: '/terms-and-conditions', element: <TermsConditions /> },
      { path: '/mfit', element: <MFIT /> },
    ],
  },
  {
    path: '/blog',
    element: <Blog />
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
      let user;
      if (localStorage.getItem("user")) {
        user = JSON.parse(localStorage.getItem("user"));
      } else if (Cookies.get("user")) {
        user = JSON.parse(Cookies.get("user"));
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
          const userInfoData = await axios.get(`${API_ENDPOINT}me`, {
            headers: {
              Authorization: `Bearer ${user}`,
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
              Authorization: `Bearer ${user}`,
              "content-type": "application/json",
              "Accept": "application/json",
            },
          });

          dispatch(setFavorites(userFavoritesData.data.data));
        } catch (error) {
          if (error?.response?.status == 401) {
            dispatch(logout());
            dispatch(clearUser());
            dispatch(saveCartItemsToLocalStorage());
            dispatch(clearFavorites());
          }
          console.log(error.message);
        }
      }

      setLoading(false);  // Set loading to false once data is fetched
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Preloader />;  // Show Preloader until loading is false
  }

  return <RouterProvider router={router} />;
}
