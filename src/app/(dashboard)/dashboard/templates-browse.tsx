'use client';

import { Search, Sparkles, Eye, Star, Heart, Calendar, MessageCircle, Home, Palette, Plus, Gift, PartyPopper, Cake, Baby, GraduationCap, Trees, Briefcase, Music, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Template {
    id: number;
    title: string;
    description: string;
    price: string;
    isFree: boolean;
    thumbnail: string;
    category: string;
    icon: any;
}

const templates: Template[] = [
    {
        id: 1,
        title: 'Birthday Digital Greeting Card',
        description: 'Beautiful animated greeting cards with customizable messages and vibrant designs',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/photo-1651178086220-86a03e3ce515?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGdyZWV0aW5nJTIwY2FyZHxlbnwxfHx8fDE3NjUwMDEyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: Heart
    },
    {
        id: 2,
        title: 'Anniversary Message Card',
        description: 'Elegant anniversary cards with romantic themes and heartfelt templates',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/photo-1758883425621-c5c8e3e5ece5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMGNlbGVicmF0aW9uJTIwZWxlZ2FudHxlbnwxfHx8fDE3NjUwMDEyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: Calendar
    },
    {
        id: 3,
        title: 'Social Media Birthday Story Template',
        description: 'Eye-catching story templates optimized for Instagram, Facebook, and more',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1706759755851-6163305080f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHN0b3J5JTIwdGVtcGxhdGV8ZW58MXx8fHwxNzY1MDAxMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Social Media',
        icon: MessageCircle
    },
    {
        id: 4,
        title: 'WhatsApp / Instagram Invitation Card',
        description: 'Mobile-optimized invitation cards perfect for sharing on messaging apps',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/photo-1597665407761-16ef09c4386c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBpbnZpdGF0aW9uJTIwZGVzaWdufGVufDF8fHx8MTc2NTAwMTIyNnww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: MessageCircle
    },
    {
        id: 5,
        title: 'Birthday Website Template',
        description: 'Interactive mini-website with countdown, photo gallery, and RSVP features',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1661697522391-699652d67ad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwd2Vic2l0ZXxlbnwxfHx8fDE3NjUwMDEyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Websites',
        icon: Home
    },
    {
        id: 6,
        title: 'Anniversary Website Template',
        description: 'Romantic website design with timeline, memories section, and music player',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1755810505055-18704ae9d0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VsZWJyYXRpb24lMjByb21hbnRpY3xlbnwxfHx8fDE3NjUwMDEyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Websites',
        icon: Heart
    },
    {
        id: 7,
        title: 'Wedding / Engagement Invite Website',
        description: 'Stunning invitation website with venue map, schedule, and guest management',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1761469200597-df3c32c10a9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdhZ2VtZW50JTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY1MDAxMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Websites',
        icon: Star
    },
    {
        id: 8,
        title: 'Custom Template (Create your own)',
        description: 'Start from scratch and build your unique design with our intuitive editor',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/photo-1695634183389-53116dd525a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHRlbXBsYXRlfGVufDF8fHx8MTc2NTAwMTIyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Custom',
        icon: Palette
    },
    // Additional Cards
    {
        id: 9,
        title: 'Colorful Greeting Card',
        description: 'Vibrant and joyful greeting cards for any occasion with modern designs',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/photo-1707035091770-4c548c02e5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVldGluZyUyMGNhcmQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjUwMDE3NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: Gift
    },
    {
        id: 10,
        title: 'Party Celebration Invitation',
        description: 'Fun and festive party invitations with balloons and celebratory themes',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1723921181921-b3399cb85fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMHBhcnR5JTIwYmFsbG9vbnN8ZW58MXx8fHwxNzY1MDAxNzU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: PartyPopper
    },
    {
        id: 11,
        title: 'Thank You Card',
        description: 'Heartfelt thank you cards to express gratitude with elegant typography',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/photo-1650468911688-7ab7ffd4d6d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFuayUyMHlvdSUyMGNhcmR8ZW58MXx8fHwxNzY1MDAxNzU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: Heart
    },
    {
        id: 12,
        title: 'Baby Shower Invitation',
        description: 'Adorable baby shower invitations with cute designs and pastel colors',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1764385827792-0d3682a416de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwc2hvd2VyJTIwaW52aXRhdGlvbnxlbnwxfHx8fDE3NjUwMDE3NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: Baby
    },
    {
        id: 13,
        title: 'Graduation Celebration Card',
        description: 'Celebrate achievements with elegant graduation announcement cards',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/flagged/photo-1563203157-854702859de4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY0ODk2NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: GraduationCap
    },
    {
        id: 14,
        title: 'Holiday Festive Card',
        description: 'Seasonal holiday cards perfect for Christmas, Diwali, and festive greetings',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1764785349095-af2490ec1fea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xpZGF5JTIwZmVzdGl2ZSUyMGNhcmR8ZW58MXx8fHwxNzY1MDAxNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: Trees
    },
    {
        id: 15,
        title: 'Valentine\'s Day Romantic Card',
        description: 'Express love with beautiful romantic cards designed for Valentine\'s Day',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/photo-1611594167606-6ba5cb6510f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWxlbnRpbmVzJTIwZGF5JTIwcm9tYW50aWN8ZW58MXx8fHwxNzY1MDAxNzU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: Heart
    },
    // Social Media Templates
    {
        id: 16,
        title: 'Instagram Story Design Pack',
        description: 'Professional Instagram story templates with modern layouts and animations',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1543726969-a1da85a6d334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YWdyYW0lMjBzdG9yeSUyMGRlc2lnbnxlbnwxfHx8fDE3NjUwMDE3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Social Media',
        icon: MessageCircle
    },
    {
        id: 17,
        title: 'Facebook Post Template',
        description: 'Engaging Facebook post designs optimized for maximum reach and engagement',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/photo-1655199798186-23a85b12c4e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNlYm9vayUyMHBvc3QlMjB0ZW1wbGF0ZXxlbnwxfHx8fDE3NjUwMDE3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Social Media',
        icon: MessageCircle
    },
    {
        id: 18,
        title: 'New Year Celebration Template',
        description: 'Ring in the new year with spectacular countdown and celebration designs',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1704399527621-82de0422490c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY0ODk4NDM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Social Media',
        icon: PartyPopper
    },
    // Website Templates
    {
        id: 19,
        title: 'Business Event Invitation Website',
        description: 'Professional event website for corporate gatherings and business functions',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1705544363579-2116d47ddceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGV2ZW50JTIwaW52aXRhdGlvbnxlbnwxfHx8fDE3NjQ5NzAxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Websites',
        icon: Briefcase
    },
    {
        id: 20,
        title: 'Corporate Event Website',
        description: 'Modern and sleek website design for professional corporate events',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1764885517670-400a86ca9840?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudCUyMG1vZGVybnxlbnwxfHx8fDE3NjUwMDE3NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Websites',
        icon: Briefcase
    },
    {
        id: 21,
        title: 'Music Event Website',
        description: 'Dynamic website for concerts, music festivals, and live performances',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/photo-1661697522391-699652d67ad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwd2Vic2l0ZXxlbnwxfHx8fDE3NjUwMDEyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Websites',
        icon: Music
    },
    {
        id: 22,
        title: 'Kids Birthday Party Website',
        description: 'Fun and colorful birthday website designed especially for children\'s parties',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1723921181921-b3399cb85fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMHBhcnR5JTIwYmFsbG9vbnN8ZW58MXx8fHwxNzY1MDAxNzU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Websites',
        icon: Cake
    },
    // More Cards
    {
        id: 23,
        title: 'Minimalist Birthday Card',
        description: 'Clean and simple birthday cards with minimalist aesthetic and modern fonts',
        price: 'Free',
        isFree: true,
        thumbnail: 'https://images.unsplash.com/photo-1651178086220-86a03e3ce515?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGdyZWV0aW5nJTIwY2FyZHxlbnwxfHx8fDE3NjUwMDEyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: Star
    },
    {
        id: 24,
        title: 'Elegant Anniversary Greeting',
        description: 'Sophisticated anniversary greetings with golden accents and premium feel',
        price: '₹199',
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1758883425621-c5c8e3e5ece5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMGNlbGVicmF0aW9uJTIwZWxlZ2FudHxlbnwxfHx8fDE3NjUwMDEyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Cards',
        icon: Heart
    }
];

const categories = ['All Templates', 'Cards', 'Social Media', 'Websites', 'Custom'];

// Carousel slides data
const carouselSlides = [
    {
        title: 'Website Templates',
        description: 'Create stunning mini-websites for weddings, birthdays, and special events',
        thumbnail: 'https://images.unsplash.com/photo-1755810505055-18704ae9d0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VsZWJyYXRpb24lMjByb21hbnRpY3xlbnwxfHx8fDE3NjUwMDEyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: '₹199',
        icon: Home
    },
    {
        title: 'Digital Cards',
        description: 'Beautiful greeting cards for birthdays, anniversaries, and celebrations',
        thumbnail: 'https://images.unsplash.com/photo-1651178086220-86a03e3ce515?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGdyZWV0aW5nJTIwY2FyZHxlbnwxfHx8fDE3NjUwMDEyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 'Free',
        icon: Heart
    },
    {
        title: 'Social Media Templates',
        description: 'Eye-catching story and post templates for Instagram and Facebook',
        thumbnail: 'https://images.unsplash.com/photo-1706759755851-6163305080f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHN0b3J5JTIwdGVtcGxhdGV8ZW58MXx8fHwxNzY1MDAxMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: '₹199',
        icon: MessageCircle
    },
    {
        title: 'Invitation Cards',
        description: 'Perfect invitations for WhatsApp, Instagram, and messaging apps',
        thumbnail: 'https://images.unsplash.com/photo-1597665407761-16ef09c4386c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBpbnZpdGF0aW9uJTIwZGVzaWdufGVufDF8fHx8MTc2NTAwMTIyNnww&ixlib=rb-4.1.0&q=80&w=1080',
        price: 'Free',
        icon: Gift
    },
    {
        title: 'Party Celebrations',
        description: 'Fun and festive templates for unforgettable party invitations',
        thumbnail: 'https://images.unsplash.com/photo-1723921181921-b3399cb85fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMHBhcnR5JTIwYmFsbG9vbnN8ZW58MXx8fHwxNzY1MDAxNzU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: '₹199',
        icon: PartyPopper
    },
    {
        title: 'Custom Creation',
        description: 'Build your own unique designs with our intuitive editor',
        thumbnail: 'https://images.unsplash.com/photo-1695634183389-53116dd525a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHRlbXBsYXRlfGVufDF8fHx8MTc2NTAwMTIyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
        price: 'Free',
        icon: Palette
    }
];

export default function TemplatesBrowse() {
    const [selectedCategory, setSelectedCategory] = useState('All Templates');
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const filteredTemplates = templates.filter(template => {
        const matchesCategory = selectedCategory === 'All Templates' || template.category === selectedCategory;
        const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const visibleTemplates = filteredTemplates.slice(0, visibleCount);
    const hasMore = visibleCount < filteredTemplates.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 8);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    };

    const handleSlideClick = (slideTitle: string) => {
        alert(`You clicked on: ${slideTitle}`);
        // You can replace this with actual navigation or modal logic
    };

    // Get current slide
    const currentSlideData = carouselSlides[currentSlide];
    const IconComponent = currentSlideData.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Top Sliding Hero Section */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden py-16">
                {/* Decorative Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative w-full">
                    {/* Custom Single-Slide Carousel */}
                    <div className="relative w-full px-4 sm:px-6 lg:px-8">
                        {/* Navigation Buttons */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-7 h-7 text-white" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-7 h-7 text-white" />
                        </button>

                        {/* Single Slide Container */}
                        <div className="max-w-6xl mx-auto">
                            <div
                                onClick={() => handleSlideClick(currentSlideData.title)}
                                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                            >
                                {/* Content Above Image */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <IconComponent className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-white mb-2">
                                                {currentSlideData.title}
                                            </h2>
                                            <div className={`inline-block px-4 py-1.5 rounded-full ${currentSlideData.price === 'Free'
                                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                : 'bg-gradient-to-r from-amber-400 to-orange-500'
                                                } text-white shadow-lg`}>
                                                {currentSlideData.price}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-white/90 text-lg mb-4">
                                        {currentSlideData.description}
                                    </p>
                                    <button className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        <span>Explore Template</span>
                                    </button>
                                </div>

                                {/* Full Width Image */}
                                <div className="relative overflow-hidden rounded-2xl w-full aspect-[21/9]">
                                    <img
                                        src={currentSlideData.thumbnail}
                                        alt={currentSlideData.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dots Indicator */}
                        <div className="flex justify-center gap-2 mt-8">
                            {carouselSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'bg-white w-8'
                                        : 'bg-white/50 hover:bg-white/75 w-2'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Gradient Background with Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-300/20 rounded-full blur-2xl"></div>
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
                    {/* Hero Title */}
                    <div className="text-center mb-12">
                        <h1 className="text-white mb-4">
                            What will you design today?
                        </h1>
                        <p className="text-purple-100 max-w-2xl mx-auto">
                            Create stunning digital cards, invitations, and mini-websites for every special moment
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                            <div className="relative bg-white rounded-2xl shadow-2xl">
                                <div className="flex items-center px-6 py-4">
                                    <Search className="w-6 h-6 text-purple-400 mr-4" />
                                    <input
                                        type="text"
                                        placeholder="Search templates, cards, websites..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400"
                                    />
                                    <button className="ml-4 px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 ${selectedCategory === category
                                    ? 'bg-white text-purple-600 shadow-xl'
                                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Section Header */}
                <div className="mb-10">
                    <h2 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        {selectedCategory === 'All Templates' ? 'Popular Templates' : selectedCategory}
                    </h2>
                    <p className="text-gray-600">
                        {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
                    </p>
                </div>

                {/* Template Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {visibleTemplates.map((template) => {
                        const TemplateIconComponent = template.icon;
                        return (
                            <div
                                key={template.id}
                                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Thumbnail */}
                                <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 aspect-[4/3]">
                                    <img
                                        src={template.thumbnail}
                                        alt={template.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                            <button className="flex-1 bg-white text-purple-600 py-2 rounded-xl hover:bg-purple-50 transition-colors duration-200 flex items-center justify-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                <span>Preview</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price Badge */}
                                    <div className="absolute top-4 right-4">
                                        <div
                                            className={`px-4 py-1.5 rounded-full shadow-lg ${template.isFree
                                                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                                                }`}
                                        >
                                            {template.price}
                                        </div>
                                    </div>

                                    {/* Category Icon */}
                                    <div className="absolute top-4 left-4">
                                        <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                            <TemplateIconComponent className="w-5 h-5 text-purple-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    <h3 className="text-gray-800 mb-2 line-clamp-1">
                                        {template.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {template.description}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            <span>View Templates</span>
                                        </button>
                                        <button className="px-4 py-2.5 border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 hover:scale-105">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Load More Button */}
                {hasMore && (
                    <div className="text-center py-10">
                        <button
                            onClick={handleLoadMore}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            Load More
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-12 h-12 text-purple-400" />
                        </div>
                        <h3 className="text-gray-800 mb-2">No templates found</h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your search or filter to find what you&apos;re looking for
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All Templates');
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Call-to-Action Section */}
                <div className="mt-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-white mb-4">
                            Can&apos;t find what you&apos;re looking for?
                        </h2>
                        <p className="text-purple-100 max-w-2xl mx-auto mb-8">
                            Create a custom template from scratch with our powerful drag-and-drop editor.
                            Bring your unique vision to life!
                        </p>
                        <button className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3">
                            <Palette className="w-5 h-5" />
                            <span>Start Creating</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white/50 backdrop-blur-sm border-t border-purple-100 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl shadow-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                ELYX
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Create beautiful digital experiences for life&apos;s special moments
                        </p>
                        <div className="flex justify-center gap-8 text-sm text-gray-500">
                            <a href="#" className="hover:text-purple-600 transition-colors">About</a>
                            <a href="#" className="hover:text-purple-600 transition-colors">Templates</a>
                            <a href="#" className="hover:text-purple-600 transition-colors">Pricing</a>
                            <a href="#" className="hover:text-purple-600 transition-colors">Support</a>
                        </div>
                        <p className="text-gray-400 text-sm mt-6">
                            © 2025 ELYX. Made with love for special moments.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
