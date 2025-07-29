import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '../utils/constants';

export const useBlogCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories from backend
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`${API_ENDPOINT}blog/categories`);
            
            // Handle the specific backend response structure
            let categoriesData = [];
            if (response.data.success && response.data.data && response.data.data.categories) {
                // Backend returns: { success: true, data: { categories: [...] } }
                categoriesData = response.data.data.categories;
            } else if (response.data.data && response.data.data.categories) {
                // Alternative structure: { data: { categories: [...] } }
                categoriesData = response.data.data.categories;
            } else if (response.data.categories) {
                // Direct categories array: { categories: [...] }
                categoriesData = response.data.categories;
            } else if (response.data.data) {
                // Direct data array: { data: [...] }
                categoriesData = response.data.data;
            } else {
                // Fallback to response.data
                categoriesData = response.data;
            }
            
            // Filter out inactive categories and transform the data
            const activeCategories = categoriesData
                .filter(category => category.is_active !== 0) // Only active categories
                .map(category => ({
                    id: category.id.toString(), // Convert to string for consistency
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    is_active: category.is_active,
                    created_at: category.created_at,
                    updated_at: category.updated_at
                }));
            
            // Add "All Posts" option at the beginning
            const categoriesWithAll = [
                { id: 'all', name: 'All Posts', slug: 'all' },
                ...activeCategories
            ];
            
            setCategories(categoriesWithAll);
        } catch (err) {
            console.error('Error fetching blog categories:', err);
            setError(err.message || 'Failed to fetch categories');
            
            // Fallback to default categories if API fails
            setCategories([
                { id: 'all', name: 'All Posts', slug: 'all' },
                { id: 'mixing', name: 'Mixing', slug: 'mixing' },
                { id: 'mastering', name: 'Mastering', slug: 'mastering' },
                { id: 'equipment', name: 'Equipment', slug: 'equipment' },
                { id: 'technology', name: 'Technology', slug: 'technology' },
                { id: 'studio', name: 'Studio Setup', slug: 'studio' },
                { id: 'tips', name: 'Tips & Tricks', slug: 'tips' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Create a new category
    const createCategory = async (categoryData) => {
        try {
            const response = await axios.post(`${API_ENDPOINT}blog/categories`, categoryData);
            await fetchCategories(); // Refresh the list
            return response.data;
        } catch (err) {
            console.error('Error creating category:', err);
            throw err;
        }
    };

    // Update a category
    const updateCategory = async (categoryId, categoryData) => {
        try {
            const response = await axios.put(`${API_ENDPOINT}blog/categories/${categoryId}`, categoryData);
            await fetchCategories(); // Refresh the list
            return response.data;
        } catch (err) {
            console.error('Error updating category:', err);
            throw err;
        }
    };

    // Delete a category
    const deleteCategory = async (categoryId) => {
        try {
            await axios.delete(`${API_ENDPOINT}blog/categories/${categoryId}`);
            await fetchCategories(); // Refresh the list
        } catch (err) {
            console.error('Error deleting category:', err);
            throw err;
        }
    };

    // Get category by ID
    const getCategoryById = (categoryId) => {
        return categories.find(category => category.id === categoryId);
    };

    // Get category by slug
    const getCategoryBySlug = (slug) => {
        return categories.find(category => category.slug === slug);
    };

    // Initialize categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        getCategoryBySlug
    };
}; 