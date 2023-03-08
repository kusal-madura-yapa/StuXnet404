
const appID = "37877121b8104564b0776cafab7cc6f5"

let UID = sessionStorage.getItem('UID');
if (!UID) {
    UID = Math.floor(Math.random() * 100000);
    sessionStorage.setItem('UID', UID);
}
let token = null;
let client = null;

const queryStrings= window.location.search;
const urlParams = new URLSearchParams(queryStrings);
let roomID = urlParams.get('roomID');

if (!roomID) {
    roomID = 'main';
}


// get video and audio tracks in to array to be used later
const localTracks = [];
// get remote yusers video and audio tracks in to object  to be used later
const remoteTracks = {};
