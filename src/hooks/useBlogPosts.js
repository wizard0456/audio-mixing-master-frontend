import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '../utils/constants';
import audioImagesData from '../mocks/audioImages.json';

export const useBlogPosts = (params = {}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        per_page: 9
    });
    const [currentRequest, setCurrentRequest] = useState(null);

    // Function to get a unique audio image based on post ID
    const getUniqueAudioImage = (postId, isLarge = false) => {
        const images = audioImagesData.images;
        const index = (postId - 1) % images.length;
        const imageUrl = images[index].url;
        
        // Modify URL for different sizes
        if (isLarge) {
            // For single blog posts - larger size
            return imageUrl.replace('&h=650&w=940', '&h=400&w=800');
        } else {
            // For blog list - smaller size
            return imageUrl.replace('&h=650&w=940', '&h=250&w=400');
        }
    };

    // Fetch posts from backend
    const fetchPosts = useCallback(async (filters = {}) => {
        // Create a unique request ID to prevent duplicate requests
        const requestId = JSON.stringify(filters);
        
        // If we're already making the same request, don't duplicate it
        if (currentRequest === requestId && loading) {
            console.log('Skipping duplicate request:', requestId);
            return;
        }
        
        try {
            setCurrentRequest(requestId);
            setLoading(true);
            setError(null);
            
            
            const queryParams = new URLSearchParams({
                page: filters.page || 1,
                per_page: filters.per_page || 9,
                ...filters
            });

            const response = await axios.get(`${API_ENDPOINT}blogs/?${queryParams}`);
            
            console.log('API Response:', response.data);
            
            // Handle the specific backend response structure
            let postsData = [];
            let paginationData = {};
            
            if (response.data.success && response.data.data) {
                // Backend returns: { success: true, data: { blogs: [...], pagination: {...} } }
                if (response.data.data.blogs) {
                    postsData = response.data.data.blogs;
                    paginationData = response.data.data.pagination || {};
                } else {
                    postsData = response.data.data;
                }
            } else if (response.data.data && response.data.data.blogs) {
                // Alternative structure: { data: { blogs: [...], pagination: {...} } }
                postsData = response.data.data.blogs;
                paginationData = response.data.data.pagination || {};
            } else if (response.data.blogs) {
                // Direct blogs array: { blogs: [...], pagination: {...} }
                postsData = response.data.blogs;
                paginationData = response.data.pagination || {};
            } else if (response.data.data) {
                // Direct data array: { data: [...], pagination: {...} }
                postsData = response.data.data;
            } else {
                // Fallback to response.data
                postsData = response.data;
            }
            
            
            // Transform posts data to match frontend expectations
            const transformedPosts = postsData.map(post => ({
                id: post.id,
                title: post.title,
                excerpt: post.meta_description || post.excerpt || '',
                content: post.html_content || post.content || '',
                category_id: post.category_id || post.category?.id,
                category_name: post.category?.name || '',
                author: post.author_name || post.author || 'Audio Expert',
                date: post.publish_date || post.created_at || new Date().toISOString(),
                readTime: post.read_time ? `${post.read_time} min read` : '8 min read',
                image: post.featured_image || post.image || getUniqueAudioImage(post.id, false),
                featured: post.is_featured || post.featured || false,
                slug: post.slug || `blog-post-${post.id}`,
                status: post.is_published ? 'published' : 'draft',
                keywords: post.keywords || '',
                views: post.views || 0
            }));
            
            
            setPosts(transformedPosts);
            setPagination({
                current_page: paginationData.current_page || 1,
                total_pages: paginationData.total_pages || 1,
                total_items: paginationData.total || transformedPosts.length,
                per_page: paginationData.per_page || 9
            });
        } catch (err) {
            console.error('Error fetching blog posts:', err);
            setError(err.message || 'Failed to fetch blog posts');
            
            // Fallback to default posts if API fails
            const fallbackPosts = generateFallbackPosts();
            setPosts(fallbackPosts);
            setPagination({
                current_page: 1,
                total_pages: 1,
                total_items: fallbackPosts.length,
                per_page: 9
            });
        } finally {
            setLoading(false);
            setCurrentRequest(null);
        }
    }, [currentRequest, loading]);

    // Get a single post by ID
    const getPostById = useCallback(async (postId) => {
        try {
            const response = await axios.get(`${API_ENDPOINT}blogs/${postId}`);
            
            let postData;
            if (response.data.success && response.data.data) {
                postData = response.data.data;
            } else if (response.data.data) {
                postData = response.data.data;
            } else {
                postData = response.data;
            }
            
            return {
                id: postData.id,
                title: postData.title,
                excerpt: postData.meta_description || postData.excerpt || '',
                content: postData.html_content || postData.content || '',
                category_id: postData.category_id || postData.category?.id,
                category_name: postData.category?.name || '',
                author: postData.author_name || postData.author || 'Audio Expert',
                date: postData.publish_date || postData.created_at || new Date().toISOString(),
                readTime: postData.read_time ? `${postData.read_time} min read` : '8 min read',
                image: postData.featured_image || postData.image || getUniqueAudioImage(postData.id, true),
                featured: postData.is_featured || postData.featured || false,
                slug: postData.slug || `blog-post-${postData.id}`,
                status: postData.is_published ? 'published' : 'draft',
                keywords: postData.keywords || '',
                views: postData.views || 0
            };
        } catch (err) {
            console.error('Error fetching blog post:', err);
            throw err;
        }
    }, []);

    // Get posts by category
    const getPostsByCategory = useCallback(async (categoryId, filters = {}) => {
        console.log('Getting posts by category:', categoryId, 'with filters:', filters);
        const categoryFilters = categoryId === 'all' ? {} : { category_id: categoryId };
        await fetchPosts({ ...filters, ...categoryFilters });
    }, [fetchPosts]);

    // Initialize posts on component mount - only run once
    useEffect(() => {
        fetchPosts(params);
    }, []); // Empty dependency array to run only once

    return {
        posts,
        loading,
        error,
        pagination,
        fetchPosts,
        getPostById,
        getPostsByCategory
    };
}; 