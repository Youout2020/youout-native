import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, LogBox } from 'react-native';
import { Camera } from 'expo-camera';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import WebViewComponent from './WebViewComponent';
import CameraComponent from './CameraComponent';

LogBox.ignoreLogs(['Remote debugger']);

const Stack = createStackNavigator();

const TYPE = {
  onNative: 'ON_NATIVE',
  log: 'LOG',
  setUser: 'SET_USER',
  setGame: 'SET_GAME',
  updateGame: 'UPDATE_GAME',
  completeGame: 'COMPLETE_GAME',
};

const emitWrapper = (ref) => {
  return (type, payload) => {
    ref.current.postMessage(JSON.stringify({ type, payload }));
  }
};

const App = ({ navigation }) => {
  const webviewRef = useRef();
  const cameraRef = useRef();
  const [user, setUser] = useState({ id: '' });
  const [game, setGame] = useState({ gameInfo: { quizList: [] }, users: [{ gameIndex: -1 }]});
  const [answerUsername, setAnswerUsername] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const { gameInfo, users } = game;
  const emit = emitWrapper(webviewRef);

  const handleEndLoading = () => {
    emit(TYPE.onNative);
  };

  const handleUpdateGame = () => {
    emit(TYPE.updateGame, { gameId: gameInfo._id, userId: user.id });
  }

  const handleEndGame = (clearTime) => {
    emit(TYPE.completeGame, { gameId: gameInfo._id, userId: user.id, clearTime });
    navigation.goBack();
  };

  const handleOnMessage = ({ nativeEvent: { data } }) => {
    const { type, payload } = JSON.parse(data);

    switch (type) {
      case TYPE.log: {
        console.log('log', payload);
        break;
      }
      case TYPE.setUser: {
        setUser(payload);
        break;
      }
      case TYPE.setGame: {
        setGame(payload);
        setAnswerUsername('');
        navigation.push('Camera');
        break;
      }
      case TYPE.updateGame: {
        const username = payload.game.users.filter((user) => user._id === payload.userId)[0].username;
        setGame(payload.game);
        setAnswerUsername(username);
        break;
      }
    }
  };

  const WebViewContainer = useCallback(({ navigation }) => {
    return (
      <WebViewComponent
        webviewRef={webviewRef}
        navigation={navigation}
        handleEndLoading={handleEndLoading}
        handleOnMessage={handleOnMessage}
      />
    );
  }, []);

  const CameraContainer = useCallback(({ navigation }) => {
    return (
      <CameraComponent
        cameraRef={cameraRef}
        navigation={navigation}
        quizList={gameInfo.quizList}
        timeLimit={gameInfo.timeLimit}
        users={users}
        userId={user.id}
        handleUpdateGame={handleUpdateGame}
        handleEndGame={handleEndGame}
        answerUsername={answerUsername}
      />
    );
  }, [users]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Stack.Navigator initialRouteName='WebView' screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name='WebView' component={WebViewContainer} />
      <Stack.Screen name='Camera' component={CameraContainer} />
    </Stack.Navigator>
  );
}

const AppContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name='Home' component={App}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppContainer;
