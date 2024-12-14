import React, { useState, useRef, useEffect } from "react";
import GridCard from "./Grid";
import HeadContent from "./HeadContent";
import Footer from "../../../Common/Footer";
import '../CSS/Home.css';
import SubTitle from "./SubTitle";
import Menu from "../../../Common/Menu";
import { Box } from "@mui/material";
const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const homeRef = useRef(null);

  return (
    <div className="home" ref={homeRef} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: '1 0 auto' }}>
        <Menu />
        <HeadContent scrollContainerRef={homeRef} />
        <SubTitle searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <GridCard searchTerm={searchTerm} />
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        <Footer />
      </Box>
    </div>
  );
};

export default Home;