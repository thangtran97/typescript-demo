import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Video from "./pages/Videos";
import VideoPlayer from "./pages/VideoPlayer";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/videos" element={<Video />} />
                <Route path="/videos/play/:id" element={<VideoPlayer />} />
            </Routes>
        </div>
    );
}

export default App;
