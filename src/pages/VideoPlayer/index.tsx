import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-seek-buttons/dist/videojs-seek-buttons.css";
import Page from "../../components/Page";
import { useParams } from "react-router-dom";
import videoJsContribQualityLevels from "videojs-contrib-quality-levels";
import videojsHlsQualitySelector from "videojs-hls-quality-selector";
import videosjsSeekButton from "videojs-seek-buttons";
import { getDetailVideo } from "../../store/videoSlice";
import { useAppDispatch } from "../../store/hooks";

const initialOptions: videojs.PlayerOptions = {
    width: 1366,
    height: 768,
    liveui: true,
    autoplay: true,
    controls: true,
    responsive: true,
    playbackRates: [0.5, 1, 1.5, 2],
    controlBar: {
        volumePanel: {
            inline: false
        },
        durationDisplay: true,
        liveDisplay: true,
        seekToLive: true
    },
    plugins: {
        qualityLevel: {},
        hlsQualitySelector: {
            vjsIconClass: "vjs-icon-cog"
        },
        seekButton: {
            forward: 5,
            back: 5
        }
    }
};

const VideoPlayer: React.FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<videojs.Player>();

    const registerPlugin = () => {
        if (!videojs.getPlugin("qualityLevel")) {
            videojs.registerPlugin("qualityLevel", videoJsContribQualityLevels);
        }
        if (!videojs.getPlugin("hlsQualitySelector")) {
            videojs.registerPlugin("hlsQualitySelector", videojsHlsQualitySelector);
        }
        if (!videojs.getPlugin("seekButton")) {
            videojs.registerPlugin("seekButton", videosjsSeekButton);
        }
    };

    useEffect(() => {
        registerPlugin();
        dispatch(getDetailVideo(parseInt(id || "-1"))).then(resultAction => {
            if (getDetailVideo.fulfilled.match(resultAction)) {
                playerRef.current = videojs(videoRef.current || "", {
                    ...initialOptions,
                    sources: [
                        {
                            src: resultAction.payload.data.url,
                            type: resultAction.payload.data.type
                        }
                    ]
                });
            }
        })

        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
            }
        };
    });
    return <Page content={
        <div style={{ marginLeft: 100, marginTop: 10 }}>
            <video ref={videoRef} className="video-js vjs-big-play-centered vjs" />
        </div>}
    />;
};

export default VideoPlayer;
