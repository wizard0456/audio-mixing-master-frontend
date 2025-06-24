import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Meta tags for SEO */}
        <title>404 - Page Not Found | MyWebsite</title>
        <meta name="robots" content="noindex, nofollow" />

        {/* Main content */}
        <h1
          className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4 animate-fadeIn"
          aria-label="404 Error"
        >
          404
        </h1>

        <p className="text-2xl md:text-3xl text-white mb-8">
          Oops! The page you&lsquo;re looking for doesn&lsquo;t exist.
        </p>
        <Link
          className="text-base w-60 leading-none text-center font-Montserrat font-medium primary-gradient transition-all duration-300 ease-in-out active:scale-95 block mx-auto py-4 px-12 text-white rounded-full"
          to="/"
          aria-label="Return to homepage"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
