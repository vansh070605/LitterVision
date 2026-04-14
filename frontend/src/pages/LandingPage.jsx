import React from 'react';
import { ArrowRight, Activity, Battery, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center border-b border-neutral-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Urban detection environment" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=2000" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>

        <div className="relative z-10 px-8 md:px-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-2 text-primary-container font-mono text-xs tracking-[0.2em] uppercase mb-6">
            <span className="w-2 h-2 bg-primary-container animate-pulse"></span>
            <span>Neural Network Active. Live Monitoring.</span>
          </div>
          <h1 className="font-display text-6xl md:text-8xl font-light tracking-tighter leading-none max-w-4xl uppercase">
            AI-Powered <br/>
            <span className="text-primary-container font-bold italic">Urban Cleanliness</span>
          </h1>
          <p className="text-lg text-neutral-400 font-body max-w-xl py-8 leading-relaxed">
            Precision computer vision for real-time waste classification. Transforming urban sensor data into actionable environmental stewardship using EfficientNetV2 and Generative Synthesis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/analyze" className="bg-primary-container hover:bg-inverse-primary text-white font-display font-bold uppercase px-10 py-5 text-sm tracking-widest transition-all duration-100 flex items-center justify-center space-x-3 group">
              <span>Initialize Scan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Floating tech panel */}
        <div className="hidden lg:flex absolute bottom-12 right-12 bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant p-6 flex-col gap-4">
           <div className="flex justify-between items-center w-64 border-b border-neutral-800 pb-2">
             <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Model</span>
             <span className="text-[10px] font-mono text-primary-container font-bold">EfficientNetV2</span>
           </div>
           <div className="flex justify-between items-center w-64 border-b border-neutral-800 pb-2">
             <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Accuracy</span>
             <span className="text-[10px] font-mono text-white">94.8%</span>
           </div>
           <div className="flex justify-between items-center w-64">
             <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Synthesis</span>
             <span className="text-[10px] font-mono text-white">DCGAN v1.0</span>
           </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-surface-container p-8 border-t border-primary-container hover:bg-surface-container-high transition-colors">
            <Activity className="w-8 h-8 text-primary-container mb-6" />
            <h3 className="font-display text-xl uppercase mb-3">Live Deduction</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">Sub-150ms inference latency processing urban waste imagery simultaneously across 6 primary material taxonomies.</p>
         </div>
         <div className="bg-surface-container p-8 border-t border-neutral-700 hover:bg-surface-container-high transition-colors">
            <Cpu className="w-8 h-8 text-white mb-6" />
            <h3 className="font-display text-xl uppercase mb-3">Monte Carlo Dropout</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">Stochastic forward passes evaluate uncertainty limits to prevent "confidently wrong" predictions in complex lighting.</p>
         </div>
         <div className="bg-surface-container p-8 border-t border-neutral-700 hover:bg-surface-container-high transition-colors">
            <Battery className="w-8 h-8 text-white mb-6" />
            <h3 className="font-display text-xl uppercase mb-3">Generative Augmentation</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">Adversarially trained generative network synthesizes rare waste profiles (e.g. obscured plastics) to balance training tensors.</p>
         </div>
      </section>
    </div>
  );
}
