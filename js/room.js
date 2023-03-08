let messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;

const memberContainer = document.getElementById('members__container');
const memberButton = document.getElementById('members__button');

const chatContainer = document.getElementById('messages__container');
const chatButton = document.getElementById('chat__button');

let activeMemberContainer = false;

memberButton.addEventListener('click', () => {
  if (activeMemberContainer) {
    memberContainer.style.display = 'none';
  } else {
    memberContainer.style.display = 'block';
  }

  activeMemberContainer = !activeMemberContainer;
});

let activeChatContainer = false;

chatButton.addEventListener('click', () => {
  if (activeChatContainer) {
    chatContainer.style.display = 'none';
  } else {
    chatContainer.style.display = 'block';
  }

  activeChatContainer = !activeChatContainer;

});

// get the display frame of the video
let displayFrame = document.getElementById('stream__box')
// get the all video frames container in the stream
let videoFrames = document.getElementsByClassName('video__container')
// dsplaya fraim user id 
let userIdInDisplayFrame = null;


let expandVideoFrame = (e) => {

  let child = displayFrame.children[0]
  if(child){
      document.getElementById('streams__container').appendChild(child)
  }
// display the frame and connect the video to it
  displayFrame.style.display = 'block'
  displayFrame.appendChild(e.currentTarget)
  // get the current user id
  userIdInDisplayFrame = e.currentTarget.id

  // handle the vedio frames size and the display frame size and the number of vedio frames 
  for(let i = 0; videoFrames.length > i; i++){
    // current ID != user id in display frame then change the height and width of the video frame
    if(videoFrames[i].id != userIdInDisplayFrame){
      videoFrames[i].style.height = '100px'
      videoFrames[i].style.width = '100px'
    }
  }

}


// if the user click on the display frame hide it and show the video frames
// but user face can't this is for the screen share 
for(let i = 0; videoFrames.length > i; i++){
  videoFrames[i].addEventListener('click', expandVideoFrame)
}


let hideDisplayFrame = () => {
    userIdInDisplayFrame = null
    displayFrame.style.display = null


    // get the child of the display frame and append it to the stream container
    let child = displayFrame.children[0]
    // if the child is not null append it to the stream container
    document.getElementById('streams__container').appendChild(child)

    for(let i = 0; videoFrames.length > i; i++){
      videoFrames[i].style.height = '300px'
      videoFrames[i].style.width = '300px'
  }
}

displayFrame.addEventListener('click', hideDisplayFrame)

