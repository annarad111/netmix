"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import MovieList from "./components/MovieList/MovieList";
import Navbar from "./components/Navbar/Navbar";
import coverImage from "@/assets/images/from2.jpg";
import Footer from "./components/Footer/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <Image
        src={coverImage}
        alt="Logo"
        width={1200}
        height={800}
        className={styles.background}
      />
      <div>
        <p className={styles.text_appear}>Watch the best movies</p>
        <p className={styles.text_appear2}>Browse our list <span>below</span></p>
      </div>
      <Navbar />
      <MovieList />
      <Footer />
    </div>
  );
}
