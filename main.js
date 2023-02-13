//  get the accsess for mic and cam 

// this will be the local stream get the cam and mic on ur computer 
let localStream = null;
// this will be the remote stream get the cam and mic on remote users computer
let remoteStream = null;

let init = async () => {

    localStream= await navigator.mediaDevices.getUserMedia({video:true,audio:false}); // requesrt the mic and cam
    // onece u had accsess to 
    document.getElementById("user-1").srcObject = localStream; // set the local video to the local stream


}


//  when you open the page it will call the init function
init();