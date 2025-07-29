import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import { useBlogCategories } from '../hooks/useBlogCategories';
import { useBlogPosts } from '../hooks/useBlogPosts';
import Skeleton from 'react-loading-skeleton';

const Blog = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;

    // Use the custom hooks for blog categories and posts
    const { 
        categories, 
        loading: categoriesLoading, 
        error: categoriesError 
    } = useBlogCategories();

    const {
        posts: blogPosts,
        loading: postsLoading,
        error: postsError,
        pagination,
        fetchPosts,
        getPostsByCategory
    } = useBlogPosts({ page: currentPage, per_page: postsPerPage });

    // Fetch posts when category or page changes
    useEffect(() => {
        // Use setTimeout to debounce the requests
        const timeoutId = setTimeout(() => {
            if (selectedCategory === 'all') {
                fetchPosts({ page: currentPage, per_page: postsPerPage });
            } else {
                getPostsByCategory(selectedCategory, { page: currentPage, per_page: postsPerPage });
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [selectedCategory, currentPage]);

    // Separate featured and regular posts
    const featuredPost = blogPosts.find(post => post.featured);
    const regularPosts = blogPosts.filter(post => !post.featured);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Loading skeleton for categories
    const CategorySkeleton = () => (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton 
                    key={i} 
                    height={40} 
                    width={120} 
                    baseColor="#0B1306" 
                    highlightColor="#171717" 
                />
            ))}
        </div>
    );

    // Loading skeleton for posts
    const PostsSkeleton = () => (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#0B1306] rounded-[20px] p-6">
                    <Skeleton height={200} baseColor="#0B1306" highlightColor="#171717" className="mb-4" />
                    <Skeleton height={20} width="80%" baseColor="#0B1306" highlightColor="#171717" className="mb-2" />
                    <Skeleton height={16} width="60%" baseColor="#0B1306" highlightColor="#171717" className="mb-4" />
                    <Skeleton height={14} width="90%" baseColor="#0B1306" highlightColor="#171717" className="mb-2" />
                    <Skeleton height={14} width="70%" baseColor="#0B1306" highlightColor="#171717" />
                </div>
            ))}
        </div>
    );

    return (
        <main className='mt-24'>
            {/* Hero Section */}
            <section className="text-white relative z-20 mb-24 px-5 md:px-10 xl:px-0">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-full left-0 pointer-events-none" alt="Green Shadow Background" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-3/4 right-0 pointer-events-none" alt="Purple Shadow Background" />
                </picture>
                
                <div className="max-w-[1110px] relative z-20 mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="font-THICCCBOI-Medium font-medium text-[40px] md:text-[50px] leading-[50px] md:leading-[60px] mb-6">
                            Audio <span className="text-[#4CC800]">Blog</span>
                        </h1>
                        <p className="font-Roboto text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                            Discover the latest insights, tips, and techniques in audio mixing and mastering. From beginner guides to advanced production secrets.
                        </p>
                    </div>

                    {/* Category Filter */}
                    {categoriesLoading ? (
                        <CategorySkeleton />
                    ) : (
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-6 py-3 rounded-full font-Montserrat font-medium transition-all duration-300 ${
                                        selectedCategory === category.id
                                            ? 'bg-[#4DC801] text-white'
                                            : 'bg-transparent border border-gray-600 text-gray-300 hover:border-[#4DC801] hover:text-[#4DC801]'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Featured Post */}
                    {featuredPost && (
                        <div className="mb-16">
                            <Link 
                                to={`/blog/${featuredPost.slug}`}
                                className="block bg-[#0B1306] rounded-[30px] p-8 hover:transform hover:scale-105 transition-all duration-300"
                            >
                                <div className="grid lg:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                                            <span>{featuredPost.author}</span>
                                            <span>•</span>
                                            <span>{formatDate(featuredPost.date)}</span>
                                        </div>
                                        <h2 className="font-THICCCBOI-Medium text-2xl md:text-3xl leading-tight mb-4">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-gray-300 mb-6 leading-relaxed">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="inline-block bg-[#4DC801] text-white px-4 py-2 rounded-full text-sm font-medium">
                                                {featuredPost.category_name || 'Audio Production'}
                                            </div>
                                            <span className="text-[#4CC800] font-medium">
                                                Read More →
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img 
                                            src={featuredPost.image} 
                                            alt={featuredPost.title}
                                            className="w-full h-[300px] object-cover rounded-[20px]"
                                        />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Regular Posts Grid */}
                    {postsLoading ? (
                        <PostsSkeleton />
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {regularPosts.map(post => (
                                    <Link
                                        key={post.id}
                                        to={`/blog/${post.slug}`}
                                        className="block bg-[#0B1306] rounded-[20px] overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                                    >
                                        <div className="relative">
                                            <img 
                                                src={post.image} 
                                                alt={post.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {post.category_name || 'Audio Production'}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                                                <span>{post.author}</span>
                                                <span>•</span>
                                                <span>{formatDate(post.date)}</span>
                                            </div>
                                            <h3 className="font-THICCCBOI-Medium text-xl leading-tight mb-3 line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-400">{post.readTime}</span>
                                                <span className="text-[#4CC800] font-medium">
                                                    Read More →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.total_pages > 1 && (
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-full border border-gray-600 text-gray-300 hover:border-[#4CC800] hover:text-[#4CC800] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                    >
                                        Previous
                                    </button>
                                    
                                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                                                currentPage === page
                                                    ? 'bg-[#4DC801] text-white'
                                                    : 'border border-gray-600 text-gray-300 hover:border-[#4CC800] hover:text-[#4CC800]'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
                                        disabled={currentPage === pagination.total_pages}
                                        className="px-4 py-2 rounded-full border border-gray-600 text-gray-300 hover:border-[#4CC800] hover:text-[#4CC800] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            {/* No posts found message */}
                            {regularPosts.length === 0 && !postsLoading && (
                                <div className="text-center py-12">
                                    <h3 className="font-THICCCBOI-Medium text-xl mb-4">No posts found</h3>
                                    <p className="text-gray-300">Try selecting a different category or check back later for new content.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Blog;