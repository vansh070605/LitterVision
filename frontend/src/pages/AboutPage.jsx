import React from 'react';

export default function AboutPage() {
  return (
    <div className="px-8 max-w-4xl mx-auto w-full py-16">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 bg-primary-container"></span>
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">System Architecture & Methodology</span>
      </div>
      <h1 className="font-display text-5xl md:text-7xl font-light tracking-tighter uppercase leading-none mb-12">
        About <span className="text-primary-container font-bold italic">LitterVision</span>
      </h1>

      <div className="space-y-12 text-neutral-300 font-body leading-relaxed border-l border-neutral-800 pl-6">
        
        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-white mb-4">The Problem</h2>
          <p>
            Global urban centers generate millions of tons of municipal solid waste annually, with a vast majority ending up in landfills or polluting marine ecosystems due to inefficient separation. Traditional recycling pipelines rely heavily on manual sorting or rudimentary optical scanners, which struggle with contamination and class imbalance (e.g., distinguishing a crushed soda can from metallic debris).
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-white mb-4">What We Built</h2>
          <p>
            LitterVision AI is an intelligence framework designed to automate the classification and statistical analysis of localized urban waste. By processing visual data through a real-time neural pipeline, we accurately categorize debris into six foundational taxonomies (cardboard, glass, metal, paper, plastic, and general trash). The goal is to drive highly targeted environmental stewardship and optimize city recycling infrastructure with edge-ready telemetry.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-white mb-4">How We Conquered The Issue</h2>
          <p>
            To resolve traditional optical failure points, we integrated a two-part neural architecture. We paired a high-speed discriminative classifier with an adversarial augmentation pipeline. This allowed us to aggressively upsample underrepresented waste profiles (like obscured plastics) using synthetic data, ensuring our primary classification net wasn't biased towards common waste. 
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-white mb-4">The Models Used</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-surface-container border border-outline-variant p-6 relative group hover:border-primary-container transition-colors">
              <div className="absolute top-0 right-0 w-8 h-8 bg-neutral-900 border-b border-l border-outline-variant group-hover:border-primary-container flex items-center justify-center">
                <span className="font-mono text-[10px] text-neutral-500">01</span>
              </div>
              <h3 className="font-display text-lg uppercase text-white mb-2">EfficientNetV2</h3>
              <p className="text-sm font-label uppercase tracking-widest text-primary-container mb-4">Visual Classifier</p>
              <p className="text-xs text-neutral-400">
                Our core detection engine is powered by Google's EfficientNetV2, an advanced convolutional neural network (CNN). We chose this architecture over heavier models like ResNet50 or YOLOv8 because of its progressive learning and optimal parameter-to-accuracy ratio. It maintains sub-150ms inference latencies, ensuring the platform is lightweight enough for real-time edge deployments while preserving probabilistic accuracy.
              </p>
            </div>

            <div className="bg-surface-container border border-outline-variant p-6 relative group hover:border-primary-container transition-colors">
              <div className="absolute top-0 right-0 w-8 h-8 bg-neutral-900 border-b border-l border-outline-variant group-hover:border-primary-container flex items-center justify-center">
                <span className="font-mono text-[10px] text-neutral-500">02</span>
              </div>
              <h3 className="font-display text-lg uppercase text-white mb-2">DCGAN</h3>
              <p className="text-sm font-label uppercase tracking-widest text-white mb-4">Synthetic Augmentation</p>
              <p className="text-xs text-neutral-400">
                A Deep Convolutional Generative Adversarial Network was trained specifically to overcome dataset imbalances. While diffusion models are newer, a DCGAN offers a highly efficient map from pure random noise vectors (z ∈ ℝ¹⁰⁰) directly to spatial imaging. By algorithmically synthesizing edge cases (like crushed cans), we continuously augment our training tensors.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
