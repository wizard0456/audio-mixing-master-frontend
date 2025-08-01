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

    // Function to get a random image from audioImages.json
    const getRandomAudioImage = (isLarge = false) => {
        const images = audioImagesData.images;
        const randomIndex = Math.floor(Math.random() * images.length);
        const imageUrl = images[randomIndex].url;
        
        // Modify URL for different sizes
        if (isLarge) {
            // For single blog posts - larger size
            return imageUrl.replace('&h=650&w=940', '&h=400&w=800');
        } else {
            // For blog list - smaller size
            return imageUrl.replace('&h=650&w=940', '&h=250&w=400');
        }
    };

    // Default fallback image for blog posts
    const getDefaultImage = (isLarge = false) => {
        const defaultImages = [
            'https://images.pexels.com/photos/7086730/pexels-photo-7086730.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            'https://images.pexels.com/photos/2607311/pexels-photo-2607311.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            'https://images.pexels.com/photos/7123348/pexels-photo-7123348.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            'https://images.pexels.com/photos/11317799/pexels-photo-11317799.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            'https://images.pexels.com/photos/8198124/pexels-photo-8198124.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        ];
        
        const randomIndex = Math.floor(Math.random() * defaultImages.length);
        const imageUrl = defaultImages[randomIndex];
        
        // Modify URL for different sizes
        if (isLarge) {
            // For single blog posts - larger size
            return imageUrl.replace('&h=650&w=940', '&h=400&w=800');
        } else {
            // For blog list - smaller size
            return imageUrl.replace('&h=650&w=940', '&h=250&w=400');
        }
    };

    // Generate fallback posts with random images
    const generateFallbackPosts = () => {
        const fallbackPosts = [
            {
                id: 1,
                title: 'The History of Mixing and Mastering',
                slug: 'the-history-of-mixing-and-mastering',
                author_name: 'Audio Expert',
                publish_date: '2024-01-15',
                read_time: 8,
                content: 'Audio mixing and mastering have evolved significantly over the decades. From the early days of analog recording to today\'s digital revolution, the art of creating professional-quality audio has undergone remarkable transformations. This comprehensive guide explores the history, techniques, and modern approaches to mixing and mastering.',
                html_content: `
                    <h2>The Early Days of Audio Recording</h2>
                    <p>Audio mixing and mastering have evolved significantly over the decades. From the early days of analog recording to today's digital revolution, the art of creating professional-quality audio has undergone remarkable transformations.</p>
                    
                    <h2>The Analog Era</h2>
                    <p>In the 1950s and 1960s, recording studios relied on large format analog consoles and tape machines. Engineers developed techniques for balancing multiple tracks, applying EQ, compression, and reverb to create the final mix.</p>
                    
                    <h2>The Digital Revolution</h2>
                    <p>The introduction of digital audio workstations (DAWs) in the 1980s and 1990s revolutionized the industry. Suddenly, engineers could work with unlimited tracks, precise editing capabilities, and powerful plugins.</p>
                    
                    <h2>Modern Techniques</h2>
                    <p>Today's mixing and mastering engineers combine traditional analog techniques with cutting-edge digital tools. The goal remains the same: creating music that sounds great on any playback system.</p>
                `,
                keywords: 'audio mixing, mastering, history, analog, digital, recording',
                category_id: 1,
                is_published: 1,
                featured_image: getRandomAudioImage(false),
                views: 0
            },
            {
                id: 2,
                title: 'Tips On Recording Vocals',
                slug: 'tips-on-recording-vocals',
                author_name: 'Studio Pro',
                publish_date: '2024-01-20',
                read_time: 10,
                content: 'Recording vocals is one of the most critical aspects of music production. The human voice is incredibly dynamic and requires careful attention to detail. This guide covers essential techniques for capturing professional-quality vocal recordings.',
                html_content: `
                    <h2>Choosing the Right Microphone</h2>
                    <p>The microphone you choose can make or break your vocal recording. Large diaphragm condensers are popular for their warm, detailed sound, while dynamic microphones excel at handling high SPL levels.</p>
                    
                    <h2>Room Acoustics</h2>
                    <p>Your recording environment plays a crucial role in vocal quality. Consider using acoustic treatment to minimize unwanted reflections and create a controlled recording space.</p>
                    
                    <h2>Microphone Technique</h2>
                    <p>Proper microphone positioning is essential. Generally, position the mic 6-12 inches from the singer's mouth, slightly above or below to avoid plosives. Encourage the singer to maintain consistent distance.</p>
                    
                    <h2>Monitoring and Headphones</h2>
                    <p>Good headphones are essential for vocal recording. Closed-back headphones help prevent bleed and allow the singer to hear themselves clearly while recording.</p>
                `,
                keywords: 'vocal recording, microphone, acoustics, studio, technique',
                category_id: 2,
                is_published: 1,
                featured_image: getRandomAudioImage(false),
                views: 0
            },
            {
                id: 3,
                title: 'Understanding Compression in Audio',
                slug: 'understanding-compression-in-audio',
                author_name: 'Mix Engineer',
                publish_date: '2024-01-25',
                read_time: 12,
                content: 'Compression is one of the most powerful tools in audio production, yet it\'s often misunderstood. This comprehensive guide explains how compression works, when to use it, and how to achieve professional results.',
                html_content: `
                    <h2>What is Compression?</h2>
                    <p>Compression reduces the dynamic range of an audio signal by attenuating loud sounds while leaving quiet sounds unchanged. This creates a more consistent and controlled sound.</p>
                    
                    <h2>Key Parameters</h2>
                    <p>Understanding threshold, ratio, attack, and release is crucial for effective compression. Each parameter affects how the compressor responds to the input signal.</p>
                    
                    <h2>Types of Compression</h2>
                    <p>Different types of compressors (VCA, FET, Optical, Tube) have unique characteristics. Learning when to use each type can significantly improve your mixes.</p>
                    
                    <h2>Common Applications</h2>
                    <p>Compression is used on vocals, drums, bass, and many other instruments. Each application requires different settings and approaches.</p>
                `,
                keywords: 'compression, audio, dynamics, mixing, studio',
                category_id: 1,
                is_published: 1,
                featured_image: getRandomAudioImage(false),
                views: 0
            },
            {
                id: 4,
                title: 'Essential Studio Equipment for Beginners',
                slug: 'essential-studio-equipment-for-beginners',
                author_name: 'Gear Expert',
                publish_date: '2024-01-30',
                read_time: 15,
                content: 'Building a home studio can be overwhelming with so many options available. This guide helps beginners understand what equipment they need to get started and how to make smart purchasing decisions.',
                html_content: `
                    <h2>Computer and DAW</h2>
                    <p>Your computer is the heart of your studio. Choose a machine with sufficient processing power and RAM. Popular DAWs include Pro Tools, Logic Pro, Ableton Live, and Reaper.</p>
                    
                    <h2>Audio Interface</h2>
                    <p>An audio interface connects your computer to microphones and instruments. Look for interfaces with good preamps and low latency drivers.</p>
                    
                    <h2>Microphones</h2>
                    <p>Start with a versatile large diaphragm condenser microphone. Popular options include the Shure SM7B, Audio-Technica AT2020, and Rode NT1.</p>
                    
                    <h2>Monitors and Headphones</h2>
                    <p>Studio monitors and headphones are essential for accurate mixing. Invest in quality monitoring equipment to make better mixing decisions.</p>
                `,
                keywords: 'studio equipment, home studio, audio interface, microphones, monitors',
                category_id: 3,
                is_published: 1,
                featured_image: getRandomAudioImage(false),
                views: 0
            },
            {
                id: 5,
                title: 'The Art of EQ in Mixing',
                slug: 'the-art-of-eq-in-mixing',
                author_name: 'Audio Engineer',
                publish_date: '2024-02-05',
                read_time: 14,
                content: 'Equalization is fundamental to mixing. Understanding how to use EQ effectively can transform your mixes from amateur to professional. This guide covers EQ techniques, frequency ranges, and common applications.',
                html_content: `
                    <h2>Understanding Frequency Ranges</h2>
                    <p>Different frequency ranges affect how we perceive sound. Low frequencies provide warmth and power, mid frequencies carry most musical information, and high frequencies add clarity and air.</p>
                    
                    <h2>Types of EQ</h2>
                    <p>Graphic EQs, parametric EQs, and shelving EQs each have specific uses. Understanding when to use each type is crucial for effective mixing.</p>
                    
                    <h2>Common EQ Techniques</h2>
                    <p>High-pass filtering, notch filtering, and gentle boosts are common EQ techniques. Learning when and how to apply these techniques can significantly improve your mixes.</p>
                    
                    <h2>EQ for Different Instruments</h2>
                    <p>Each instrument has unique frequency characteristics. Understanding these helps you make better EQ decisions during mixing.</p>
                `,
                keywords: 'EQ, equalization, mixing, frequency, audio',
                category_id: 1,
                is_published: 1,
                featured_image: getRandomAudioImage(false),
                views: 0
            },
            {
                id: 6,
                title: 'Mastering Your Music: A Complete Guide',
                slug: 'mastering-your-music-a-complete-guide',
                author_name: 'Mastering Engineer',
                publish_date: '2024-02-10',
                read_time: 18,
                content: 'Mastering is the final step in music production, preparing your mix for distribution. This comprehensive guide covers mastering techniques, tools, and best practices for achieving professional results.',
                html_content: `
                    <h2>What is Mastering?</h2>
                    <p>Mastering prepares your mix for distribution by ensuring it sounds great on all playback systems. It involves final EQ adjustments, compression, limiting, and creating consistent levels.</p>
                    
                    <h2>Mastering Tools</h2>
                    <p>Essential mastering tools include multiband compressors, limiters, and precise EQ. Understanding how to use these tools effectively is crucial for professional results.</p>
                    
                    <h2>Loudness Standards</h2>
                    <p>Different platforms have different loudness requirements. Understanding LUFS and loudness standards helps you create masters that sound great everywhere.</p>
                    
                    <h2>Mastering Workflow</h2>
                    <p>A systematic approach to mastering ensures consistent results. This includes proper gain staging, careful listening, and reference comparisons.</p>
                `,
                keywords: 'mastering, audio, loudness, compression, limiting',
                category_id: 4,
                is_published: 1,
                featured_image: getRandomAudioImage(false),
                views: 0
            }
        ];

        return fallbackPosts;
    };

    // Function to save fallback posts to database
    const saveFallbackPostsToDatabase = async (fallbackPosts) => {
        try {
            console.log('Saving fallback posts to database...');
            
            // First, ensure categories exist
            const categories = [
                { name: 'Audio Mixing', slug: 'audio-mixing', description: 'Articles about audio mixing techniques and best practices' },
                { name: 'Music Production', slug: 'music-production', description: 'Music production tips, tutorials, and industry insights' },
                { name: 'Studio Equipment', slug: 'studio-equipment', description: 'Reviews and guides for studio equipment and gear' },
                { name: 'Mastering', slug: 'mastering', description: 'Audio mastering techniques and professional tips' },
                { name: 'Industry Tips', slug: 'industry-tips', description: 'Professional advice and industry insights' }
            ];

            // Create categories first
            for (const category of categories) {
                try {
                    await axios.post(`${API_ENDPOINT}admin/blog-categories`, category, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(`Created category: ${category.name}`);
                } catch (error) {
                    console.log(`Category ${category.name} might already exist`);
                }
            }

            // Then create blog posts
            for (const post of fallbackPosts) {
                try {
                    await axios.post(`${API_ENDPOINT}admin/blogs`, post, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(`Created blog post: ${post.title}`);
                } catch (error) {
                    console.log(`Blog post ${post.title} might already exist`);
                }
            }

            console.log('Successfully saved fallback posts to database');
        } catch (error) {
            console.error('Error saving fallback posts to database:', error);
        }
    };

    // Fetch posts from backend
    const fetchPosts = useCallback(async (filters = {}) => {
        // Create a unique request ID to prevent duplicate requests
        const requestId = JSON.stringify(filters);
        
        if (currentRequest === requestId) {
            return; // Prevent duplicate requests
        }
        
        setCurrentRequest(requestId);
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_ENDPOINT}blogs`, {
                params: filters
            });

            const { blogs: postsData, pagination: paginationData } = response.data.data;
            
            // If no posts from database, save fallback posts and then fetch again
            if (!postsData || postsData.length === 0) {
                console.log('No blog posts found in database, saving fallback posts...');
                const fallbackPosts = generateFallbackPosts();
                
                // Save fallback posts to database
                await saveFallbackPostsToDatabase(fallbackPosts);
                
                // Fetch posts again after saving
                const retryResponse = await axios.get(`${API_ENDPOINT}blogs`, {
                    params: filters
                });
                
                const { blogs: retryPostsData, pagination: retryPaginationData } = retryResponse.data.data;
                
                if (retryPostsData && retryPostsData.length > 0) {
                    // Transform the newly saved posts
                    const transformedPosts = retryPostsData.map(post => ({
                        id: post.id,
                        title: post.title,
                        excerpt: post.meta_description || post.excerpt || '',
                        content: post.html_content || post.content || '',
                        category_id: post.category_id || post.category?.id,
                        category_name: post.category?.name || '',
                        author: post.author_name || post.author || 'Audio Expert',
                        date: post.publish_date || post.created_at || new Date().toISOString(),
                        readTime: post.read_time ? `${post.read_time} min read` : '8 min read',
                        image: post.featured_image || getRandomAudioImage(false),
                        featured: post.is_featured || post.featured || false,
                        slug: post.slug || `blog-post-${post.id}`,
                        status: post.is_published ? 'published' : 'draft',
                        keywords: post.keywords || '',
                        views: post.views || 0
                    }));
                    
                    setPosts(transformedPosts);
                    setPagination({
                        current_page: retryPaginationData.current_page || 1,
                        total_pages: retryPaginationData.total_pages || 1,
                        total_items: retryPaginationData.total || transformedPosts.length,
                        per_page: retryPaginationData.per_page || 9
                    });
                } else {
                    // If still no posts, use fallback
                    const fallbackPosts = generateFallbackPosts();
                    setPosts(fallbackPosts.map(post => ({
                        ...post,
                        image: post.featured_image || getRandomAudioImage(false)
                    })));
                    setPagination({
                        current_page: 1,
                        total_pages: 1,
                        total_items: fallbackPosts.length,
                        per_page: 9
                    });
                }
                return;
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
                image: post.featured_image || getRandomAudioImage(false),
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
            
            // Use fallback posts with random images when API fails
            console.log('API failed, using fallback with random images');
            const fallbackPosts = generateFallbackPosts();
            setPosts(fallbackPosts.map(post => ({
                ...post,
                image: post.featured_image || getRandomAudioImage(false)
            })));
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
    }, []);

    // Get single post by ID
    const getPostById = useCallback(async (postId) => {
        try {
            const response = await axios.get(`${API_ENDPOINT}blogs/${postId}`);
            const postData = response.data.data.blog;
            
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
                image: postData.featured_image || getRandomAudioImage(true),
                featured: postData.is_featured || postData.featured || false,
                slug: postData.slug || `blog-post-${postData.id}`,
                status: postData.is_published ? 'published' : 'draft',
                keywords: postData.keywords || '',
                views: postData.views || 0
            };
        } catch (err) {
            console.error('Error fetching blog post:', err);
            
            // Return fallback post if API fails
            const fallbackPosts = generateFallbackPosts();
            const fallbackPost = fallbackPosts.find(p => p.slug === postId) || fallbackPosts[0];
            return {
                ...fallbackPost,
                image: getRandomAudioImage(true)
            };
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