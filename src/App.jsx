import React from "react";
import { Route, Routes } from "react-router-dom";
import { Chat, Login, NotFound, SplashScreen } from "./pages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
