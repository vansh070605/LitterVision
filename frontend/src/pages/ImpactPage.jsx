import React from 'react';

export default function ImpactPage() {
  return (
    <div className="px-8 max-w-7xl mx-auto w-full py-12">
      <h1 className="text-6xl font-light font-display tracking-tighter mb-4 uppercase">
        Global Impact <br/>
        <span className="text-primary-container font-bold italic">Metrics</span>
      </h1>
      <p className="text-neutral-400 font-body text-lg max-w-3xl mb-4">
        Real-time telemetry and optical statistics captured via deployed EfficientNetV2 neural endpoints across urban grid locations.
      </p>
      
      <p className="text-neutral-300 font-body text-sm max-w-3xl mb-12 border-l-2 border-primary-container pl-4">
        <strong className="text-white uppercase tracking-widest text-xs mb-1 block font-display">Real-World Impact</strong>
        By instantly categorizing waste streams at the edge, LitterVision enables autonomous sorting facilities to drastically reduce cross-contamination rates in global shipments of recyclables. Municipalities can trace pollution density heatmaps to strategically deploy cleaning crews, reducing manual sorting labor costs by up to 40% and preventing thousands of tons of microplastics from reaching marine ecosystems.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="bg-surface-container border-l-2 border-primary-container p-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Total Detections</p>
          <p className="text-4xl font-display font-light">1,402,891</p>
        </div>
        <div className="bg-surface-container p-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Plastic Polymers</p>
          <p className="text-4xl font-display font-light">54.2<span className="text-xl text-neutral-500">%</span></p>
        </div>
        <div className="bg-surface-container p-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Model Confidence Avg</p>
          <p className="text-4xl font-display font-light">94.8<span className="text-xl text-neutral-500">%</span></p>
        </div>
        <div className="bg-surface-container p-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">Synthesis Tensors</p>
          <p className="text-4xl font-display font-light">84,000</p>
        </div>
      </div>

      <div className="aspect-video bg-neutral-900 w-full relative overflow-hidden border border-neutral-800">
         {/* Map placeholder */}
         <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')" }}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
         <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-primary-container rounded-full animate-ping opacity-75"></div>
         <div className="absolute top-1/3 left-2/3 w-3 h-3 bg-white rounded-full animate-ping opacity-50"></div>
         <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-primary-container rounded-full animate-ping opacity-90"></div>
         
         <div className="absolute bottom-8 left-8 bg-neutral-950/80 backdrop-blur p-4 border border-outline-variant">
            <p className="font-mono text-xs uppercase text-primary-container tracking-widest">Active Node</p>
            <p className="font-display text-xl uppercase mt-1">Sector 42 Alpha</p>
            <p className="font-mono text-[10px] text-neutral-500 mt-2">143 Items Detected / Hour</p>
         </div>
      </div>
    </div>
  );
}
