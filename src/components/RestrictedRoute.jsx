import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import propType from 'prop-types';

const RestrictedRoute = ({ children, redirectIfLoggedIn, redirectIfNotLoggedIn }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            let user = null;

            const localStorageUser = localStorage.getItem('user');
            const cookieUser = Cookies.get('user');

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

            setIsAuthenticated(!!user);
            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return null; // or a loading spinner
    }

    if (isAuthenticated && redirectIfLoggedIn) {
        return <Navigate to={redirectIfLoggedIn} replace={true} />;
    }

    if (!isAuthenticated && redirectIfNotLoggedIn) {
        return <Navigate to={redirectIfNotLoggedIn} replace={true} />;
    }

    return children;
};

RestrictedRoute.propTypes = {
    children: propType.node,
    redirectIfLoggedIn: propType.string,
    redirectIfNotLoggedIn: propType.string
};

export default RestrictedRoute;
