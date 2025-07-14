import React, { useState } from "react";
import { FaDumbbell, FaTrophy, FaStar, FaClock, FaUsers, FaGraduationCap, FaAward, FaCalendar, FaPhone, FaEnvelope, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import Button from "../components/common/Button";
import toast from "react-hot-toast";
import trainer1 from "../../assets/img/trainer1.jpg";
import trainer2 from "../../assets/img/trainer2.jpg";
import trainer3 from "../../assets/img/trainer3.jpg";
import before1 from "../../assets/img/beforevsafter1.jpg";
import before2 from "../../assets/img/beforevsafter2.jpg";
import before3 from "../../assets/img/beforevsafter3.jpg";
import before4 from "../../assets/img/beforevsafter4.jpg";
import before5 from "../../assets/img/beforevsafter5.jpg";
import before6 from "../../assets/img/beforevsafter6.jpg";

const Trainers = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const trainers = [
    {
      id: 1,
      name: "Ahmed   Khan",
      role: "Head Strength Coach",
      image: trainer1,
      experience: "12+ Years",
      specialization: "Powerlifting & Bodybuilding",
      rating: 4.9,
      clients: 250,
      certifications: [
        "NASM Certified Personal Trainer",
        "ISSA Master Trainer",
        "CrossFit Level 2 Trainer",
        "Precision Nutrition Coach"
      ],
      achievements: [
        "National Powerlifting Champion 2022",
        "IFBB Pro Card Holder",
        "Trainer of the Year 2023",
        "500+ Successful Transformations"
      ],
      bio: "Ahmed 'The Beast' Khan is our head strength coach with over 12 years of experience in powerlifting and bodybuilding. He has trained over 250 clients and helped them achieve their fitness goals. His unique approach combines traditional strength training with modern techniques.",
      specialties: ["Powerlifting", "Bodybuilding", "Strength Training", "Muscle Building"],
      availability: "Mon-Fri: 6AM-10PM, Sat-Sun: 8AM-8PM",
      phone: "+92 300 123 4567",
      email: "ahmed@levelsgym.com",
      social: {
        instagram: "@ahmedthebeast",
        facebook: "AhmedKhanFitness",
        linkedin: "ahmed-khan-fitness"
      },
      beforeAfter: [
        {
          before: before1,
          after: before2,
          client: "Usman Malik",
          transformation: "Lost 30kg, gained 15kg muscle in 18 months"
        },
        {
          before: before3,
          after: before4,
          client: "Bilal Ahmed",
          transformation: "Increased bench press from 60kg to 120kg"
        }
      ]
    },
    {
      id: 2,
      name: "Fatima Ali",
      role: "Senior Fitness Coach",
      image: trainer2,
      experience: "8+ Years",
      specialization: "Functional Fitness & Weight Loss",
      rating: 4.8,
      clients: 180,
      certifications: [
        "ACE Certified Personal Trainer",
        "FMS Level 2 Specialist",
        "TRX Suspension Training",
        "Yoga Alliance RYT-200"
      ],
      achievements: [
        "Regional Fitness Competition Winner",
        "Weight Loss Specialist of the Year",
        "300+ Successful Weight Loss Stories",
        "Featured in Fitness Magazine"
      ],
      bio: "Fatima 'The Warrior' Ali specializes in functional fitness and weight loss. Her holistic approach focuses on sustainable lifestyle changes and building lasting habits. She has helped hundreds of clients achieve their weight loss goals.",
      specialties: ["Weight Loss", "Functional Training", "HIIT", "Yoga"],
      availability: "Mon-Fri: 7AM-9PM, Sat: 8AM-6PM",
      phone: "+92 300 123 4568",
      email: "fatima@levelsgym.com",
      social: {
        instagram: "@fatimawarrior",
        facebook: "FatimaAliFitness",
        linkedin: "fatima-ali-fitness"
      },
      beforeAfter: [
        {
          before: before5,
          after: before6,
          client: "Ayesha Hassan",
          transformation: "Lost 25kg, improved flexibility and strength"
        },
        {
          before: before2,
          after: before3,
          client: "Sarah Johnson",
          transformation: "Completed first marathon, lost 20kg"
        }
      ]
    },
    {
      id: 3,
      name: "Usman  Malik",
      role: "Elite Performance Coach",
      image: trainer3,
      experience: "15+ Years",
      specialization: "Athletic Performance & CrossFit",
      rating: 5.0,
      clients: 320,
      certifications: [
        "CSCS Certified Strength Coach",
        "CrossFit Level 3 Trainer",
        "USA Weightlifting Coach",
        "Sports Nutrition Specialist"
      ],
      achievements: [
        "Former Professional Athlete",
        "CrossFit Games Regional Champion",
        "Elite Performance Coach Award",
        "600+ Athletic Transformations"
      ],
      bio: "Usman 'The Machine' Malik is our elite performance coach with a background in professional sports. He specializes in athletic performance and CrossFit training, helping athletes reach their peak potential.",
      specialties: ["Athletic Performance", "CrossFit", "Olympic Lifting", "Sports Training"],
      availability: "Mon-Sun: 5AM-11PM",
      phone: "+92 300 123 4569",
      email: "usman@levelsgym.com",
      social: {
        instagram: "@usmanthemachine",
        facebook: "UsmanMalikPerformance",
        linkedin: "usman-malik-performance"
      },
      beforeAfter: [
        {
          before: before4,
          after: before5,
          client: "Ahmed Khan",
          transformation: "Improved 5K time from 25min to 18min"
        },
        {
          before: before6,
          after: before1,
          client: "Mike Chen",
          transformation: "Qualified for CrossFit Regionals"
        }
      ]
    }
  ];

  const handleTrainerSelect = (trainer) => {
    setSelectedTrainer(trainer);
    setIsBookingModalOpen(true);
  };

  const handleBooking = async () => {
    if (!selectedTrainer) return;
    
    toast.success(`Booking request sent to ${selectedTrainer.name}! We'll contact you soon.`);
    setIsBookingModalOpen(false);
    setSelectedTrainer(null);
  };

  return (
    <div className="min-h-screen bg-red-gradient py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-32">
        {/* Header Section */}
        <div className="text-center mb-20 fade-in">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 px-6 py-3 rounded-full text-sm font-medium mb-6"
          >
            Meet Our Warriors
          </motion.div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Elite <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Trainers</span>
          </h1>
          <p className="text-xl text-red-200 max-w-3xl mx-auto">
            Our certified warriors are here to transform your body and mind. Each trainer brings unique expertise 
            and proven results to help you achieve your fitness goals.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              {/* Trainer Image */}
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={trainer.image} 
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`text-sm ${i < Math.floor(trainer.rating) ? 'text-yellow-400' : 'text-gray-400'}`} />
                    ))}
                    <span className="text-white text-sm font-medium ml-2">{trainer.rating}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{trainer.name}</h3>
                  <p className="text-red-300 font-medium">{trainer.role}</p>
                </div>
              </div>

              {/* Trainer Info */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaClock className="text-red-400" />
                    <span className="text-sm">{trainer.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaUsers className="text-red-400" />
                    <span className="text-sm">{trainer.clients}+ Clients</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-3">{trainer.bio}</p>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {trainer.specialties.map((specialty, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-red-500/20 border border-red-400/30 text-red-300 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications Preview */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-2">Certifications:</h4>
                  <div className="space-y-1">
                    {trainer.certifications.slice(0, 2).map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                        <FaGraduationCap className="text-red-400 text-xs" />
                        <span>{cert}</span>
                      </div>
                    ))}
                    {trainer.certifications.length > 2 && (
                      <span className="text-red-400 text-sm">+{trainer.certifications.length - 2} more</span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  title="Book Session" 
                  onClick={() => handleTrainerSelect(trainer)}
                  className="w-full bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white hover:bg-red-500/30 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Before & After Transformations */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Real <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Transformations</span>
            </h2>
            <p className="text-xl text-red-200 max-w-3xl mx-auto">
              See the incredible results our trainers have helped clients achieve
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.flatMap(trainer => trainer.beforeAfter).map((transformation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              >
                <div className="mb-4 flex justify-center">
                  <img 
                    src={transformation.before} 
                    alt={transformation.client + ' transformation'}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <h4 className="text-white font-semibold mb-2">{transformation.client}</h4>
                <p className="text-gray-300 text-sm">{transformation.transformation}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-12 border border-white/10">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Start Your <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Transformation</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Book a session with one of our elite trainers and take the first step towards your fitness goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                title="Book Your Session" 
                link="/contact"
                className="bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white hover:bg-red-500/30 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              />
              <Button 
                title="View All Plans" 
                link="/plans"
                className="bg-black/30 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedTrainer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Book Session with {selectedTrainer.name}</h3>
            <p className="text-gray-300 mb-6">We'll contact you within 24 hours to schedule your session.</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <FaPhone className="text-red-400" />
                <span>{selectedTrainer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <FaEnvelope className="text-red-400" />
                <span>{selectedTrainer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <FaClock className="text-red-400" />
                <span>{selectedTrainer.availability}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                title="Confirm Booking" 
                onClick={handleBooking}
                className="flex-1 bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white hover:bg-red-500/30 py-3 rounded-xl font-semibold transition-all duration-300"
              />
              <Button 
                title="Cancel" 
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 bg-black/30 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 py-3 rounded-xl font-semibold transition-all duration-300"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Trainers; 