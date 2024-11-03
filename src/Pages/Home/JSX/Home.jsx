import React, { useState, useRef, useEffect } from "react";
import GridCard from "./Grid";
import HeadContent from "./HeadContent";
import Footer from "../../../Common/Footer";
import '../CSS/Home.css';
import SubTitle from "./SubTitle";
import Menu from "../../../Common/Menu";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const homeRef = useRef(null);

  return (
    <div className="home" ref={homeRef}>
      <Menu />
      <HeadContent scrollContainerRef={homeRef} />
      <SubTitle searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <GridCard searchTerm={searchTerm} />
      <Footer />
    </div>
  );
};

export default Home;