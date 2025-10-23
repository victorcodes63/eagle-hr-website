'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Target, BarChart3, Users, Shield } from 'lucide-react';

const SlidingHRQuestions = () => {
  const [isVisible, setIsVisible] = useState(false);

  // HR Questions organized in three rows
  const hrQuestions = {
    row1: [
      "How do I build a strong employer brand?",
      "What are the latest HR compliance requirements?",
      "How do I reduce employee turnover?",
      "What's the best recruitment strategy?",
      "How do I handle difficult conversations?",
      "What are effective performance management techniques?",
      "How do I create an inclusive workplace?",
      "What's the ROI of HR technology?"
    ],
    row2: [
      "How do I attract top talent?",
      "What's the best onboarding process?",
      "How do I manage remote teams?",
      "What are the key HR metrics to track?",
      "How do I develop leadership skills?",
      "What's the future of HR?",
      "How do I handle workplace conflicts?",
      "What are the benefits of HR outsourcing?"
    ],
    row3: [
      "How do I create effective HR policies?",
      "What's the best way to conduct interviews?",
      "How do I measure employee engagement?",
      "What are the latest labor law changes?",
      "How do I build a diverse workforce?",
      "What's the impact of AI on HR?",
      "How do I create career development paths?",
      "What are the costs of poor HR practices?"
    ]
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="mt-8 py-16 md:py-20 bg-gradient-to-br from-neutral-50 via-white to-primary-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-primary-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1.1, 1, 1.1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-40 h-40 bg-secondary-200/20 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-6 py-3 bg-primary-900 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Your HR Questions Answered
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-900 mb-6">
            Removing the Roadblocks to
            <span className="block text-secondary-500 mt-2">Your HR Success</span>
          </h2>
          
          <p className="text-xl text-neutral-700 max-w-4xl mx-auto leading-relaxed"> 
            We filter out the noise, focus on what truly matters, and give you the kind of clarity 
            that lets your organization shine in the market.
          </p>
        </motion.div>

        {/* Sliding Questions Section */}
        <div className="relative mb-20">
          {/* Row 1 - Sliding Left to Right */}
          <div className="relative overflow-hidden mb-8">
            <motion.div
              animate={{ x: isVisible ? [0, -100, 0] : 0 }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="flex space-x-4"
            >
              {[...hrQuestions.row1, ...hrQuestions.row1].map((question, index) => (
                <motion.div
                  key={`row1-${index}`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex-shrink-0 bg-gradient-to-r from-slate-100 to-gray-200 text-primary-900 px-4 py-3 md:px-6 md:py-4 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {question}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Row 2 - Sliding Right to Left */}
          <div className="relative overflow-hidden mb-8">
            <motion.div
              animate={{ x: isVisible ? [0, 100, 0] : 0 }}
              transition={{ 
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="flex space-x-4"
            >
              {[...hrQuestions.row2, ...hrQuestions.row2].map((question, index) => (
                <motion.div
                  key={`row2-${index}`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex-shrink-0 bg-gradient-to-r from-blue-100 to-sky-200 text-primary-900 px-4 py-3 md:px-6 md:py-4 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {question}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Row 3 - Sliding Left to Right */}
          <div className="relative overflow-hidden">
            <motion.div
              animate={{ x: isVisible ? [0, -80, 0] : 0 }}
              transition={{ 
                duration: 28,
                repeat: Infinity,
                ease: "linear"
              }}
              className="flex space-x-4"
            >
              {[...hrQuestions.row3, ...hrQuestions.row3].map((question, index) => (
                <motion.div
                  key={`row3-${index}`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex-shrink-0 bg-gradient-to-r from-indigo-100 to-blue-200 text-primary-900 px-4 py-3 md:px-6 md:py-4 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {question}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Value Proposition Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-slate-100 border-2 border-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg group-hover:border-primary-600 transition-all duration-300"
            >
              <Target className="w-8 h-8 text-primary-700" />
            </motion.div>
            
            <h3 className="text-xl font-heading font-bold text-primary-900 mb-3">
              We Make HR Simple
            </h3>
            
            <p className="text-neutral-600 leading-relaxed">
              No jargon, no overcomplication — just clear HR strategies you can follow 
              to build and grow your organization confidently.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg group-hover:border-primary-600 transition-all duration-300"
            >
              <BarChart3 className="w-8 h-8 text-primary-700" />
            </motion.div>
            
            <h3 className="text-xl font-heading font-bold text-primary-900 mb-3">
              We Focus on Real Results
            </h3>
            
            <p className="text-neutral-600 leading-relaxed">
              Every HR strategy we create is designed to help you hire faster, 
              retain better, and increase productivity.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg group-hover:border-primary-600 transition-all duration-300"
            >
              <Users className="w-8 h-8 text-primary-700" />
            </motion.div>
            
            <h3 className="text-xl font-heading font-bold text-primary-900 mb-3">
              We Know What Works
            </h3>
            
            <p className="text-neutral-600 leading-relaxed">
              With close to a decade of hands-on experience across industries, we bring 
              proven HR strategies and practical solutions to the table.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-slate-50 border-2 border-slate-300 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg group-hover:border-primary-600 transition-all duration-300"
            >
              <Shield className="w-8 h-8 text-primary-700" />
            </motion.div>
            
            <h3 className="text-xl font-heading font-bold text-primary-900 mb-3">
              With You All the Way
            </h3>
            
            <p className="text-neutral-600 leading-relaxed">
              From your first hire to scaling your team, we provide ongoing 
              HR support, not just a one-time consultation.
            </p>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
          >
            Get Your HR Questions Answered
            <ArrowRight className="ml-2 w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default SlidingHRQuestions;
