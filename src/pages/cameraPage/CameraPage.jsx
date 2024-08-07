import React, { useState, useRef } from "react";
import styles from "./cameraPage.module.css";
import { useNavigate, Link } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";
import logo from "./../../assets/header/logo.png";

export default function CameraPage({ setCapturedVideo }) {
  // const webRef = useRef();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // previewUrl && console.log(previewUrl);
  // videoBlob && console.log(videoBlob);

  const videoConstraints = {
    width: 720,
    height: 405,
    facingMode: "user",
  };

  var constraints = {
    audio: false,
    video: {
      width: { min: 720, max: 720 },
      height: { min: 405, max: 405 },
    },
  };

  const options = {
    videoBitsPerSecond: 2500000,
    mimeType: "video/webm; codecs=vp9",
  };

  let mediaRecorder;
  const chunks = [];

  // stop recording
  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      setVideoBlob(blob);
      setPreviewUrl(url);
    };
  };

  // handle start recording
  const handleStartRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.start();
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        setTimeout(() => {
          stopRecording();
        }, 4000);
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err);
      });
  };

  // handle retake
  const handleRetake = () => {
    setPreviewUrl(null);
    setVideoBlob(null);
  };

  // toast options
  const toastOptions = {
    position: "top-left",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  // handle submit
  const handleSubmit = () => {
    // console.log("captured video submitting");
    if (videoBlob) {
      setCapturedVideo(videoBlob);
      navigate("/share");
    } else {
      toast.error("Please capture your video", toastOptions);
    }
  };

  const onVideoLoad = (e) => {
    let video = e.target;
    if (video.videoWidth > video.videoHeight) {
      // navigate("/");
      window.alert("Change your camera");
    }
  };

  return (
    <div className={`flex-col-center ${styles.CameraPage}`}>
      <h1>{previewUrl ? "DO YOU LIKE THIS" : "READY TO RECORD"}</h1>

      <main className={`flex-row-center ${styles.main}`}>
        <div className={`flex-row-center ${styles.webcamParent}`}>
          {!previewUrl && (
            <Webcam
              onResize={onVideoLoad}
              id={styles.webcam}
              forceScreenshotSourceSize={true}
              videoConstraints={videoConstraints}
              mirrored={true}
            />
          )}
          {previewUrl && (
            <video
              controls
              autoPlay
              className={styles.capturedVideo}
              onError={(e) => console.error("Video playback error:", e)}
            >
              <source src={previewUrl} type="video/mp4" />
            </video>
          )}
        </div>
      </main>

      <footer className={`flex-row-center ${styles.footer}`}>
        {!previewUrl && (
          <button onClick={handleStartRecording} className={styles.captureBtn}>
            {isRecording ? (
              <ScaleLoader
                color={"#fff"}
                loading={isRecording}
                height={22}
                width={6}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "CAPTURE"
            )}
          </button>
        )}
        {!isRecording && previewUrl && (
          <div className={`flex-row-center ${styles.btnsContainer}`}>
            <button onClick={handleSubmit} className={styles.captureBtn2}>
              SUBMIT
            </button>
            <button onClick={handleRetake} className={styles.captureBtn2}>
              RETAKE
            </button>
          </div>
        )}
      </footer>

      {/* logo */}
      <Link to={"/"} className={styles.logoContainer}>
        <img src={logo} alt="logo" />
      </Link>
    </div>
  );
}
