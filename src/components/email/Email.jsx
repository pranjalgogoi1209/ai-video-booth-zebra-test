import React, { useState, CSSProperties } from "react";
import styles from "./email.module.css";

import ScaleLoader from "react-spinners/ScaleLoader";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import close from "./../../assets/close.svg";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function Email({ setShowEmail, videoUrl, filename, gender }) {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  let [loading, setLoading] = useState(false);

  // toast options
  const toastOptions = {
    position: "top-left",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  // console.log(filename, videoUrl, gender, userEmail);

  // send email to firebase
  const sendEmail = async () => {
    // timestamp
    const timestamp = Date.now();

    const valueRef = collection(db, "inputVideos");
    const result = await addDoc(valueRef, {
      filename: filename,
      url: videoUrl,
      gender: gender,
      whatsappNumber: "",
      timestamp: timestamp,
      email: userEmail,
    });
  };

  // handle submit
  const handleSubmit = () => {
    if (!loading) {
      if (userEmail) {
        setLoading(true);
        sendEmail();
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 3000);
        toast.success("Email has sent successfully", toastOptions);
      } else {
        toast.error("Please enter a correct email", toastOptions);
      }
    } else {
      toast.error("Please wait...", toastOptions);
    }
  };

  return (
    <div
      className={`flex-row-center ${styles.Email}`}
      onClick={() => setShowEmail(false)}
    >
      <div
        className={`flex-col-center ${styles.container}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <input
          type="mail"
          value={userEmail}
          placeholder="Enter your email"
          onChange={(e) => setUserEmail(e.target.value)}
          className={styles.input}
        />

        <button onClick={handleSubmit}>
          {loading ? (
            <ScaleLoader
              color={"#fff"}
              loading={loading}
              height={22}
              width={6}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            "SUBMIT"
          )}
        </button>

        <div className={styles.close} onClick={() => setShowEmail(false)}>
          <img src={close} alt="close" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
