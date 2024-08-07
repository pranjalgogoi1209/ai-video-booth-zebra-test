import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/header/Header";
import { HomePage, CameraPage, SharePage, GenderPage } from "./pages";

export default function App() {
  const [capturedVideo, setCapturedVideo] = useState();
  const [gender, setGender] = useState();

  return (
    <BrowserRouter>
      {/* header */}
      <Header />

      <Routes>
        {/* home page */}
        <Route path="/" element={<HomePage />} />

        {/* gender page */}
        <Route path="/gender" element={<GenderPage setGender={setGender} />} />

        {/* camera page */}
        <Route
          path="/camera"
          element={<CameraPage setCapturedVideo={setCapturedVideo} />}
        />

        {/* share page */}
        <Route
          path="/share"
          element={<SharePage capturedVideo={capturedVideo} gender={gender} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
