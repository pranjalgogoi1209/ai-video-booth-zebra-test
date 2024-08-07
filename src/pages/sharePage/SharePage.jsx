import React, { useState, useEffect } from "react";
import styles from "./sharePage.module.css";
import { storagedb } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import Email from "../../components/email/Email";
import Loader from "../../components/loader/Loader";

export default function SharePage({ capturedVideo, gender }) {
  const [generatedVideo, setGeneratedVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState();
  const [showEmail, setShowEmail] = useState(false);
  const [filename, setFilename] = useState();

  console.log("video url =>", videoUrl);
  // console.log("filename =>", filename);
  // console.log("gender =>", gender);

  useEffect(() => {
    window.alert(generatedVideo);
  }, [generatedVideo]);

  const uploadVideo = async () => {
    try {
      let filename = v4() + ".webm";

      let videoRef = ref(storagedb, `ai_input_videos/${filename}`);
      console.log("videoRef =>", videoRef);
      await uploadBytes(videoRef, capturedVideo);
      const videoUrl = await getDownloadURL(videoRef);
      setGeneratedVideo(true);
      setVideoUrl(videoUrl);
      setFilename(filename);
    } catch (error) {
      console.log(error);
      setGeneratedVideo(false);
      // setGeneratedVideo(true);
    }
  };

  useEffect(() => {
    uploadVideo();
  }, []);

  return (
    <div className={`flex-col-center ${styles.SharePage}`}>
      {generatedVideo ? (
        <h1>THANK YOU</h1>
      ) : (
        <h1>
          GENERATING <br />
          YOUR VIDEO
        </h1>
      )}

      {generatedVideo ? (
        <div className={`flex-col-center ${styles.generatedVideoContainer}`}>
          <h1>
            PLEASE ENTER <br /> DETAILS
          </h1>
          <button onClick={() => setShowEmail(true)}>EMAIL</button>
        </div>
      ) : (
        <Loader />
      )}

      {/* email */}
      {showEmail && (
        <Email
          setShowEmail={setShowEmail}
          videoUrl={videoUrl}
          filename={filename}
          gender={gender}
        />
      )}
    </div>
  );
}
