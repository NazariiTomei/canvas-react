// ImageEditor.js
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Slider, Button } from "@mui/material";
import { FiRotateCw, FiRotateCcw } from "react-icons/fi";
import getCroppedImg from "./cropImage";

const ImageEditor = ({ imageSrc }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleRotation = (angle) => {
    setRotation((prev) => prev + angle);
  };

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      console.log("Cropped Image:", croppedImage);
      // You can now use the cropped image as needed
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="crop-container">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, zoom) => setZoom(zoom)}
        />
        <Button onClick={() => handleRotation(90)}>
          <FiRotateCw />
        </Button>
        <Button onClick={() => handleRotation(-90)}>
          <FiRotateCcw />
        </Button>
        <Button onClick={handleCrop}>Crop</Button>
      </div>
    </div>
  );
};

export default ImageEditor;
