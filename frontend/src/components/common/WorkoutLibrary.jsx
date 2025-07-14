import React, { useState, useEffect } from 'react';
import { FaPlay, FaYoutube, FaDumbbell, FaHeart, FaFilter, FaSearch } from 'react-icons/fa';

const WorkoutLibrary = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Workouts', icon: '🏋️' },
    { id: 'strength', name: 'Strength Training', icon: '💪' },
    { id: 'cardio', name: 'Cardio', icon: '❤️' },
    { id: 'yoga', name: 'Yoga & Flexibility', icon: '🧘' },
    { id: 'hiit', name: 'HIIT', icon: '⚡' },
    { id: 'beginner', name: 'Beginner', icon: '🌱' },
    { id: 'advanced', name: 'Advanced', icon: '🔥' }
  ];

  // Sample workout data with YouTube videos
  const sampleWorkouts = [
    {
      id: 1,
      title: "Full Body Strength Training",
      category: "strength",
      difficulty: "Intermediate",
      duration: "45 min",
      trainer: "Fitness Blender",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      description: "Complete full body workout targeting all major muscle groups.",
      tags: ["strength", "full body", "intermediate"]
    },
    {
      id: 2,
      title: "HIIT Cardio Blast",
      category: "hiit",
      difficulty: "Advanced",
      duration: "30 min",
      trainer: "Pamela Reif",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      description: "High-intensity interval training for maximum calorie burn.",
      tags: ["cardio", "hiit", "advanced"]
    },
    {
      id: 3,
      title: "Beginner Yoga Flow",
      category: "yoga",
      difficulty: "Beginner",
      duration: "20 min",
      trainer: "Yoga With Adriene",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      description: "Gentle yoga flow perfect for beginners and stress relief.",
      tags: ["yoga", "beginner", "flexibility"]
    },
    {
      id: 4,
      title: "Advanced Powerlifting",
      category: "strength",
      difficulty: "Advanced",
      duration: "60 min",
      trainer: "Jeff Nippard",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      description: "Advanced powerlifting techniques and compound movements.",
      tags: ["strength", "powerlifting", "advanced"]
    },
    {
      id: 5,
      title: "Low Impact Cardio",
      category: "cardio",
      difficulty: "Beginner",
      duration: "25 min",
      trainer: "Leslie Sansone",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      description: "Low impact cardio workout perfect for all fitness levels.",
      tags: ["cardio", "beginner", "low impact"]
    },
    {
      id: 6,
      title: "Core Strength & Stability",
      category: "strength",
      difficulty: "Intermediate",
      duration: "35 min",
      trainer: "Athlean-X",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      description: "Comprehensive core workout focusing on strength and stability.",
      tags: ["strength", "core", "intermediate"]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWorkouts(sampleWorkouts);
      setFilteredWorkouts(sampleWorkouts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [selectedCategory, searchTerm, workouts]);

  const filterWorkouts = () => {
    let filtered = workouts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(workout => workout.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(workout =>
        workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredWorkouts(filtered);
  };

  const openYouTubeVideo = (youtubeId) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <FaDumbbell className="text-red-400 text-xl" />
        <h2 className="text-2xl font-bold text-white">Workout Library</h2>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search workouts, trainers, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-400">
          Showing {filteredWorkouts.length} of {workouts.length} workouts
        </p>
      </div>

      {/* Workout Grid */}
      {filteredWorkouts.length === 0 ? (
        <div className="text-center py-12">
          <FaDumbbell className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No workouts found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/30 hover:border-red-400/50 transition-all duration-300 group"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={workout.thumbnail}
                  alt={workout.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => openYouTubeVideo(workout.youtubeId)}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                    aria-label={`Watch ${workout.title} on YouTube`}
                  >
                    <FaPlay className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <FaYoutube className="text-red-500 text-xl" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {workout.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {workout.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Trainer:</span>
                    <span className="text-white">{workout.trainer}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{workout.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Difficulty:</span>
                    <span className={`font-medium ${getDifficultyColor(workout.difficulty)}`}>
                      {workout.difficulty}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {workout.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openYouTubeVideo(workout.youtubeId)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FaPlay className="w-3 h-3" />
                    Watch
                  </button>
                  <button
                    className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors duration-200"
                    aria-label="Add to favorites"
                  >
                    <FaHeart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 text-xs text-gray-400 text-center">
        <p>
          Workout videos are sourced from YouTube. Always consult with a fitness professional 
          before starting a new workout routine.
        </p>
      </div>
    </div>
  );
};

export default WorkoutLibrary; 