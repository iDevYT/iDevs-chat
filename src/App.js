import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyANfFC73ZCDECWC7QnU-2DZmbnNwcYSiCQ",
  authDomain: "idevs-chat-app.firebaseapp.com",
  databaseURL: "https://idevs-chat-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "idevs-chat-app",
  storageBucket: "idevs-chat-app.appspot.com",
  messagingSenderId: "912253802832",
  appId: "1:912253802832:web:ca09700061d4f1705ff455",
  measurementId: "G-Q9CLKNEVMH"
  
});
const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>iCA</h1>
        <a href='mailto://alphangred57@gmail.com'>Contact</a> <br/>
        <p>By iDev. Based on Fireships Chat Apps</p>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const Gprovider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(Gprovider);
  }
  const signInWithGitHub = () => {
    const GHprovider = new firebase.auth.GithubAuthProvider();
    auth.signInWithPopup(GHprovider);
  }
  const signInWithAsGuest = () => {
    auth.signInAnonymously().catch(alert);
  }
  const signInWithFaceBook = () => {
    const FBprovider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(FBprovider);
  }
  return (

    <>
      <div className="grid"> 
      <button className="sign-in grelement" onClick={signInWithGoogle}>Sign in with Google</button>
      <button className="sign-in grelement" onClick={signInWithGitHub}>Sign in with GitHub</button>
      <button className="sign-in grelement" onClick={signInWithFaceBook}>Sign in with Facebook</button>
      <button className="sign-in grelement" onClick={signInWithAsGuest}>Sign in As a guest</button>
      </div>
      <p>Do not violate the ToS or you will be banned for life!</p>
      <br/>
      <button className="link" onCllinick={() => SignUp = true}>E-mail Coming soon</button>
      <signInWithEmail />
      <footer>
      <CreateInWithEmail />      
      </footer>
    </>
  )

}
function signInWithEmail() {
  const signInWithEmail = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password).catch(alert);
  }

return (
  <form onSubmit={signInWithEmail}>
  <input id="email" type="email" placeholder='E-Mail Address'/>
    <input id="password" type="password" placeholder='Password' />
    <button type="submit">Sign in with Email</button>
  </form>
)
}
function CreateInWithEmail() {
  const CreateInWithEmail = () => {
    const email = document.getElementById('cemail').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password).catch(alert);
  }
  return (
    <form onSubmit={CreateInWithEmail}>
    <input id="cemail" type="email" placeholder='E-Mail Address'/>
    <input id="cpassword" type="password" placeholder='Password' />
    <button type="submit">Create Account With Email</button>
    </form>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button  className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(500);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice..." />

      <button class="corner" type="submit" disabled={!formValue}>Send <span role="img" aria-label="Send Emoji">✈️</span></button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="The Profile placeholer"/>
      <p>{text}</p>
    </div>
  </>)
}


export default App;