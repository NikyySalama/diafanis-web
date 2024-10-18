import React, { useState } from "react";
import GridCard from "./Grid";
import HeadContent from "./HeadContent";
import Footer from "../../../Common/Footer";
import '../CSS/Home.css';
import SubTitle from "./SubTitle";
import Menu from "../../../Common/Menu";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="home">
      <Menu />
      <HeadContent />
      <SubTitle searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <GridCard searchTerm={searchTerm} />
      <Footer />
    </div>
  );
};

export default Home;