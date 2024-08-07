import React from "react";
import styles from "./header.module.css";
import { Link, useLocation } from "react-router-dom";

import logo from "./../../assets/header/logo.png";

export default function Header() {
  const location = useLocation();

  // console.log(location.pathname);

  return location.pathname === "/camera" ? (
    ""
  ) : (
    <div className={`flex-row-center ${styles.Header}`}>
      <Link to={"/"} className={styles.logoContainer}>
        <img src={logo} alt="logo" />
      </Link>
    </div>
  );
}
