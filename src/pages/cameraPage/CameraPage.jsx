import React, { useState, useRef } from "react";
import styles from "./cameraPage.module.css";
import { useNavigate, Link } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";
import logo from "./../../assets/header/logo.png";

export default function CameraPage({ setCapturedVideo }) {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Video constraints with basic configuration to support Safari
  const videoConstraints = {
    width: 720,
    height: 405,
    facingMode: "user",
  };

  const constraints = {
    audio: false,
    video: true,
  };

  // Simplified options to avoid Safari compatibility issues
  const options = {
    mimeType: "video/webm;codecs=vp9", // Use a more broadly supported format
  };

  // Stop recording and save the video
  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      setVideoBlob(blob);
      setPreviewUrl(url);
      chunksRef.current = []; // Clear the chunks for future recordings
    };
  };

  // Handle start recording
  const handleStartRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream, options);

        // Event listeners for debugging
        mediaRecorderRef.current.onstart = () => {
          console.log("Recording started");
        };

        mediaRecorderRef.current.onpause = () => {
          console.log("Recording paused");
        };

        mediaRecorderRef.current.onerror = (event) => {
          console.error("Recording error:", event.error);
          toast.error("Recording error occurred", toastOptions);
        };

        mediaRecorderRef.current.start();
        mediaRecorderRef.current.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        setTimeout(() => {
          stopRecording();
        }, 5000); // Increased timeout from 4000ms to 5000ms
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err);
        toast.error(
          "Failed to access webcam. Please check your camera permissions.",
          toastOptions
        );
      });
  };

  // Handle retake
  const handleRetake = () => {
    setPreviewUrl(null);
    setVideoBlob(null);
  };

  // Toast options
  const toastOptions = {
    position: "top-left",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  // Handle submit
  const handleSubmit = () => {
    if (videoBlob) {
      setCapturedVideo(videoBlob);
      navigate("/share");
    } else {
      toast.error("Please capture your video", toastOptions);
    }
  };

  // Handle video load to check orientation (optional, can customize as needed)
  const onVideoLoad = (e) => {
    let video = e.target;
    if (video.videoWidth > video.videoHeight) {
      window.alert("Change your camera orientation");
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
              <source src={previewUrl} type="video/webm" />
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

      <ToastContainer />
    </div>
  );
}
