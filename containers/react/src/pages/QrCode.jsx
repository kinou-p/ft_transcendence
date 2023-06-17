import React, { useEffect, useRef, useState } from "react";
import "../styles/App.css";
import QRCodeStyling from "qr-code-styling";
import { motion } from 'framer-motion'
import api from '../script/axiosApi';


const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    // image: "../assets/profile.jpg",
    dotsOptions: {
        color: "black",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#5843e4",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
    }
    });

function QrCode () {
    const url = "https://www.youtube.com";
    const ref = useRef(null);

    useEffect(() => {
        qrCode.append(ref.current);
    }, []);

    useEffect(() => {
        qrCode.update({
        data: url
        });
    }, [url]);

    const getConv = async ()=>{
        try{
            const convs = await api.get("/user")
            // const tmpUser = await api.get("/profile")
            console.log("test")
            console.table(convs);
        }
        catch(err){
            console.log(err);
        }
    };
    getConv();
    return (
		<motion.div className="page"
		initial={{opacity: -1}}
		animate={{opacity: 1}}
		exit={{opacity: -1}}>
            <h1>QrCode</h1>
            <h3>Your code is: 231 31 31</h3>
            <div ref={ref} />
            <input type="text" className="qr" placeholder="type the secret"/>
            {}

		</motion.div>
    )
}

export default QrCode