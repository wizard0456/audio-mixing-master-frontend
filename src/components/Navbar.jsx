import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
// import LOGO from "../assets/images/logo.gif";
import LOGO from "../assets/images/logo.png"
import { useSelector } from 'react-redux';
import { getCartItems } from '../reducers/cartSlice';
import { selectUser } from '../reducers/authSlice';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Upload', href: '/upload' },
  { name: 'Services', href: '/services' },
  { name: 'Samples', href: '/samples' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: 'https://zetdigitesting.online/blog/' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const user = useSelector(selectUser);
  const cartItems = useSelector(getCartItems);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
  }, [menuOpen]);

  return (
    <nav className="text-black">
      <div className="mx-auto w-full py-2 md:py-4 lg:py-6 xl:px-8">
        <div className="relative flex h-16 items-center justify-between">

          <div className="flex flex-1 items-center xl:items-stretch justify-start">
            <div className="flex flex-shrink-0 items-center relative z-50">
              <Link to="/">
                <img className="w-24 lg:w-28" src={LOGO} alt="Your Company"
                />
              </Link>
            </div>
            <div className="hidden lg:ml-6 flex-1 xl:flex justify-center">
              <div className="menu flex items-center space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`text-white px-3 2xl:px-5 py-2 text-base font-medium font-Montserrat hover:text-[#4CC800]`}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className='hidden xl:flex items-center gap-7'>
              <Link to={`${user ? "/account" : "/login"}`} className='block w-28 2xl:w-36 py-4 primary-gradient text-center rounded-full text-base leading-none font-Montserrat tr font-medium text-white transition-all duration-300 ease-in-out active:scale-95'>{user ? "My Account" : "Sign In"}</Link>
              <div className='relative top-0'>
                <NavLink to="/cart" className="cart-link rounded-lg p-1 block"><ShoppingCartIcon className='w-7 text-white ' /></NavLink>
                <span className='absolute -top-2 -right-2 bg-[#4CC800] text-white w-5 h-5 rounded-full flex items-center justify-center'>{cartItems.length > 0 ? cartItems.length : 0}</span>
              </div>
            </div>
            <div className="absolute z-[1000] inset-y-0 right-0 flex items-center xl:hidden gap-5">
              <div className='relative top-0'>
                <NavLink to="/cart" className="cart-link rounded-lg p-1 block"><ShoppingCartIcon className='w-6 text-white ' /></NavLink>
                <span className='absolute -top-2 -right-3 bg-[#4CC800] text-white w-5 h-5 rounded-full flex items-center justify-center'>{cartItems.length > 0 ? cartItems.length : 0}</span>
              </div>

              <button
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                {menuOpen ? (
                  <XMarkIcon className="block sm:h-8 sm:w-8  h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block sm:h-8 sm:w-8  h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 h-screen bg-black transition-opacity duration-300 ${menuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} style={{ zIndex: 20 }}></div>

      <div className={`fixed inset-0 h-screen bg-black z-30 flex flex-col items-center justify-center py-20 transition-transform duration-300 ${menuOpen ? 'scale-100' : 'scale-0'}`}>
        <div className="flex flex-col items-center justify-center space-y-1 px-2 pb-2 pt-2">
          {menuOpen && navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => `text-white w-28 text-center py-2 text-base sm:text-base font-medium font-Montserrat hover:text-[#4CC800] rounded-full ${isActive ? 'primary-gradient' : ''}`}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
        <div className='flex flex-col space-y-2 items-center'>
          <Link to={`${user ? "/account" : "/login"}`} className='text-white px-3 py-2 text-base sm:text-base font-medium'>{user ? "My Account" : "Sign In"}</Link>
        </div>
      </div>
    </nav>
  );
}
