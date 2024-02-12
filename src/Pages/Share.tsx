import {
  TbAspectRatioOff,
  TbAspectRatio,
  TbZoomInFilled,
  TbZoomOutFilled,
} from "react-icons/tb";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";

import React, { useState, useRef } from "react";
import post from "/Post.jpg";
import "./Share.css";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { canvasPreview } from "../Components/Share/canvasPreview";
import { useDebounceEffect } from "../Components/Share/useDebounceEffect";

import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function App() {
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [nameI, setIName] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(9 / 9);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onDownloadPosterClick() {
    const image = imgRef.current;
    var previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    const offscreen = new OffscreenCanvas(1080, 1080);
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }
    var base_image = new Image();
    base_image.src = post;

    // base_image.onload = function (){
    //   console.log(base_image)
    // }
    ctx.drawImage(base_image, 0, 0, 1080, 1080);
    ctx.font = "34px montserrat";
    ctx.textAlign = "center";
    var textWidth = ctx.measureText(name).width;
    const leftI = (418.6 / textWidth / 2) * textWidth + 425;
    ctx.fillText(name.toUpperCase(), leftI, 620, 300);
    ctx.beginPath();
    const radius = 330 / 2;
    const centerX = 130.5 + radius;
    const centerY = 440 + radius;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(previewCanvas, 130.5, 440, 330, 330);
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);

    if (hiddenAnchorRef.current) {
      hiddenAnchorRef.current.href = blobUrlRef.current;
      hiddenAnchorRef.current.click();
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
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

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(9 / 9);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 9 / 9);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  return (
    <div className="z-1 flex flex-col items-center  p-5   overflow-hidden min-h-[60vh] md:min-h-[70vh]">
      <h1 className="text-2xl md:text-4xl font-bold text-[#713687] border-[1px] border-[#713687] px-4 py-2 rounded-xl ">
        Create Your Own Post
      </h1>
      {!!imgSrc && (
        <div className={done ? "" : ""}>
          <div className="flex items-center justify-between">
            <a href="/share" className="">
              <div className="flex items-center">
                <FaHome className="text-xl m-4" />
                Home
              </div>
            </a>
            {!done ? (
              <button
                onClick={() => {
                  completedCrop ? setDone(true) : "";
                }}
                className="bg-blue-500 h-fit text-white px-4 py-1 rounded-xl hover:bg-[#713687]"
              >
                Done
              </button>
            ) : (
              <p>Scroll Down</p>
            )}
          </div>

          {done ? (
            <ReactCrop
              disabled
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minHeight={50}
              circularCrop
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                className="max-w-[300px] h-auto md:w-[600px]"
                onLoad={onImageLoad}
              />
            </ReactCrop>
          ) : (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minHeight={50}
              circularCrop
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                className="max-w-[300px] h-auto md:w-[600px]"
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </div>
      )}

      <div className={done ? "hidden m-3" : "m-3"}>
        {!imgSrc && (
          <div className="flex flex-col items-center justify-center gap-4 inputLelo my-10">
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src="/Example.png"
                className="w-[300px] border-[1px]"
                alt=""
              />
              <div className="flex flex-col items-center">
                <h1 className="uppercase text-center text-xl font-bold text-[#713687] pb-5">
                  Be a part of walk of hope
                </h1>
                <p className="text-sm text-gray-500 text-justify">
                  Create your own poster just by a click of button
                </p>
                <img
                  src="/help.jpg"
                  className="w-[300px] border-[2px] rounded opacity-45"
                  alt=""
                />
                <p className="my-4 text-center text-[#713687]">
                  Be a part of Event. Register Now!
                </p>
                <button className="bg-blue-500 py-1 px-4 rounded-xl text-white hover:bg-blue-700">
                  <a href="/">Register Now</a>
                </button>
              </div>
            </div>
            <div className=" flex flex-col items-center justify-center gap-4 inputLelo bg-gray-200 px-9 py-2 rounded-xl">
              <p className="text-lg text-black uppercase font-bold">
                Upload your Image
              </p>
              <label className="bg-[#713687] p-4 rounded-[50%]" htmlFor="file">
                <LuImagePlus className="text-4xl text-white" />
              </label>
              <input
                id="file"
                className=""
                type="file"
                accept="image/*"
                onChange={onSelectFile}
              />
            </div>
          </div>
        )}
        {imgSrc && (
          <div className="flex justify-center gap-10 py-3 px-5 bg-gray-200 rounded-xl">
            <div className="flex text-2xl gap-10">
              <TbZoomInFilled
                onClick={() => (scale > 10 ? "" : setScale(scale + 0.5))}
              />
              <TbZoomOutFilled
                onClick={() => (scale > 0.5 ? setScale(scale - 0.5) : "")}
              />
            </div>
            <div className="flex text-2xl gap-10">
              <FaArrowRotateRight onClick={() => setRotate(rotate + 5)} />
              <FaArrowRotateLeft onClick={() => setRotate(rotate - 5)} />
            </div>
            <div>
              <button onClick={handleToggleAspectClick}>
                {aspect ? (
                  <TbAspectRatioOff className="text-2xl" />
                ) : (
                  <TbAspectRatio className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {!!completedCrop && (
        <div className={!done ? "hidden" : "z-3"}>
          <div className="relative w-[300px] mt-5">
            <img src={post} className="" alt="" />
            {name && (
              <div className="absolute flex items-center justify-center  w-[116.2778px] h-[24.722px] top-[155.1667px] left-[118.0556px]">
                <p className=" uppercase font-bold text-[12px] ">{name}</p>
              </div>
            )}
            <div className="absolute max-w-[91.2778px] max-h-[91.2778px] top-[121.9167px] left-[36.8889px]">
              <canvas
                ref={previewCanvasRef}
                className="rounded-[50%] w-full h-full"
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
          {!name && (
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="w-full my-4 py-2 px-4 border-[1px] rounded focus:outline-none"
                onChange={(e) => {
                  setIName(e.target.value);
                }}
                placeholder="Enter Name"
              />{" "}
              <button
                onClick={() => {
                  setName(nameI);
                }}
                className="bg-blue-500 h-fit py-2 px-4 rounded-xl text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          )}
          {name && (
            <div>
              <button
                onClick={onDownloadPosterClick}
                className="bg-blue-500 text-white py-2 px-4 rounded-xl m-2"
              >
                Download Image
              </button>
              <a
                href="#hidden"
                ref={hiddenAnchorRef}
                download
                style={{
                  position: "absolute",
                  top: "-200vh",
                  visibility: "hidden",
                }}
              >
                Hidden download
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
