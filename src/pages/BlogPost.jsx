import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { ArrowLeftIcon, ClockIcon, UserIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import Skeleton from 'react-loading-skeleton';
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import axios from 'axios';
import { API_ENDPOINT } from '../utils/constants';
import audioImagesData from '../mocks/audioImages.json';
import SEO from '../components/SEO';

export default function BlogPost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to get a random image from audioImages.json
    const getRandomAudioImage = () => {
        const images = audioImagesData.images;
        const randomIndex = Math.floor(Math.random() * images.length);
        const imageUrl = images[randomIndex].url;
        
        // For related posts - smaller size
        return imageUrl.replace('&h=650&w=940', '&h=250&w=400');
    };

    // Default fallback image for blog posts
    const getDefaultImage = () => {
        const defaultImages = [
            'https://images.pexels.com/photos/7086730/pexels-photo-7086730.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            'https://images.pexels.com/photos/2607311/pexels-photo-2607311.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            'https://images.pexels.com/photos/7123348/pexels-photo-7123348.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            'https://images.pexels.com/photos/11317799/pexels-photo-11317799.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            'https://images.pexels.com/photos/8198124/pexels-photo-8198124.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        ];
        
        const randomIndex = Math.floor(Math.random() * defaultImages.length);
        const imageUrl = defaultImages[randomIndex];
        
        // For related posts - smaller size
        return imageUrl.replace('&h=650&w=940', '&h=250&w=400');
    };

    // Function to extract content from HTML template
    const extractContentFromHTML = (htmlContent) => {
        if (!htmlContent) return '';
        
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            console.log('Parsing HTML content:', htmlContent.substring(0, 200) + '...');
            
            // Extract styles from the original HTML
            const styles = doc.querySelectorAll('style');
            let extractedStyles = '';
            styles.forEach(style => {
                extractedStyles += style.textContent;
            });
            
            // Try to find the blog content section - look for article with blog-content class
            const blogContentArticle = doc.querySelector('article.blog-content');
            if (blogContentArticle) {
                console.log('Found article.blog-content, extracting content');
                return `<style>${extractedStyles}</style>${blogContentArticle.outerHTML}`;
            }
            
            // Try to find any element with blog-content class
            const blogContent = doc.querySelector('.blog-content');
            if (blogContent) {
                console.log('Found .blog-content, extracting content');
                return `<style>${extractedStyles}</style>${blogContent.outerHTML}`;
            }
            
            // If no .blog-content found, try to extract from any article tag
            const article = doc.querySelector('article');
            if (article) {
                console.log('Found article tag, extracting content');
                return `<style>${extractedStyles}</style>${article.outerHTML}`;
            }
            
            // If no article found, try to extract from body but remove header and navigation
            const body = doc.querySelector('body');
            if (body) {
                console.log('Extracting from body, removing non-content elements');
                // Remove header, navigation, and other non-content elements
                const elementsToRemove = body.querySelectorAll('header, nav, .mb-8, script, style, link, head');
                elementsToRemove.forEach(el => el.remove());
                return `<style>${extractedStyles}</style>${body.innerHTML}`;
            }
            
            // Fallback: return the original HTML content
            console.log('Using fallback - original HTML content');
            return htmlContent;
        } catch (error) {
            console.error('Error parsing HTML content:', error);
            return htmlContent;
        }
    };

    // Function to render keywords as tags
    const renderKeywords = (keywords) => {
        if (!keywords) return null;
        
        // Handle both string and array formats
        let keywordArray = [];
        if (typeof keywords === 'string') {
            keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
        } else if (Array.isArray(keywords)) {
            keywordArray = keywords;
        }
        
        if (keywordArray.length === 0) return null;
        
        return (
            <div className="flex flex-wrap gap-2 mt-4">
                <div className="flex items-center gap-2 text-gray-400">
                    <TagIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Keywords:</span>
                </div>
                {keywordArray.map((keyword, index) => (
                    <span 
                        key={index}
                        className="bg-[#1a1a1a] text-[#4CC800] px-3 py-1 rounded-full text-sm font-medium border border-[#4CC800] border-opacity-30 hover:bg-[#4CC800] hover:text-black transition-all duration-300"
                    >
                        {keyword}
                    </span>
                ))}
            </div>
        );
    };

    // Function to save fallback post to database
    const saveFallbackPostToDatabase = async (fallbackPost) => {
        try {
            console.log('Saving fallback post to database...');
            
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

            // Then create the blog post
            try {
                await axios.post(`${API_ENDPOINT}admin/blogs`, fallbackPost, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`Created blog post: ${fallbackPost.title}`);
            } catch (error) {
                console.log(`Blog post ${fallbackPost.title} might already exist`);
            }

            console.log('Successfully saved fallback post to database');
        } catch (error) {
            console.error('Error saving fallback post to database:', error);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log('Fetching blog post with ID:', postId);
                
                // Fetch post from backend API
                const response = await axios.get(`${API_ENDPOINT}blogs/${postId}`);
                
                console.log('API Response:', response.data);
                
                let postData;
                if (response.data.success && response.data.data) {
                    postData = response.data.data.blog;
                } else if (response.data.data) {
                    postData = response.data.data;
                } else {
                    postData = response.data;
                }
                
                console.log('Post data:', postData);
                console.log('HTML content length:', postData.html_content?.length || 0);
                
                // Extract the actual content from HTML template
                const extractedContent = extractContentFromHTML(postData.html_content);
                
                console.log('Extracted content length:', extractedContent?.length || 0);
                console.log('Extracted content preview:', extractedContent?.substring(0, 200) + '...');
                
                // Transform the post data
                const transformedPost = {
                    id: postData.id,
                    title: postData.title,
                    excerpt: postData.meta_description,
                    content: extractedContent,
                    category_id: postData.category_id,
                    category_name: postData.category?.name,
                    author: postData.author_name || postData.author || 'Audio Expert',
                    date: postData.publish_date || postData.created_at || new Date().toISOString(),
                    readTime: postData.read_time ? `${postData.read_time} min read` : '8 min read',
                    image: postData.featured_image || postData.image || getRandomAudioImage(),
                    featured: postData.is_featured || postData.featured || false,
                    slug: postData.slug || `blog-post-${postData.id}`,
                    status: postData.is_published ? 'published' : 'draft',
                    keywords: postData.keywords,
                    views: postData.views || 0
                };
                                
                setPost(transformedPost);
                
                // Fetch related posts
                try {
                    const relatedResponse = await axios.get(`${API_ENDPOINT}blogs/?category_id=${transformedPost.category_id}&per_page=3&exclude=${postData.id}`);
                    
                    let relatedData = [];
                    if (relatedResponse.data.success && relatedResponse.data.data) {
                        if (relatedResponse.data.data.blogs) {
                            relatedData = relatedResponse.data.data.blogs;
                        } else {
                            relatedData = relatedResponse.data.data;
                        }
                    } else if (relatedResponse.data.data && relatedResponse.data.data.blogs) {
                        relatedData = relatedResponse.data.data.blogs;
                    } else if (relatedResponse.data.blogs) {
                        relatedData = relatedResponse.data.blogs;
                    } else if (relatedResponse.data.data) {
                        relatedData = relatedResponse.data.data;
                    } else {
                        relatedData = relatedResponse.data;
                    }
                    
                    const transformedRelated = relatedData.map(relatedPost => ({
                        id: relatedPost.id,
                        title: relatedPost.title,
                        excerpt: relatedPost.meta_description || relatedPost.excerpt || '',
                        category_name: relatedPost.category?.name || '',
                        author: relatedPost.author_name || relatedPost.author || 'Audio Expert',
                        date: relatedPost.publish_date || relatedPost.created_at || new Date().toISOString(),
                        readTime: relatedPost.read_time ? `${relatedPost.read_time} min read` : '8 min read',
                        image: relatedPost.featured_image || relatedPost.image || getRandomAudioImage(),
                        slug: relatedPost.slug || `blog-post-${relatedPost.id}`
                    }));
                    
                    setRelatedPosts(transformedRelated);
                } catch (relatedError) {
                    console.error('Error fetching related posts:', relatedError);
                    // Set empty related posts if API fails
                    setRelatedPosts([]);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blog post:', error);
                console.log('API failed, using fallback with random images');
                
                // Create fallback post with random image
                const fallbackPost = {
                    id: 1,
                    title: 'The History of Mixing and Mastering',
                    slug: postId || 'the-history-of-mixing-and-mastering',
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
                    featured_image: getRandomAudioImage(),
                    views: 0
                };
                
                // Save fallback post to database
                await saveFallbackPostToDatabase(fallbackPost);
                
                // Try to fetch the post again after saving
                try {
                    const retryResponse = await axios.get(`${API_ENDPOINT}blogs/${postId}`);
                    const retryPostData = retryResponse.data.data.blog;
                    
                    const extractedContent = extractContentFromHTML(retryPostData.html_content);
                    
                    const transformedPost = {
                        id: retryPostData.id,
                        title: retryPostData.title,
                        excerpt: retryPostData.meta_description,
                        content: extractedContent,
                        category_id: retryPostData.category_id,
                        category_name: retryPostData.category?.name,
                        author: retryPostData.author_name || retryPostData.author || 'Audio Expert',
                        date: retryPostData.publish_date || retryPostData.created_at || new Date().toISOString(),
                        readTime: retryPostData.read_time ? `${retryPostData.read_time} min read` : '8 min read',
                        image: retryPostData.featured_image || retryPostData.image || getRandomAudioImage(),
                        featured: retryPostData.is_featured || retryPostData.featured || false,
                        slug: retryPostData.slug || `blog-post-${retryPostData.id}`,
                        status: retryPostData.is_published ? 'published' : 'draft',
                        keywords: retryPostData.keywords,
                        views: retryPostData.views || 0
                    };
                    
                    setPost(transformedPost);
                    setRelatedPosts([]);
                } catch (retryError) {
                    console.error('Error fetching post after saving:', retryError);
                    
                    // Use fallback post if retry also fails
                    const transformedFallbackPost = {
                        id: fallbackPost.id,
                        title: fallbackPost.title,
                        excerpt: fallbackPost.content.substring(0, 150) + '...',
                        content: fallbackPost.html_content,
                        category_id: fallbackPost.category_id,
                        category_name: 'Audio Mixing',
                        author: fallbackPost.author_name,
                        date: fallbackPost.publish_date,
                        readTime: `${fallbackPost.read_time} min read`,
                        image: fallbackPost.featured_image,
                        featured: true,
                        slug: fallbackPost.slug,
                        status: 'published',
                        keywords: fallbackPost.keywords,
                        views: fallbackPost.views
                    };
                    
                    setPost(transformedFallbackPost);
                    
                    // Set fallback related posts
                    const fallbackRelatedPosts = [
                        {
                            id: 2,
                            title: 'Tips On Recording Vocals',
                            excerpt: 'Recording vocals is one of the most critical aspects of music production. The human voice is incredibly dynamic and requires careful attention to detail.',
                            category_name: 'Music Production',
                            author: 'Studio Pro',
                            date: '2024-01-20',
                            readTime: '10 min read',
                            image: getRandomAudioImage(),
                            slug: 'tips-on-recording-vocals'
                        },
                        {
                            id: 3,
                            title: 'Understanding Compression in Audio',
                            excerpt: 'Compression is one of the most powerful tools in audio production, yet it\'s often misunderstood. This comprehensive guide explains how compression works.',
                            category_name: 'Audio Mixing',
                            author: 'Mix Engineer',
                            date: '2024-01-25',
                            readTime: '12 min read',
                            image: getRandomAudioImage(),
                            slug: 'understanding-compression-in-audio'
                        },
                        {
                            id: 4,
                            title: 'Essential Studio Equipment for Beginners',
                            excerpt: 'Building a home studio can be overwhelming with so many options available. This guide helps beginners understand what equipment they need.',
                            category_name: 'Studio Equipment',
                            author: 'Gear Expert',
                            date: '2024-01-30',
                            readTime: '15 min read',
                            image: getRandomAudioImage(),
                            slug: 'essential-studio-equipment-for-beginners'
                        }
                    ];
                    
                    setRelatedPosts(fallbackRelatedPosts);
                }
                
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Structured data for blog post
    const blogPostStructuredData = post ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "datePublished": post.date,
        "dateModified": post.date,
        "publisher": {
            "@type": "Organization",
            "name": "AudioMixingMastering",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.audiomixingmastering.com/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.audiomixingmastering.com/blog/${post.slug}`
        },
        "image": post.image,
        "keywords": post.keywords
    } : null;

    if (loading) {
        return (
            <main className='mt-24'>
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
                        <div className="mb-8">
                            <Skeleton height={40} width={200} baseColor="#0B1306" highlightColor="#171717" />
                        </div>
                        <div className="bg-[#0B1306] rounded-[30px] p-8">
                            <Skeleton height={400} baseColor="#0B1306" highlightColor="#171717" className="mb-6" />
                            <Skeleton height={50} width="80%" baseColor="#0B1306" highlightColor="#171717" className="mb-4" />
                            <Skeleton height={20} width="60%" baseColor="#0B1306" highlightColor="#171717" className="mb-6" />
                            <Skeleton height={20} width="90%" baseColor="#0B1306" highlightColor="#171717" className="mb-3" />
                            <Skeleton height={20} width="85%" baseColor="#0B1306" highlightColor="#171717" className="mb-3" />
                            <Skeleton height={20} width="70%" baseColor="#0B1306" highlightColor="#171717" />
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className='mt-24'>
                <section className="text-white relative z-20 mb-24 px-5 md:px-10 xl:px-0">
                    <picture>
                        <source srcSet={GreenShadowBG} type="image/webp" />
                        <img src={GreenShadowBG} className="absolute -top-full left-0 pointer-events-none" alt="Green Shadow Background" />
                    </picture>
                    <picture>
                        <source srcSet={PurpleShadowBG} type="image/webp" />
                        <img src={PurpleShadowBG} className="absolute -top-3/4 right-0 pointer-events-none" alt="Purple Shadow Background" />
                    </picture>
                    
                    <div className="max-w-[1110px] relative z-20 mx-auto text-center">
                        <h1 className="font-THICCCBOI-Medium text-3xl md:text-4xl mb-6">Error Loading Article</h1>
                        <p className="text-gray-300 mb-8">{error}</p>
                        <RouterLink
                            to="/blog"
                            className="inline-flex items-center px-6 py-3 bg-[#4DC801] text-white rounded-full font-Montserrat font-medium hover:bg-[#3ba001] transition-colors duration-300"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to Blog
                        </RouterLink>
                    </div>
                </section>
            </main>
        );
    }

    if (!post) {
        return (
            <main className='mt-24'>
                <section className="text-white relative z-20 mb-24 px-5 md:px-10 xl:px-0">
                    <picture>
                        <source srcSet={GreenShadowBG} type="image/webp" />
                        <img src={GreenShadowBG} className="absolute -top-full left-0 pointer-events-none" alt="Green Shadow Background" />
                    </picture>
                    <picture>
                        <source srcSet={PurpleShadowBG} type="image/webp" />
                        <img src={PurpleShadowBG} className="absolute -top-3/4 right-0 pointer-events-none" alt="Purple Shadow Background" />
                    </picture>
                    
                    <div className="max-w-[1110px] relative z-20 mx-auto text-center">
                        <h1 className="font-THICCCBOI-Medium text-3xl md:text-4xl mb-6">Article Not Found</h1>
                        <p className="text-gray-300 mb-8">The article you're looking for doesn't exist or has been removed.</p>
                        <RouterLink
                            to="/blog"
                            className="inline-flex items-center px-6 py-3 bg-[#4DC801] text-white rounded-full font-Montserrat font-medium hover:bg-[#3ba001] transition-colors duration-300"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to Blog
                        </RouterLink>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <>
            <SEO 
                title={post.title}
                description={post.excerpt}
                keywords={post.keywords}
                image={post.image}
                url={`/blog/${post.slug}`}
                type="article"
                structuredData={blogPostStructuredData}
            />
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
                        {/* Back Button */}
                        <div className="mb-8">
                            <RouterLink
                                to="/blog"
                                className="inline-flex items-center text-[#4CC800] hover:text-[#3ba001] font-Montserrat font-medium transition-colors duration-300"
                            >
                                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                                Back to Blog
                            </RouterLink>
                        </div>

                        {/* Article Header */}
                        <div className="bg-[#0B1306] rounded-[30px] p-8 mb-12">
                            <div className="mb-8">
                                <img 
                                    src={post.image} 
                                    alt={post.title}
                                    className="w-full h-[300px] md:h-[400px] object-cover rounded-[20px]"
                                />
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" />
                                    <span>{post.author}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>{formatDate(post.date)}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4" />
                                    <span>{post.readTime}</span>
                                </div>
                            </div>

                            <h1 className="font-THICCCBOI-Medium text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
                                {post.title}
                            </h1>

                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                {post.excerpt}
                            </p>

                            <div className="inline-block bg-[#4DC801] text-white px-4 py-2 rounded-full text-sm font-medium">
                                {post.category_name || 'Audio Production'}
                            </div>

                            {/* Keywords Display */}
                            {renderKeywords(post.keywords)}
                        </div>

                        {/* Article Content */}
                        <div className="bg-[#0B1306] rounded-[30px] p-8 mb-12">
                            <div 
                                className="max-w-none"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                                style={{
                                    // Override any conflicting styles
                                    color: '#d1d5db',
                                    lineHeight: '1.8',
                                    fontSize: '1.125rem'
                                }}
                            />
                        </div>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="bg-[#0B1306] rounded-[30px] p-8">
                                <h2 className="font-THICCCBOI-Medium text-2xl md:text-3xl mb-8">
                                    Related Articles
                                </h2>
                                <div className="grid md:grid-cols-3 gap-8">
                                    {relatedPosts.map(relatedPost => (
                                        <article key={relatedPost.id} className="bg-black rounded-[20px] overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                                            <div className="relative">
                                                <img 
                                                    src={relatedPost.image} 
                                                    alt={relatedPost.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    {relatedPost.category_name || 'Audio Production'}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                                                    <span>{relatedPost.author}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(relatedPost.date)}</span>
                                                </div>
                                                <h3 className="font-THICCCBOI-Medium text-xl leading-tight mb-3 line-clamp-2">
                                                    {relatedPost.title}
                                                </h3>
                                                <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                                                    {relatedPost.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-400">{relatedPost.readTime}</span>
                                                    <RouterLink
                                                        to={`/blog/${relatedPost.slug}`}
                                                        className="text-[#4CC800] hover:text-[#3ba001] font-medium transition-colors duration-300"
                                                    >
                                                        Read More →
                                                    </RouterLink>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
} 