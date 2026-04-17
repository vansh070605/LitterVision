import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Camera, RefreshCw, BarChart2, ArrowRight, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  
  const [activeTab, setActiveTab] = useState('classify'); // 'classify' or 'synthesize'
  const [synthImage, setSynthImage] = useState(null);
  const [synthesizing, setSynthesizing] = useState(false);

  // Mobile QR state
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null);

  const startMobileSession = async () => {
    try {
      const res = await axios.get('/api/session/create');
      const { sessionId, ip } = res.data;
      const url = `http://${ip}:5173/mobile-upload/${sessionId}`;
      setQrUrl(url);
      setShowQr(true);

      // Start Polling
      const interval = setInterval(async () => {
        try {
          const pollRes = await axios.get(`/api/session/${sessionId}/poll`);
          if (pollRes.data.has_image) {
            clearInterval(interval);
            setShowQr(false);
            
            // Load the image into preview
            setPreview(pollRes.data.image_url);
            
            // Fetch blob to set as file for submission
            const imgRes = await fetch(pollRes.data.image_url);
            const blob = await imgRes.blob();
            const fileObj = new File([blob], "mobile_capture.jpg", { type: "image/jpeg" });
            setFile(fileObj);
            setResult(null);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 2000);
      
      setPollingInterval(interval);
    } catch (err) {
      console.error(err);
      alert('Failed to start mobile session. Is backend running?');
    }
  };

  const closeQr = () => {
    setShowQr(false);
    if (pollingInterval) clearInterval(pollingInterval);
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target.result);
        setResult(null);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    handleFileSelect(selected);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select an image first.');
    setAnalyzing(true);
    
    // In a real setup, we would send this to the Flask backend properly.
    // Since Flask expects a normal form post to /analyze, we would setup an API route or use FormData
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
      setAnalyzing(false);
    } catch (err) {
       console.error(err);
       setAnalyzing(false);
       alert('Failed to analyze the image. Is the backend running?');
    }
  };

  const handleSynthesize = async () => {
    setSynthesizing(true);
    try {
      // call the flask endpoint we created
      const res = await axios.get('/synthesize');
      setSynthImage(res.data.image);
    } catch (err) {
      console.error(err);
      alert('Failed to generate image');
    } finally {
      setSynthesizing(false);
    }
  };

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto w-full pb-12 mt-8">
      {/* Tab Nav */}
      <div className="flex border-b border-neutral-800 mb-8 font-display uppercase tracking-widest text-sm">
        <button onClick={() => setActiveTab('classify')} className={`pb-4 px-4 ${activeTab === 'classify' ? 'text-primary-container border-b-2 border-primary-container' : 'text-neutral-500 hover:text-white'}`}>
          Visual Classifier
        </button>
        <button onClick={() => setActiveTab('synthesize')} className={`pb-4 px-4 ${activeTab === 'synthesize' ? 'text-primary-container border-b-2 border-primary-container' : 'text-neutral-500 hover:text-white'}`}>
          GAN Synthesis
        </button>
      </div>

      {activeTab === 'classify' && (
        <section className="mb-12 border-l-4 border-primary-container pl-6">
          <h1 className="font-display text-5xl md:text-7xl font-light tracking-tighter uppercase leading-none">
            Synthetic <span className="text-primary-container font-bold italic">Observer</span>
          </h1>
          <p className="font-label text-sm uppercase tracking-widest text-neutral-500 mt-4 max-w-xl">
            Deploy high-precision computer vision to identify urban waste anomalies. Upload environmental data for real-time neural processing using EfficientNetV2.
          </p>
        </section>
      )}

      {activeTab === 'classify' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Upload / Results View */}
          <div className="lg:col-span-8 space-y-6">
            <div 
              className={`relative aspect-video border border-dashed transition-colors duration-200 group flex flex-col items-center justify-center overflow-hidden ${
                isDragging ? 'bg-primary-container/10 border-primary-container' : 'bg-surface-container-lowest border-outline-variant'
              }`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input type="file" id="file-input" accept="image/*" className="hidden" onChange={handleFileChange} />
              <input type="file" id="camera-input" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
              
              {!preview ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-12 text-center transition-opacity duration-300">
                  <div className={`w-16 h-16 mb-6 flex items-center justify-center transition-colors duration-200 ${isDragging ? 'bg-primary-container/20' : 'bg-surface-container-highest'}`}>
                    <UploadCloud className="text-primary-container w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl uppercase tracking-tighter mb-2">Ingest Visual Stream</h3>
                  <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed uppercase tracking-widest font-mono mb-6">
                    Drag and drop high-resolution imagery or click to select a file.
                  </p>

                  <div className="max-w-md mx-auto mb-8 p-3 border border-neutral-800 bg-neutral-900/50 text-left">
                    <span className="text-primary-container font-bold text-[10px] uppercase tracking-widest block mb-1">Restricted Domain Notice</span>
                    <span className="text-neutral-400 text-[10px] uppercase tracking-widest font-mono block leading-relaxed">
                      LitterVision is strictly calibrated for municipal waste subsets: <span className="text-white">Cardboard, Glass, Metal, Paper, Plastic, Trash.</span>
                      <br />Please only upload imagery containing these profiles to avoid forced out-of-distribution (OOD) inaccuracies.
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 relative z-20">
                    <button onClick={() => document.getElementById('file-input').click()} className="px-8 py-3 bg-primary-container text-on-primary-container font-display uppercase tracking-widest text-xs font-bold hover:bg-inverse-primary transition-colors">
                      Select Source File
                    </button>
                    <button onClick={startMobileSession} className="px-8 py-3 bg-surface-container-highest border border-outline font-display uppercase tracking-widest text-xs hover:bg-surface-bright transition-colors flex items-center justify-center gap-2">
                       <Camera className="w-4 h-4" /> Camera
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img src={preview} className={`absolute inset-0 w-full h-full object-contain z-10 ${analyzing ? 'opacity-50' : 'opacity-100'}`} alt="Preview" />
                  {analyzing && <div className="absolute inset-0 bg-primary-container/20 z-20 flex items-center justify-center">
                     <span className="font-display text-2xl uppercase tracking-widest text-white animate-pulse">Analyzing...</span>
                  </div>}
                  <button onClick={() => document.getElementById('file-input').click()} className="absolute bottom-4 left-4 z-30 px-4 py-2 bg-neutral-900/90 backdrop-blur text-[10px] uppercase tracking-widest font-mono border border-neutral-700 text-neutral-400 hover:text-white hover:border-primary-container transition-colors">
                    ⟳ Change
                  </button>
                </>
              )}
              
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <div className="flex items-center gap-2 px-2 py-1 bg-neutral-900/80 backdrop-blur-md text-[10px] font-mono tracking-tighter border border-neutral-800">
                  <span className="w-2 h-2 bg-primary-container animate-pulse"></span>
                  <span>SYSTEM READY // V2</span>
                </div>
              </div>
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(#353534 1px, transparent 1px), linear-gradient(90deg, #353534 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>

              {/* QR Overlay */}
              {showQr && (
                <div className="absolute inset-0 z-50 bg-neutral-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <button onClick={closeQr} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                  <div className="bg-white p-4 mb-6 relative">
                    <QRCodeSVG value={qrUrl} size={200} />
                    <div className="absolute inset-0 border-2 border-primary-container pointer-events-none animate-pulse"></div>
                  </div>
                  <h3 className="font-display text-xl uppercase tracking-widest text-white mb-2">Sync Mobile Camera</h3>
                  <p className="text-neutral-400 text-xs max-w-xs leading-relaxed uppercase tracking-widest font-mono">
                    Scan with your phone's camera to transmit live image data to this session.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-surface-container p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-l-2 border-primary-container">
               <div>
                  <h4 className="font-display text-sm uppercase tracking-widest text-white">Detection Parameters</h4>
                  <div className="flex gap-4 mt-2 text-[10px] uppercase font-bold text-neutral-400">
                     <span className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-container"></span>EfficientNetV2</span>
                     <span className="flex items-center gap-2"><span className="w-2 h-2 bg-neutral-600"></span>6 Classes</span>
                  </div>
               </div>
               <button onClick={handleAnalyze} disabled={!file || analyzing || result} className="w-full md:w-auto px-12 py-4 bg-primary-container text-on-primary-container font-display text-xl font-bold uppercase tracking-widest hover:bg-inverse-primary transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                 {analyzing ? <RefreshCw className="animate-spin" /> : <BarChart2 />}
                 Run Analysis
               </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-surface-container-low border-l border-neutral-800 p-8 flex flex-col gap-6">
            {!result ? (
               <div className="text-center text-neutral-500 font-display uppercase tracking-widest text-sm py-12">
                 Awaiting Input Data
               </div>
            ) : (
               <>
                 <div>
                   <p className="text-[10px] text-outline uppercase tracking-widest mb-1">Primary Class</p>
                   <p className="text-4xl font-display font-light uppercase text-white">{result.prediction}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[10px] text-outline uppercase tracking-widest mb-1">Confidence</p>
                     <p className="text-2xl font-display text-white">{result.confidence}%</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-outline uppercase tracking-widest mb-1">Latency</p>
                     <p className="text-2xl font-display text-white">{result.latency}ms</p>
                   </div>
                 </div>
                 <div className="border-t border-neutral-800 pt-6">
                    <p className="text-[10px] text-outline uppercase tracking-widest mb-4">Distribution</p>
                    <div className="space-y-4">
                      {result.top_predictions.map(([cls, conf], i) => (
                         <div key={cls}>
                           <div className="flex justify-between text-[10px] uppercase font-mono text-neutral-400 mb-1">
                             <span>{cls}</span><span>{conf}%</span>
                           </div>
                           <div className="h-1 w-full bg-neutral-800">
                              <div className={`h-full ${i === 0 ? 'bg-primary-container' : 'bg-neutral-600'}`} style={{ width: `${conf}%` }}></div>
                           </div>
                         </div>
                      ))}
                    </div>
                 </div>
                 <div className="border-t border-neutral-800 pt-6 mt-auto">
                    <p className="text-[10px] font-bold text-primary-container uppercase tracking-widest mb-2">Eco-Tip</p>
                    <p className="text-xs text-neutral-400">{result.tip}</p>
                 </div>
               </>
            )}
          </div>
        </div>
      ) : (
        /* GAN Synthesis Tab */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="flex flex-col justify-center">
             <h1 className="font-display text-5xl font-light tracking-tighter uppercase leading-none mb-6">
               Adversarial <span className="text-primary-container font-bold italic">Synthesis</span>
             </h1>
             <p className="text-neutral-400 font-body text-sm max-w-md leading-relaxed mb-8">
               Our DCGAN architecture synthesizes hyper-realistic images of urban waste from pure noise vectors (z in R^100). This system is used to augment the training dataset for rare classes.
             </p>
             <button onClick={handleSynthesize} disabled={synthesizing} className="bg-white text-black font-display font-bold uppercase tracking-widest px-8 py-4 flex items-center justify-center gap-3 hover:bg-neutral-200 transition-colors self-start">
               {synthesizing ? <RefreshCw className="animate-spin w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
               Generate Synthetic Batch
             </button>
           </div>
           
           <div className="aspect-square bg-surface-container-highest border border-outline-variant relative flex items-center justify-center">
             {!synthImage && !synthesizing ? (
               <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Awaiting Generator Latent Vector</div>
             ) : synthesizing ? (
               <div className="text-primary-container font-mono text-xs uppercase tracking-widest animate-pulse">Running Generator Network...</div>
             ) : (
               <img src={synthImage} className="w-full h-full object-cover pixelated" style={{ imageRendering: 'pixelated' }} alt="Synthesized waste" />
             )}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(#353534 1px, transparent 1px), linear-gradient(90deg, #353534 1px, transparent 1px)", backgroundSize: "64px 64px" }}></div>
           </div>
        </div>
      )}
    </div>
  );
}
