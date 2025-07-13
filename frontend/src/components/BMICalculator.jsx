import React, { useState } from 'react';
import { FaCalculator, FaInfoCircle, FaWeight, FaRuler } from 'react-icons/fa';

const BMICalculator = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    unit: 'metric' // metric or imperial
  });
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMI = () => {
    const { weight, height, unit } = formData;
    
    if (!weight || !height) {
      return;
    }

    let bmiValue;
    
    if (unit === 'metric') {
      // Weight in kg, height in cm
      const heightInMeters = height / 100;
      bmiValue = weight / (heightInMeters * heightInMeters);
    } else {
      // Weight in lbs, height in inches
      bmiValue = (weight * 703) / (height * height);
    }

    setBmi(bmiValue.toFixed(1));
    
    // Determine BMI category
    if (bmiValue < 18.5) {
      setCategory('Underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setCategory('Normal weight');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
    
    setShowResult(true);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Underweight':
        return 'text-blue-400';
      case 'Normal weight':
        return 'text-green-400';
      case 'Overweight':
        return 'text-yellow-400';
      case 'Obese':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getCategoryDescription = (category) => {
    switch (category) {
      case 'Underweight':
        return 'You may need to gain some weight. Consider consulting a nutritionist.';
      case 'Normal weight':
        return 'Great! You are in a healthy weight range. Keep maintaining your lifestyle.';
      case 'Overweight':
        return 'Consider a balanced diet and regular exercise to reach a healthy weight.';
      case 'Obese':
        return 'It\'s recommended to consult a healthcare provider for a personalized plan.';
      default:
        return '';
    }
  };

  const resetCalculator = () => {
    setFormData({
      weight: '',
      height: '',
      unit: 'metric'
    });
    setBmi(null);
    setCategory('');
    setShowResult(false);
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <FaCalculator className="text-red-400 text-xl" />
        <h2 className="text-2xl font-bold text-white">BMI Calculator</h2>
      </div>

      <div className="space-y-6">
        {/* Unit Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Unit System
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="unit"
                value="metric"
                checked={formData.unit === 'metric'}
                onChange={handleInputChange}
                className="mr-2 text-red-400 focus:ring-red-500"
              />
              <span className="text-white">Metric (kg, cm)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="unit"
                value="imperial"
                checked={formData.unit === 'imperial'}
                onChange={handleInputChange}
                className="mr-2 text-red-400 focus:ring-red-500"
              />
              <span className="text-white">Imperial (lbs, inches)</span>
            </label>
          </div>
        </div>

        {/* Weight Input */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
            <FaWeight className="inline mr-2 text-red-400" />
            Weight ({formData.unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder={`Enter weight in ${formData.unit === 'metric' ? 'kg' : 'lbs'}`}
            className="w-full px-4 py-3 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
            min="0"
            step="0.1"
            aria-describedby="weight-help"
          />
          <p id="weight-help" className="text-sm text-gray-400 mt-1">
            Enter your current weight
          </p>
        </div>

        {/* Height Input */}
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2">
            <FaRuler className="inline mr-2 text-red-400" />
            Height ({formData.unit === 'metric' ? 'cm' : 'inches'})
          </label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder={`Enter height in ${formData.unit === 'metric' ? 'cm' : 'inches'}`}
            className="w-full px-4 py-3 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
            min="0"
            step="0.1"
            aria-describedby="height-help"
          />
          <p id="height-help" className="text-sm text-gray-400 mt-1">
            Enter your current height
          </p>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateBMI}
          disabled={!formData.weight || !formData.height}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Calculate BMI
        </button>

        {/* Results */}
        {showResult && bmi && (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/30">
            <h3 className="text-xl font-semibold text-white mb-4">Your BMI Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BMI Value */}
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">{bmi}</div>
                <div className="text-lg text-gray-300">Your BMI</div>
              </div>

              {/* Category */}
              <div className="text-center">
                <div className={`text-2xl font-bold ${getCategoryColor(category)} mb-2`}>
                  {category}
                </div>
                <div className="text-sm text-gray-400">Category</div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  {getCategoryDescription(category)}
                </p>
              </div>
            </div>

            {/* BMI Categories Reference */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">BMI Categories</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="font-semibold text-blue-400">Underweight</div>
                  <div className="text-gray-300">&lt; 18.5</div>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="font-semibold text-green-400">Normal</div>
                  <div className="text-gray-300">18.5 - 24.9</div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="font-semibold text-yellow-400">Overweight</div>
                  <div className="text-gray-300">25.0 - 29.9</div>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="font-semibold text-red-400">Obese</div>
                  <div className="text-gray-300">≥ 30.0</div>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetCalculator}
              className="mt-6 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Calculate Again
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-xs text-gray-400 text-center">
          <p>
            This BMI calculator is for informational purposes only. 
            Please consult with a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator; 