import { useRef, useEffect } from "react";
import './App.css';

function App() {
  
  // 개인의 웹캠 화면
  const localVideoRef = useRef();
  // 상대방의 웹캠 화면
  const remoteVideoRef = useRef();

  //
  const pc = useRef(new RTCPeerConnection(null));


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

    // peer connection 변수 생성
    const _pc = new RTCPeerConnection(null);
    _pc.onicecandidate = (e) => {
      if (e.candidate) console.log(JSON.stringify(e.candidate));
    }

    _pc.oniceconnectionstatechange = (e) => {
      console.log(e)
    }

    _pc.ontrack = (e) => {
      // we got remote stream...

    }

    pc.current = _pc;
  }, []);

  // offer 로 먼저 sdp 프로토콜 제안 보내기
  // offer 보낼 시 ICE ( interact connectivity establishment ) candidate 를
  // peer connection 에 추가할 때 사용가능
  const createOffer = () => {
    pc.current.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(sdp => {
      console.log(JSON.stringify(sdp));
      pc.current.setLocalDescription(sdp);
    }).catch( e => console.log("createOffer error : " + e))
  }

  // answer 로 sdp 프로토콜 제안 응답하기
  const createAnswer = () => {
    pc.current.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(sdp => {
      console.log(JSON.stringify(sdp));
      pc.current.setLocalDescription(sdp);
    }).catch( e => console.log("createOffer error : " + e))
  }

  const setRemoteDescription = () => {

  }

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
        backgroundColor: "gray"
      }}></video>

      <br/>
      <button onClick={createOffer}>
        Create Offer
      </button>
      <button onClick={createAnswer}>
        Create Answer
      </button>
<br/>
      <button onClick={createOffer}>
        Set Remote Description
      </button>
      <button onClick={createOffer}>
        Add Candidates
      </button>


    </div>
  );
}

export default App;
