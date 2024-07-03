import React, { useState, useEffect } from "react";
import { CgMenuGridO } from "react-icons/cg";
import { AiOutlineSetting, AiOutlineLogout } from "react-icons/ai";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseServices";
import { collection, doc, getDocs, setDoc, onSnapshot } from "firebase/firestore";

function ChatMenu() {
  const navigate = useNavigate();

  //logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-[30%] flex flex-col fixed top-16 right-2 bg-white shadow-lg">
      <div className="flex h-10 w-full justify-between px-3 items-center">
        <AiOutlineSetting /> Setting
      </div>
      <div onClick={handleLogout} className="flex h-10 w-full justify-between px-3">
        <AiOutlineLogout /> Logout
      </div>
    </div>
  );
}

export default function Chat() {
  //state
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState([
    {
      id: 100902,
      message: "ini user lain bor",
      createdAt: Date.now(),
      user: {
        username: "jokowi",
        avatar: "https://api.multiavatar.com/Binx%20jo.svg",
      },
    },
  ]);
  const [signedUser, setSignUser] = useState(JSON.parse(localStorage.getItem("boring_chat_user")));
  const [loading, setLoading] = useState(true);

  //membaca data dari collection "chat"
  const getChatCollection = async () => {
    let arrayCol = [];
    let chatColRef = await collection(db, "chat");
    let result = await getDocs(chatColRef);
    result.forEach((e) => {
      arrayCol.push(e.data());
    });
    return arrayCol;
  };

  //triger ketika update di collection
  const chatTrigger = () => {
    let chatRef = collection(db, "chat");
    onSnapshot(chatRef, (rec) => {
      getChatCollection().then((res) => {
        setMessage(res);
      });
    });
  };

  //comp did mount
  useEffect(() => {
    let user = localStorage.getItem("boring_chat_user");
    if (!user) {
      return (window.location.href = "/");
    }

    getChatCollection().then((res) => {
      setMessage(res);
    });

    setLoading(false);

    //component did update
    return () => {
      chatTrigger();
    };
  }, [db]);

  //toggle menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  //scroll to bttom
  const scrollToBottomMsg = () => {
    let docH = document.body.scrollHeight;
    window.scrollTo(0, docH);
  };

  //handle message
  const handleMessage = (e) => {
    e.preventDefault();

    let msg = e.target.message.value;
    if (!msg) {
      return;
    }
    let user = JSON.parse(localStorage.getItem("boring_chat_user"));
    e.target.message.value = "";
    setMessage([
      ...message,
      {
        id: Date.now(),
        message: msg,
        createdAt: Date.now(),
        user: user,
      },
    ]);

    let chatRef = doc(db, "chat", Date.now() + signedUser.username);
    setDoc(chatRef, {
      id: Date.now(),
      message: msg,
      createdAt: Date.now(),
      user: user,
    }).then((res) => {
      console.info(res);
    });

    scrollToBottomMsg();
  };

  if (loading) {
    return <div className="w-screen h-screen flex justify-center items-start">loading...</div>;
  }

  return (
    <main className="w-screen h-screen flex flex-col">
      <header className="w-full h-12 px-6 flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-700 top-0 left-0 fixed">
        <div className="flex gap-2 text-white items-center">
          <img src={signedUser?.avatar} alt="avatar" className="w-10 h-10" />
          <h1>@{signedUser?.username}</h1>
        </div>
        <CgMenuGridO className="text-2xl text-white" onClick={toggleMenu} />
      </header>

      {showMenu && <ChatMenu />}

      <div className="w-full flex flex-col mt-auto py-[80px] px-3 gap-4">
        {message.map((e) => (
          <div
            key={e.id}
            className={`w-auto p-4 bg-white flex flex-col rounded-lg shadow-md max-w-[100vw]
            ${e.user.username !== signedUser.username ? "mr-auto" : "ml-auto"} last:mb-20`}
          >
            <p className={`${e.user.username !== signedUser.username ? "text-left" : "text-right"} break-words`}>{e.message}</p>
            <div className="mt-4 flex gap-2 items-center">
              <img src={e.user.avatar} alt="avatar" className="w-6 h-6" />
              <div className="flex flex-col text-gray-400">
                <small className="text-[8px]">{e.user.username}</small>
                <small className="text-[8px]">{moment(e.createdAt).format("dddd DD/MM/YYYY hh:mm")}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form autoComplete="off" onSubmit={handleMessage} className="w-full h-16 flex px-6 items-center bg-gradient-to-r from-orange-500 to-orange-700 fixed bottom-0 left-0 gap-2">
        <input type="text" className="rounded-full px-4 bg-white h-10 flex-1" id="message" />
        <button className="h-10 w-10 bg-blue-500 text-white rounded-full">{">"}</button>
      </form>
    </main>
  );
}
