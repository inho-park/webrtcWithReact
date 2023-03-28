import { useRef, useEffect } from "react";
import './App.css';

function App() {
  
  // 개인의 웹캠 화면
  const localVideoRef = useRef();
  // 상대방의 웹캠 화면
  const remoteVideoRef = useRef();

  useEffect(() => {
    const constraints = {
      audio: true,
      video: true
    };


    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        localVideoRef.current.srcObject = stream;
      }).catch(e => {
      console.log("getUserMedia Error : ", e);
    });
  }, []);

  const getUserMedia = () => {
    // const constraints = {
    //   audio: true,
    //   video: true
    // };
    //
    //
    // navigator.mediaDevices.getUserMedia(constraints)
    //   .then(stream => {
    //     localVideoRef.current.srcObject = stream;
    //   }).catch(e => {
    //     console.log("getUserMedia Error : ", e);
    //   });
  };

  return (
    <div style={{ margin: 10 }}>
      <video ref={localVideoRef} autoPlay style={{
          width: 640,
          height: 480,
          margin: 5,
          backgroundColor: "black"
      }}></video>
      <video ref={remoteVideoRef} autoPlay style={{
        width: 640,
        height: 480,
        margin: 5,
        backgroundColor: "black"
      }}></video>

      <br/>
      <button onClick={() => {

      }}>Create Offer</button>
      <button onClick={() => {

      }}>Create Answer</button>
      <br/>
      <button onClick={() => {

      }}>Set Remote Description</button>
      <button onClick={() => {

      }}>Add Candidate</button>

    </div>
  );
}

export default App;
