import React, { useState } from 'react';
import axios from 'axios';
import { Camera, UploadCloud, CheckCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function MobileUploadPage() {
  const { sessionId } = useParams();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target.result);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // the flask server expects the post locally relative to where mobile is visiting
      // but wait, we need to know the local IP that flask is running on. 
      // We will assume flask is running on port 5000 of the same hostname
      await axios.post(`/api/session/${sessionId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image to desktop session.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 font-body">
      {!success ? (
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center mb-4">
            <h1 className="font-display text-2xl uppercase tracking-widest text-primary-container mb-2">LitterVision Link</h1>
            <p className="text-xs text-neutral-400 mb-2">Capture a photo to send immediately to your desktop analyzer.</p>
            <p className="text-[10px] text-neutral-500 font-mono border-t border-neutral-800 pt-2 border-b pb-2 inline-block">
              RESTRICTED DOMAIN: ONLY CAPTURE CARDBOARD, GLASS, METAL, PAPER, PLASTIC, OR TRASH.
            </p>
          </div>
          
          <div className="aspect-square w-full bg-neutral-900 border border-neutral-700 flex flex-col items-center justify-center relative overflow-hidden">
            <input type="file" id="camera-upload" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="flex flex-col items-center text-neutral-500 p-8 text-center" onClick={() => document.getElementById('camera-upload').click()}>
                <Camera className="w-12 h-12 mb-4 text-neutral-600" />
                <span className="font-display uppercase tracking-widest text-sm">Tap to Open Camera</span>
              </div>
            )}
          </div>

          {preview && (
            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className="w-full py-4 bg-primary-container font-display uppercase tracking-widest font-bold hover:bg-red-600 transition-colors flex justify-center items-center gap-2"
            >
              {uploading ? 'Transmitting...' : <><UploadCloud className="w-5 h-5"/> Send to Desktop</>}
            </button>
          )}

          {preview && (
            <button 
              onClick={() => document.getElementById('camera-upload').click()} 
              className="w-full py-3 border border-neutral-700 text-neutral-400 font-display uppercase tracking-widest text-xs hover:bg-neutral-800 transition-colors"
            >
              Retake Photo
            </button>
          )}
        </div>
      ) : (
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="font-display text-xl uppercase tracking-widest text-white">Transmission Successful</h2>
          <p className="text-neutral-400 text-sm">Image received. Check your desktop screen to continue analysis.</p>
        </div>
      )}
    </div>
  );
}
