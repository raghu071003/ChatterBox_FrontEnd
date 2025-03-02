import React, { useState, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDropzone } from "react-dropzone";
import { IoClose, IoCloudUpload, IoImage, IoCheckmarkCircle } from "react-icons/io5";
import axios from "axios";

const ProfilePicture = ({ onClose, onSuccess }) => {
  const [image, setImage] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: "px", width: 100, height: 100, x: 10, y: 10, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Handle file drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgSrc(reader.result);
        });
        reader.readAsDataURL(file);
      }
    },
  });

  // This handles the image load and sets up the crop
  const onImageLoad = (e) => {
    imgRef.current = e.currentTarget;
    
    // Set initial crop to center of the image
    const { width, height } = e.currentTarget;
    const cropSize = Math.min(width, height) * 0.8;
    const x = (width - cropSize) / 2;
    const y = (height - cropSize) / 2;
    
    setCrop({
      unit: "px",
      width: cropSize,
      height: cropSize,
      x,
      y,
      aspect: 1
    });
    
    return false;
  };

  // Handle cropping completion
  const onCropComplete = (crop, percentageCrop) => {
    setCompletedCrop(crop);
    if (imgRef.current && crop.width && crop.height) {
      updatePreview(crop);
    }
  };

  // Update preview canvas with the cropped image
  const updatePreview = (crop) => {
    if (!imgRef.current || !previewCanvasRef.current || !crop.width || !crop.height) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = 150; // Fixed preview size
    canvas.height = 150;
    
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      150,
      150
    );
    
    canvas.toBlob(blob => {
      if (blob) {
        setPreview(URL.createObjectURL(blob));
      }
    });
  };

  // Convert cropped image to file
  const getCroppedImage = () => {
    if (!imgRef.current || !completedCrop) return null;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "profile-image.png", { type: "image/png" });
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/png");
    });
  };

  // Handle upload
  const handleUpload = async () => {
    setUploading(true);
    const croppedFile = await getCroppedImage();
    
    if (!croppedFile) {
      setUploading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("file", croppedFile); // Ensure this field name matches what your backend expects
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/updateProfilePicture", 
        formData,  // Pass formData directly
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data' // This is important for file uploads
          }
        }
      );
      console.log(response);
      
      if (response.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.imageUrl || preview);
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">Profile Picture</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {!imgSrc ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 cursor-pointer text-center transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <input {...getInputProps()} />
              <IoImage className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-600 font-medium">
                {isDragActive 
                  ? "Drop the image here" 
                  : "Drag & drop an image here, or click to select"
                }
              </p>
              <p className="mt-2 text-gray-500 text-sm">
                For best results, use an image at least 300x300 pixels
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Cropper */}
              <div className="flex-1 min-w-0">
                <div className="border rounded-lg overflow-hidden bg-gray-100">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={onCropComplete}
                    aspect={1}
                    circularCrop
                    ruleOfThirds
                  >
                    <img 
                      src={imgSrc} 
                      onLoad={onImageLoad} 
                      className="max-h-72 max-w-full object-contain mx-auto" 
                      alt="Upload" 
                    />
                  </ReactCrop>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Drag to reposition. Resize using the corners.
                </p>
              </div>
              
              {/* Preview */}
              <div className="w-full md:w-auto flex flex-col items-center">
                <div className="mb-3">
                  <h3 className="text-gray-700 font-medium text-center mb-2">Preview</h3>
                  <div className="relative">
                    <canvas 
                      ref={previewCanvasRef} 
                      className="hidden" 
                    />
                    {preview ? (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                        <img 
                          src={preview} 
                          className="w-full h-full object-cover" 
                          alt="Preview" 
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                        <IoImage className="text-gray-400" size={32} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => {
                setImgSrc(null);
                setPreview(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={!imgSrc || uploading}
            >
              Reset
            </button>
            
            <button
              onClick={handleUpload}
              disabled={!completedCrop || uploading}
              className={`px-5 py-2 rounded-md flex items-center gap-2 transition-all ${
                !completedCrop || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <IoCloudUpload size={20} />
                  <span>Upload Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;