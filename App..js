import { View, Text, Button, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import TrackPlayer, { Capability, Event, RepeatMode, State, useProgress, useTrackPlayerEvents } from 'react-native-track-player'
import Slider from '@react-native-community/slider'



export const listTrack = [
  {
    id: 1,
    url: require('./src/assets/mp3/hurt.mp3'),
    artist: 'Astrid S',
    title: 'Hurt So Good',
    artwork: require('./src/assets/image/hurt.jpg'),
    duration: 207
  },

  {
    id: 2,
    url: require('./src/assets/mp3/dark.mp3'),
    artist: 'Katy Perry',
    title: 'Dark Horse',
    artwork: require('./src/assets/image/dark.jpg'),
    duration: 219
  },

  {
    id: 3,
    url: require('./src/assets/mp3/god.mp3'),
    artist: 'NewJeans',
    title: 'Gods',
    artwork: require('./src/assets/image/god.jpg'),
    duration: 272
  }
]

const ControllerCenter = () => {
  const [state, setState] = useState('pause')

  const onBack = async () => {
    await TrackPlayer.skipToPrevious()
  }

  const togglePlay = async () => {
    const isPlaying = (await TrackPlayer.getPlaybackState()).state
    console.log(isPlaying)
    if (isPlaying === State.Playing) {
      await TrackPlayer.pause()
      console.log('pause...')
      setState('pause')
    } else {
      await TrackPlayer.play()
      console.log('play...')
      setState('playing')
    }
  }

  const onNext = async () => {
    await TrackPlayer.skipToNext()
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignSelf: 'center', marginTop: 10 }}>
      <TouchableOpacity onPress={onBack}>
        <Image source={require('./src/assets/image/back.png')} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={togglePlay}>
        <Image source={state == 'playing' ? require('./src/assets/image/pause.png') : require('./src/assets/image/play.png')} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onNext}>
        <Image source={require('./src/assets/image/next.png')} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>
    </View>
  )
}


const InfoCenter = ({ track }) => {
  console.log('title: ', track.title)
  return (
    <View style={{ alignItems: 'center' }}>
      <Image style={{ width: 200, height: 200, alignSelf: 'center' }} source={{ uri: track.artwork?.toString() }} />
      <Text style={{ fontWeight: '500', fontSize: 16, color: 'black', marginTop: 30 }}>{track.title}</Text>
      <Text style={{ fontWeight: '400', fontSize: 18, color: 'gray', marginTop: 5, marginBottom: 30 }}>{track.artist}</Text>
    </View>
  )
}

const SliderController = () => {
  const progress = useProgress()

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }


  return (
    <View>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={progress.duration}
        minimumTrackTintColor="#e6e600"
        maximumTrackTintColor="#fff"
        value={progress.position}
        onValueChange={async (value) => await TrackPlayer.seekTo(value)}
      />
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: 'white' }}>{formatTime(progress.position.toFixed())}</Text>
        <Text style={{ color: 'white' }}>{formatTime(progress.duration.toFixed())}</Text>
      </View>
    </View>
  )
}


const App = () => {

  const [curTrack, setTrack] = useState()

  const setUpTrack = async () => {
    await TrackPlayer.setupPlayer()
    await TrackPlayer.setRepeatMode(RepeatMode.Queue)
    console.log('complete set up...')
    await addTrack()
    await addOptions()
    await getCurTrack()
  }
  const addTrack = async () => {
    await TrackPlayer.add(listTrack);
    console.log('complete add track...')
  }

  const getCurTrack = async () => {
    const trackIndex = await TrackPlayer.getActiveTrackIndex()
    const track = await TrackPlayer.getTrack(trackIndex)
    setTrack(track)
    console.log('set curTrack complete...')
  }


  useEffect(() => {
    setUpTrack()
  }, [])

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], event => {
    if (event.type == Event.PlaybackActiveTrackChanged) {
      getCurTrack()
    }
  })

  

  const addOptions = async () => {
    await TrackPlayer.updateOptions({
      // Media controls capabilities
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],

      // Capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: [Capability.Play, Capability.Pause],

      // Icons for the notification on Android (if you don't like the default ones)
      playIcon: require('./src/assets/image/play.png'),
      pauseIcon: require('./src/assets/image/pause.png'),
      stopIcon: require('./src/assets/image/stop.png'),
      previousIcon: require('./src/assets/image/back.png'),
      nextIcon: require('./src/assets/image/next.png'),
      icon: require('./src/assets/image/noti.png')
    });

    console.log('complete update option...')
  }

  if (!curTrack) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    )
  }


  return (
    <SafeAreaView style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#303134', paddingHorizontal: 50 }}>
      <InfoCenter track={curTrack} />
      <SliderController />
      <ControllerCenter />
    </SafeAreaView>
  )
}

export default App