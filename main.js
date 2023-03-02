// app ID
let APP_ID = '39facf61f9764699be6fe4787dd77b26';
// token for the channel
let token = null ;
// channel UID for each user in the channel
let uid = String (Math.floor(Math.random() * 10000));
// clent 
let client ;
// channel two users connect to the same channel
let channel;
// this will be the local stream get the cam and mic on ur computer   your
let localStream = null;
// this will be the remote stream get the cam and mic on remote users computer Userse
let remoteStream = null;
// this will be the peer connection
let peerConnection = null;

// servers for the peer connection
const servers = {
    iceServers: [
        {
            // get the stun server from google
            urls: ['stun:stun.l.1.google.com:19302','stun:stun.2.1.google.com:19302']
        }
    ]
}

// this function will be called when the page is loaded
let init = async () => {

    client = await AgoraRTM.createInstance(APP_ID)
    // uid need to be a string 
    await client.login({uid,token})

    channel = client.createChannel('main')
    await channel.join()

    channel.on('MemberJoined', handleuserJoined)

    client.on('MessageFromPeer', handleMessageFromPeer)

    localStream= await navigator.mediaDevices.getUserMedia({video:true,audio:false}); // requesrt the mic and cam
    // onece u had accsess to 
    document.getElementById("user-1").srcObject = localStream; // set the local video to the local stream

    

}

let handleMessageFromPeer = async (message,MemberId) => {
    console.log ('message from peer',message.text);
}

// this function will be called when the user join the channel
let handleuserJoined = async (MemberId) => {
    console.log('new user joined',MemberId);
    // create the offer
    createOffer(MemberId);
}


let createOffer = async (MemberId) => {
    // create the offer
    peerConnection = new RTCPeerConnection(servers);

    // add the remote stream to the peer connection
    remoteStream =  new MediaStream();
        // onece u had accsess to 
    document.getElementById("user-2").srcObject = remoteStream; // set the local video to the local stream




    // local track add to the peer connection loop over the local stream tracks
    localStream.getTracks().forEach((track )=> {
        peerConnection.addTrack(track,localStream);
    })

    // remote track add to the remote stream loop over the remote stream tracks
    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track); 
        });

    }

    //request the ice candidate by stun server
    peerConnection.onicecandidate = async (event) => {
        if(event.candidate){
            console.log('the new ICE candidate:',event.candidate);
        }
    }

    // create a offer 
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    client.sendMessageToPeer({text:"Heyy"},MemberId)

}


//  when you open the page it will call the init function
init();