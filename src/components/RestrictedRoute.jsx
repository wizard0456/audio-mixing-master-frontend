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

            if (localStorage.getItem('user') !== null) {
                user = JSON.parse(localStorage.getItem('user'));
            } else if (Cookies.get('user') !== undefined) {
                user = JSON.parse(Cookies.get('user'));
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
