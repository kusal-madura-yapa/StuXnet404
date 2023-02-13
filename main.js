//  get the accsess for mic and cam 

// this will be the local stream get the cam and mic on ur computer 
let localStream = null;
// this will be the remote stream get the cam and mic on remote users computer
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

    localStream= await navigator.mediaDevices.getUserMedia({video:true,audio:false}); // requesrt the mic and cam
    // onece u had accsess to 
    document.getElementById("user-1").srcObject = localStream; // set the local video to the local stream

    // create the offer
    createOffer();

}

let createOffer = async () => {
    // create the offer
    peerConnection = new RTCPeerConnection();

    // add the remote stream to the peer connection
    remoteStream=new MediaStream();
        // onece u had accsess to 
    document.getElementById("user-2").srcObject = remoteStream; // set the local video to the local stream



    // local track add to the peer connection loop over the local stream tracks

    localStream.getTracks().forEach((track )=> {
        peerConnection.addTrack(track,localStream);
    });


    // remote track add to the remote stream loop over the remote stream tracks

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track); 
        });

    }


    // add the local stream to the peer connection
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log('offer:',offer);
}


//  when you open the page it will call the init function
init();