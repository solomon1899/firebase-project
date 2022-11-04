import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useState } from 'react';
import "./App.css"

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = { // Have the firebase config here
  apiKey: "AIzaSyAZ7AvJkxnyThK6ziLxQ5FoVA1-jHR4dIc",
  authDomain: "chatapp-69007.firebaseapp.com",
  projectId: "chatapp-69007",
  storageBucket: "chatapp-69007.appspot.com",
  messagingSenderId: "886159144927",
  appId: "1:886159144927:web:4be5b9bdd951215e67766a"
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const firestore = firebaseApp.firestore();
const auth = firebase.auth();









function App() {
  const [user] = useAuthState(auth) ;


  return (
    <div className="App">
      <header>
        <SignOut />
        
      </header>

      <section>

        {user ? <ChatRoom /> : <SignIn />}

        </section>

    </div>
  );
}

//******************************* Sign In Component  **************************/
function SignIn ()  {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)

  }
  
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}



//********************           Sign Out Component    ******************************* */
function SignOut() {
  return auth.currentUser && (
<button onClick={() => auth.signOut()}>Sign Out </button>

  )
}


/*********************** Chat Message Component **************************/
function ChatMessage (props) {
  const {text , uid , photoURL  } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
    <img src={photoURL} />
    <p>{text}</p>
    </div>
  )

}








function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query , {idField: 'id'}) ; /*  to understand after */
  const [formValue , setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault() ;
    const {uid , photoURL} = auth.currentUser ; 
    await messagesRef.add({
      text : formValue , 
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid ,
      photoURL
    });

setFormValue('');
  }

//  function changeFormValue(e) {
//     setFormValue(e.target.value)
//   }

const changeFormValue = (e) => {
  setFormValue(e.target.value)
}
return (
  <>
<div>
{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)  }


</div>
  
  <form onSubmit={sendMessage}> 
    <input value={formValue} onChange={changeFormValue}/>
<button type="submit" > send </button>


  </form>
  

  
  
  
  
  
  
  
  
  
  
  
  
  </>
  )

}

export default App;
