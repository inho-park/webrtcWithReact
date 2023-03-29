import {useRef, useEffect, useState} from "react";
import io from "socket.io-client";
import './App.css';

const socket = io(
  // server 안에 있는 webRTCNamespace
  '/webRTCPeers', {
    // server 에 있는 io 변수의 path 와 일치
    path: "/webrtc"
  }
)

function App() {
  
  // 개인의 웹캠 화면
  const localVideoRef = useRef();
  // 상대방의 웹캠 화면
  const remoteVideoRef = useRef();

  // peer connection DOM
  const pc = useRef(new RTCPeerConnection(null));

  // sdp 통신을 담기 위한 textarea DOM
  const textRef = useRef();

  // ice candidate DOM
  // const candidates = useRef([]);
  const [offerVisible, setOfferVisible] = useState(true);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [status, setStatus] = useState("Make a call new");


  useEffect(() => {

    socket.on("connection-success", success => {
      console.log(success);
    });

    socket.on('sdp', data => {
      console.log(data);
      pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      textRef.current.value = JSON.stringify(data.sdp);

      if (data.sdp.type === 'offer' ) {
        setOfferVisible(false);
        setAnswerVisible(true);
        setStatus('Incoming call...............');
      } else {
        setStatus('Call established');
      }
    });

    socket.on('candidate', candidate => {
      console.log(candidate);
      // candidates.current = [...candidates.current, candidate];
      pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    const constraints = {
      audio: true,
      video: true
    };


    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        localVideoRef.current.srcObject = stream;

        // webcam 을 통해 stream 이 변화할 때마다 peer connection 에 추가
        stream.getTracks().forEach(track => {
          _pc.addTrack(track, stream);
        });
      }).catch(e => {
      console.log("getUserMedia Error : ", e);
    });

    // peer connection 변수 생성
    const _pc = new RTCPeerConnection(null);

    _pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log(JSON.stringify(e.candidate))
        sendToPeer('candidate', e.candidate);
      }
    };

    _pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    _pc.ontrack = (e) => {
      // we got remote stream...
      // 원격 스트림을 수신하지만 사용자 미디어를 가져올 때 로컬 트랙이나 스트림을 peer connection 에 추가하지 않음
      remoteVideoRef.current.srcObject = e.streams[0]
    }

    pc.current = _pc;
  }, []);

  const sendToPeer = (eventType, payload) => {
    socket.emit(eventType, payload);
  };

  const processSDP = (sdp) => {
    console.log(JSON.stringify(sdp));
    pc.current.setLocalDescription(sdp);

    sendToPeer('sdp', { sdp });
  }

  // offer 로 먼저 sdp 프로토콜 제안 보내기
  // offer 보낼 시 ICE ( interact connectivity establishment ) candidate 를
  // peer connection 에 추가할 때 사용가능
  const createOffer = () => {
    pc.current.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(sdp => {
      processSDP(sdp);
      setOfferVisible(false);
      setStatus('Calling............');
    }).catch( e => console.log("createOffer error : " + e))
  }

  // answer 로 sdp 프로토콜 제안 응답하기
  const createAnswer = () => {
    pc.current.createAnswer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(sdp => {
      processSDP(sdp);
      setAnswerVisible(false);
      setStatus('Call establish');
    }).catch( e => console.log("createOffer error : " + e))
  }


  // const setRemoteDescription = () => {
  //   // get the SDP value from the text editor
  //   const sdp = JSON.parse(textRef.current.value);
  //   console.log(sdp);
  //
  //   pc.current.setRemoteDescription(new RTCSessionDescription(sdp));
  // }

  // const addCandidate = () => {
  //   // const candidate = JSON.parse(textRef.current.value);
  //   // console.log("Adding Candidate : ", candidate);
  //
  //   candidates.current.forEach(candidate => {
  //     console.log(candidate);
  //     pc.current.addIceCandidate(new RTCIceCandidate(candidate));
  //   });
  // }

  const showHideButtons = () => {
    if (offerVisible) {
      return (
        <div>
          <button onClick={createOffer}>Call</button>
        </div>
      )
    } else if (answerVisible) { return (
        <div>
          <button onClick={createAnswer}>Answer</button>
        </div>
      )
    }
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
      {/*<button onClick={createOffer}>*/}
      {/*  Create Offer*/}
      {/*</button>*/}
      {/*<button onClick={createAnswer}>*/}
      {/*  Create Answer*/}
      {/*</button>*/}

      { showHideButtons() }
      <div>{ status }</div>
      <textarea ref={textRef}>

      </textarea>

    </div>
  );
}

export default App;
