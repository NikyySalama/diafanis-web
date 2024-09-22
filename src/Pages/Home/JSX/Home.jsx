import React from "react";
import GridCard from "./Grid";
import HeadContent from "./HeadContent";
import Footer from "../../../Common/Footer";
import '../CSS/Home.css'
import SubTitle from "./SubTitle";
import Menu from "../../../Common/Menu";
import { makeStyles } from '@mui/styles';

const Home = () => {
    return (
    <div className="home">
        <Menu/>
       <HeadContent/>
       <SubTitle/>
       <GridCard/>
       <Footer/>
    </div>
    );
  };

export default Home