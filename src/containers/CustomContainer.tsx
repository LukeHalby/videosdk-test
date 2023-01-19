'use client';

import React from 'react';
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant
} from '@videosdk.live/react-sdk'
import ReactPlayer from 'react-player'
import {
  createMeeting, getToken
} from '../utils/custom'

type tJoinScreen = {
  getMeetingAndToken: (roomId: string) => void
}

type tContainer = {
  meetingId: string
}

type tVideoComponent = {
  participantId: string
}

type tControls = {
  setJoined: React.Dispatch<React.SetStateAction<boolean>>
}

function JoinScreen({ getMeetingAndToken }: tJoinScreen) {
  const [meetingId, setMeetingId] = React.useState<string>('');
  const onClick = async () => {
    await getMeetingAndToken(meetingId);
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={onClick}>Join</button>
      {" or "}
      <button onClick={onClick}>Create Meeting</button>
    </div>
  );
}

function VideoComponent({ participantId }: tVideoComponent) {
  const micRef = React.useRef<HTMLAudioElement>(null);
  const {
    webcamStream,
    micStream,
    screenShareStream,
    webcamOn,
    micOn,
    screenShareOn,
    isLocal
  } = useParticipant(participantId);

  const videoStream = React.useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      //@ts-ignore
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  const screenVideoStream = React.useMemo(() => {
    if (screenShareOn && screenShareStream) {
      const mediaStream = new MediaStream()
      //@ts-ignore
      mediaStream.addTrack(screenShareStream.track);
      return mediaStream;
    }
  }, [screenShareStream, screenShareOn])

  React.useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        console.log(micStream)
        //@ts-ignore
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("audioElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div key={participantId}>
      {micOn && micRef && <audio ref={micRef} autoPlay muted={isLocal} />}
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // very very imp prop
          playIcon={<></>}
          //
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          //height={"100px"}
          //width={"100px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
      {screenShareOn && (
        <ReactPlayer
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={true}
          muted={true}
          playing={true}
          //
          url={screenVideoStream}
          //
          //height={"100px"}
          //width={"100px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function Controls({ setJoined }: tControls) {
  const { 
    leave,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    localMicOn,
    localWebcamOn,
    localScreenShareOn
  } = useMeeting();
  return (
    <div>
      <button onClick={() => {leave(); setJoined(false);}}>Leave</button>
      <button onClick={() => toggleMic()} style={{ color: localMicOn ? 'green' : 'red' }}>Toggle Mic</button>
      <button onClick={() => toggleWebcam()} style={{ color: localWebcamOn ? 'green' : 'red' }}>Toggle Webcam</button>
      <button onClick={() => toggleScreenShare()} style={{ color: localScreenShareOn ? 'green' : 'red' }}>Toggle ScreenShare</button>
    </div>
  );
}

function Container({ meetingId }: tContainer) {
    const [joined, setJoined] = React.useState(false);
    const { join } = useMeeting();
    const { participants } = useMeeting();
    const joinMeeting = () => {
      setJoined(true);
      join();
    };
  
    return (
      <div className="container">
        <h3>Meeting Id: {meetingId}</h3>
        {joined ? (
          <div>
            <Controls setJoined={setJoined} />
            {[...participants.keys()].map((participantId) => (
              <VideoComponent 
                key={participantId}
                participantId={participantId}
              />
            ))}
          </div>
        ) : (
          <button onClick={joinMeeting}>Join</button>
        )}
      </div>
    );
  }

export default function PlaygroundVideoSdk() {
  const [authToken, setAuthToken] = React.useState<string>('');
  const [meetingId, setMeetingId] = React.useState<string>('');

  React.useEffect(() => {
    async function createToken() {
      const token = await getToken()
      console.log(token)
      setAuthToken(token)
    }
    
    createToken()
  }, [])

  const getMeetingAndToken = async (roomId: string) => {
    const meetingId =
      !roomId ? await createMeeting(authToken) : roomId;
    setMeetingId(meetingId);
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: false,
        name: "Anonymous",
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => <Container meetingId={meetingId} />}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}