import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, LogBox } from 'react-native';
import { Camera } from 'expo-camera';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';

import WebViewComponent from './WebViewComponent';
import CameraComponent from './CameraComponent';
import store from './store';
import { initUser } from './reducer/user';
import { updateGame } from './reducer/game';
import { setAnswerUsername } from './reducer/camera';

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

  const [hasPermission, setHasPermission] = useState(null);

  const dispatch = useDispatch();

  const emit = emitWrapper(webviewRef);

  const handleEndLoading = () => {
    emit(TYPE.onNative);
  };

  const handleUpdateGame = (data) => {
    emit(TYPE.updateGame, data);
  }

  const handleEndGame = (data) => {
    emit(TYPE.completeGame, data);
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
        dispatch(initUser(payload));
        break;
      }
      case TYPE.setGame: {
        dispatch(updateGame(payload));
        dispatch(setAnswerUsername(''));
        navigation.push('Camera');
        break;
      }
      case TYPE.updateGame: {
        const username = payload.game.users.filter((user) => user._id === payload.userId)[0].username;
        dispatch(updateGame({ ...payload.game, gameId: payload.game._id }));
        dispatch(setAnswerUsername(username));
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
        handleUpdateGame={handleUpdateGame}
        handleEndGame={handleEndGame}
      />
    );
  }, []);

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
    <Provider store={store}>

    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name='Home' component={App}/>
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>

  )
}

export default AppContainer;
