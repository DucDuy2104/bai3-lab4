import TrackPlayer, { Event } from "react-native-track-player"





// service.js
export async function PlayBackService() {
    TrackPlayer.addEventListener(Event.RemotePlay, ()=>  TrackPlayer.play())
    TrackPlayer.addEventListener(Event.RemotePause, ()=>  TrackPlayer.pause())
    TrackPlayer.addEventListener(Event.RemoteNext, ()=>  TrackPlayer.skipToNext())
    TrackPlayer.addEventListener(Event.RemotePrevious, ()=>  TrackPlayer.skipToPrevious())

}