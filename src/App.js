// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// Import required model
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
// Import drawing utility here
import { drawRect } from "./utilities";
// Import MySQL database
// import mysql from 'mysql';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {

    // Load network 
    const net = await cocossd.load();
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

    // // Set up a connection to SQL database
    // const connection = mysql.createConnection({
    //   host: 'sql12.freesqldatabase.com',
    //   user: 'sql12608604',
    //   password: '1Tt7YNMEKZ',
    //   database: 'sql12608604'
    // });
    // // Connect to SQL database
    // connection.connect();
  
    // // retrieve all the records from a table called 'participants'
    // connection.query('SELECT * FROM participants', (error, results) => {
    //   if (error) throw error;
    //   console.log(results);
    // });

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);
      console.log(obj);

      // Filter objects to only keep "car"
      const Mobilephone = obj.filter((o) => o.class === "cell phone");

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // Update drawing utility
      drawRect(Mobilephone, ctx); 

      // Check if "cell phone" is in the detected objects
      const hasCell_phone = obj.some((obj) => obj.class === "cell phone");
      if (hasCell_phone) {
        // Show notification when "Mobile phone" is detected
        if (Notification.permission === "granted") {
          new Notification("Mobile Phone Detected", {
            body: "A Mobile Phone has been detected on camera.",
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Mobile Phone Detected", {
                body: "A Mobile Phone has been detected on camera.",
              });
            }
          });
        }
      }
    }
  };

  // // Close the connection to the database
  // connection.end();

  useEffect(()=>{runCoco()},[]);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 450,
            height: 300,
          }}
        />
      </header>
    </div>
  );
}

export default App;
