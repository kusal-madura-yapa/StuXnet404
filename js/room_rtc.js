


// give specific user a unique id
let uid = sessionStorage.getItem('uid')
// pass the uid to the signaling server
if(!uid){
    // get the uid from the server randomize
    uid = String(Math.floor(Math.random() * 10000))
    sessionStorage.setItem('uid', uid)
}

// token for the signaling server
let token = null;
// create a clent for the Agora SDK
let client;

// create a client for the Agora RTM SDK
let rtmClient;
// create the channel for the RTM SDK
let channel;


// app ID for the signallig server
const app_ID = "39facf61f9764699be6fe4787dd77b26"

// get the room id from the url
const queryString = window.location.search
// get the room id from the url as a string
const urlParams = new URLSearchParams(queryString)
// give a room id if there is none
let roomId = urlParams.get('room')

// if there is no room id, set the room id to main
if(!roomId){
    roomId = 'main'
}

// get the display name from the session storage
let displayName = sessionStorage.getItem('display_name')
// if there is no display name, redirect to the lobby
if(!displayName){
    // redirect to the lobby
    window.location = 'lobby.html'
}
// local vedio stream trackin sotre in a array
let localTracks = []
// remote video stream track as a object 
let remoteUsers = {}


// get the display frame when screean shaere is active
let localScreenTracks;
// give the out  the display frame when screean shaere is active
let sharingScreen = false;


// whren usere join the room the funtion must be run 
let joinRoomInit = async () => {
    // get the token from the server
    rtmClient = await AgoraRTM.createInstance(app_ID)
    await rtmClient.login({uid,token})

    // add the user to the room
    await rtmClient.addOrUpdateLocalUserAttributes({'name':displayName})

    // create the channel
    channel = await rtmClient.createChannel(roomId)
    // join the channel AND ROOM   IMPORTANT
    await channel.join()

    // add the event listners
    channel.on('MemberJoined', handleMemberJoined)
    channel.on('MemberLeft', handleMemberLeft)
    channel.on('ChannelMessage', handleChannelMessage)

    // get the members in the room
    getMembers()
    // add the message to the dom
    addBotMessageToDom(`Welcome to the room ${displayName}! 👋`)

    // get the token from the server
    /**
     * @param {string} app_ID - The app ID.
     * mode: 'rtc' or 'live' for real-time communication or live broadcast.
     * codec: 'vp8' or 'h264' for video codec.
     */
    client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})
    // join the room
    await client.join(app_ID, roomId, token, uid)

    // add the event listners to the client join the meetingshow up on the screen
    client.on('user-published', handleUserPublished)
    // add the event listners to the client left after join the meeting the meetingshow up on the screen
    client.on('user-left', handleUserLeft)
}

// when the user join the room the funtion must be run
/**
* this function is used to join the room
*funtionalities in the room button controls and the actions in the room
 */
let joinStream = async () => {
    document.getElementById('join-btn').style.display = 'none'
    document.getElementsByClassName('stream__actions')[0].style.display = 'flex'

    // create the local tracks, using microphone and camera
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, {encoderConfig:{
        width:{min:640, ideal:1920, max:1920},
        height:{min:480, ideal:1080, max:1080}
    }})


    // play the local video track, using the element with id 'local-player'

    let player = `<div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>
                 </div>`

                 // add the video to the dom
    document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)
    // add the event listners to the video
    document.getElementById(`user-container-${uid}`).addEventListener('click', expandVideoFrame)

    // play the local video track, using the element with id 'local-player'
    localTracks[1].play(`user-${uid}`)
    // publish the local tracks to the channel
    await client.publish([localTracks[0], localTracks[1]])
}

// when the user on the camare the funtion must be run 
let switchToCamera = async () => {

    // veiw of the camara view must be appear in acording ly
    let player = `<div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>
                 </div>`
                 // add the player befor the end of the display frame
    displayFrame.insertAdjacentHTML('beforeend', player)

    //local trackmute the mic 
    await localTracks[0].setMuted(true)
    await localTracks[1].setMuted(true)

    // remove the active class from the mic and screen button
    document.getElementById('mic-btn').classList.remove('active')
    // remove the active class from the screen button
    document.getElementById('screen-btn').classList.remove('active')

    localTracks[1].play(`user-${uid}`)
    await client.publish([localTracks[1]])
}


let handleUserPublished = async (user, mediaType) => {
    remoteUsers[user.uid] = user

    await client.subscribe(user, mediaType)

    let player = document.getElementById(`user-container-${user.uid}`)
    if(player === null){
        // add the video to the dom
        player = `<div class="video__container" id="user-container-${user.uid}">
                <div class="video-player" id="user-${user.uid}"></div>
            </div>`

        document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)
        document.getElementById(`user-container-${user.uid}`).addEventListener('click', expandVideoFrame)
   
    }

    if(displayFrame.style.display){
        let videoFrame = document.getElementById(`user-container-${user.uid}`)
        videoFrame.style.height = '100px'
        videoFrame.style.width = '100px'
    }

    if(mediaType === 'video'){
        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType === 'audio'){
        user.audioTrack.play()
    }

}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    let item = document.getElementById(`user-container-${user.uid}`)
    if(item){
        item.remove()
    }

    if(userIdInDisplayFrame === `user-container-${user.uid}`){
        displayFrame.style.display = null
        
        let videoFrames = document.getElementsByClassName('video__container')

        for(let i = 0; videoFrames.length > i; i++){
            videoFrames[i].style.height = '300px'
            videoFrames[i].style.width = '300px'
        }
    }
}

let toggleMic = async (e) => {
    let button = e.currentTarget

    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        button.classList.add('active')
    }else{
        await localTracks[0].setMuted(true)
        button.classList.remove('active')
    }
}

let toggleCamera = async (e) => {
    let button = e.currentTarget

    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        button.classList.add('active')
    }else{
        await localTracks[1].setMuted(true)
        button.classList.remove('active')
    }
}
// when the user on the screen the funtion must be run
let toggleScreen = async (e) => {
    let screenButton = e.currentTarget
    // get the camera button by accses the camara module 
    let cameraButton = document.getElementById('camera-btn')

    // set the sharing screen to true
    if(!sharingScreen){
        sharingScreen = true

        // get the class accses the mic and camara button
        screenButton.classList.add('active')
        // hide the camara button 
        cameraButton.classList.remove('active')
        // disable the camara button
        cameraButton.style.display = 'none'

        // get the local screen track
        localScreenTracks = await AgoraRTC.createScreenVideoTrack()


        // remove the video from the dom
        document.getElementById(`user-container-${uid}`).remove()
        // show the display frame 
        displayFrame.style.display = 'block'

        let player = `<div class="video__container" id="user-container-${uid}">
                <div class="video-player" id="user-${uid}"></div>
            </div>`

        displayFrame.insertAdjacentHTML('beforeend', player)
        document.getElementById(`user-container-${uid}`).addEventListener('click', expandVideoFrame)

        userIdInDisplayFrame = `user-container-${uid}`
        localScreenTracks.play(`user-${uid}`)

        await client.unpublish([localTracks[1]])
        await client.publish([localScreenTracks])

        let videoFrames = document.getElementsByClassName('video__container')
        for(let i = 0; videoFrames.length > i; i++){
            if(videoFrames[i].id != userIdInDisplayFrame){
              videoFrames[i].style.height = '100px'
              videoFrames[i].style.width = '100px'
            }
          }


    }else{
        sharingScreen = false 
        cameraButton.style.display = 'block'
        document.getElementById(`user-container-${uid}`).remove()
        await client.unpublish([localScreenTracks])

        switchToCamera()
    }
}

let leaveStream = async (e) => {
    e.preventDefault()

    document.getElementById('join-btn').style.display = 'block'
    document.getElementsByClassName('stream__actions')[0].style.display = 'none'

    for(let i = 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.unpublish([localTracks[0], localTracks[1]])

    if(localScreenTracks){
        await client.unpublish([localScreenTracks])
    }

    document.getElementById(`user-container-${uid}`).remove()

    if(userIdInDisplayFrame === `user-container-${uid}`){
        displayFrame.style.display = null

        for(let i = 0; videoFrames.length > i; i++){
            videoFrames[i].style.height = '300px'
            videoFrames[i].style.width = '300px'
        }
    }

    channel.sendMessage({text:JSON.stringify({'type':'user_left', 'uid':uid})})
}


document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
document.getElementById('screen-btn').addEventListener('click', toggleScreen)
document.getElementById('join-btn').addEventListener('click', joinStream)
document.getElementById('leave-btn').addEventListener('click', leaveStream)


joinRoomInit()