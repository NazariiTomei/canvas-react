import React, { useState, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "react-image-crop/dist/ReactCrop.css";
import "react-medium-image-zoom/dist/styles.css";
import { canvasPreview } from "./canvasPreview";
import useDebounceEffect from "./useDebounceEffect";
import { Grid, Button } from "@mui/material";
import { Start } from "@mui/icons-material";

const ImageEditor = ({ ImgSrc, setEditing }) => {
  const [imgSrc, setImgSrc] = useState(ImgSrc);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(16 / 9);
  const dimensions = useRef([0, 0]);
  const [selectedFilter, setSelectedFilter] = useState("");

  const handleChange = (event) => {
    setSelectedFilter(event.target.value);
  };
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(null);
      const reader = new FileReader();
      reader.onload = () => setImgSrc(reader.result.toString());
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e) => {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    dimensions.current = [width, height];
  };

  useDebounceEffect(
    () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  return (
    <div className="App">
      <div>
        <div>
          <label htmlFor="scale-input">Scale: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          />
        </div>
        <div>
          <button
            onClick={() => {
              const [width, height] = dimensions.current;
              setCrop({
                unit: "%",
                width: 100,
                height: 100,
                x: 0,
                y: 0,
              });
              setAspect(1 / 1);
            }}
          >
            Change to 1 / 1
          </button>
          <button
            onClick={() => {
              const [width, height] = dimensions.current;
              setCrop({
                unit: "%",
                width: 50,
                height: 50,
                x: 0,
                y: 0,
              });
              setAspect(16 / 9);
            }}
          >
            Change to 16 / 9
          </button>
          <button
            onClick={() => {
              setCrop({
                unit: "px",
                x: 0,
                y: 0,
                width: 100,
                height: 100,
              });
              setAspect(0);
            }}
          >
            Change to no aspect
          </button>
        </div>
        <div>
          <label htmlFor="colorFilterComboBox">Choose a color filter:</label>
          <select
            id="colorFilterComboBox"
            value={selectedFilter}
            onChange={handleChange}
          >
            <option value="">--Please choose a filter--</option>
            <option value="grayscale(100%)">Grayscale</option>
            <option value="sepia(100%)">Sepia</option>
            <option value="blur(5px)">Blur</option>
            <option value="brightness(150%)">Brightness</option>
            <option value="contrast(200%)">Contrast</option>
            <option value="hue-rotate(90deg)">Hue Rotate</option>
            <option value="invert(100%)">Invert</option>
            <option value="saturate(200%)">Saturate</option>
          </select>
        </div>
      </div>

      {imgSrc && (
        <ReactCrop
          src={imgSrc}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={(newCompletedCrop) => setCompletedCrop(newCompletedCrop)}
          aspect={aspect}
          keepSelection
          className="disable-image-drag"
          style={{
            filter: selectedFilter,
          }}
        >
          <TransformWrapper>
            <TransformComponent>
              <img
                alt="Crop me"
                src={imgSrc}
                style={{ transform: `rotate(${rotate}deg)`, height: "500px"}}
                onLoad={onImageLoad}
              />
            </TransformComponent>
          </TransformWrapper>
        </ReactCrop>
      )}
      <span>
        <canvas
          ref={previewCanvasRef}
          style={{
            border: "1px solid black",
            objectFit: "contain",
            width: completedCrop?.width || 0,
            height: completedCrop?.height || 0,
            filter: selectedFilter,
          }}
        />
      </span>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button variant="container" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="container" onClick={() => setEditing(false)}>
              DONE
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ImageEditor;
