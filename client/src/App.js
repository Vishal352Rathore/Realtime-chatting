import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';

const ENDPOINT = "https://realtime-chatting-server.vercel.app/" ;
let socket = io(ENDPOINT);
console.log(socket);

const  App = () =>{

  const [userName, setUserName] = useState('');
  const [userRegister, setUserRegister] = useState(true);
  const [message, setMessage] = useState('');


  window.onload = function () {

  const form = document.getElementById('send-container');
  const messageInput = document.getElementById('messageInp');
  const messageContainer = document.querySelector('.container');

    
  const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}


  form.addEventListener('submit' ,function(e) {
    console.log("on mess send")
    e.preventDefault();
    const message = messageInput.value;
    append(`you: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
    setMessage('');
  });


socket.on('user-joined', (name) => {
  append(`${name} joined the chat`, 'center');
  console.log("name from apend " + name);
})

socket.on('receive', (data) => {
  append(`${data.name}: ${data.message}`, 'left')
})
};

const handleClick = (e) => {
  e.preventDefault();

  if (userName.trim() === '') {
    alert('Please fill out the name.');
    return;
  }else{
    socket.emit('new-user-joined', userName);
    setUserRegister(false);
    console.log("userName "+ userName);
    setUserName('');
  }
}

  return (
    <div className="App">
    
          <div className=''>
            <h3>Live Chat</h3>

            <p style={{fontWeight : 'bold'}}>Please enter the name to join the chat</p>
            <form >
              <input  disabled = {!userRegister}  id='nameInp' type="text" value={userName} onChange={(e) => setUserName(e.target.value)}></input>
              <button disabled = {!userRegister}  className='btn' type='submit' onClick={(e) => handleClick(e)}>Enter</button>
            </form>
          </div>
               <div className='container'>
                
               </div>
          <div className="send">
              <form id="send-container" >
                  <input disabled = {userRegister} type="text" message="messageInp" id='messageInp'  value={message} onChange={(e) => setMessage(e.target.value)}></input>
                  <button disabled = { message === '' ?true :false} className='btn' type='submit'>Send</button>
              </form>
              </div>
    </div>
  );
}

export default App;
