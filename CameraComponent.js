import React, { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import { Alert, Text, Button, View, TouchableOpacity, Vibration, LogBox, Modal, StyleSheet, TextInput } from 'react-native';

import { detectLabels, compareLabels } from './util/aws';

const defaultStyle = {
  width: 100,
  height: 100,
  backgroundColor: 'white',
  borderRadius: 50,
  alignItems: 'center',
  justifyContent: 'center'
};

const KeywordModal = ({ modalVisible, setModalVisible, keyword }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 200, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 30, color: 'red' }}>
          {keyword}
        </Text>
        <Text style={{ fontSize: 30 }}>
          찍어!
        </Text>
        <TouchButton text='OK!' onPress={() => setModalVisible(false)} style={{ ...defaultStyle, width: 60, height: 60, margin: 20, backgroundColor: 'skyblue' }} />
      </View>
    </Modal>
  )
};

const HintModal = ({ modalVisible, setModalVisible, hint }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 200, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 30, color: 'red' }}>
          {hint}
        </Text>
        <Text style={{ fontSize: 30 }}>
          이게 힌트야!
        </Text>
        <TouchButton text='OK!' onPress={() => setModalVisible(false)} style={{ ...defaultStyle, width: 60, height: 60, margin: 20, backgroundColor: 'skyblue' }} />
      </View>
    </Modal>
  )
};

const LeaveModal = ({ modalVisible, setModalVisible, navigation }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 200, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 30, color: 'red' }}>
          정말 나갈거야?
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchButton text='아니!' onPress={() => setModalVisible(false)} style={{ ...defaultStyle, width: 60, height: 60, margin: 20, backgroundColor: 'skyblue' }} />
          <TouchButton text='나갈래!' onPress={() => navigation.popToTop()} style={{ ...defaultStyle, width: 60, height: 60, margin: 20, backgroundColor: 'skyblue' }} />
        </View>
      </View>
    </Modal>
  )
};

const CompareModal = ({ modalVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 200, backgroundColor: 'white', opacity: 0.5 }}>
        <Text style={{ fontSize: 30, color: 'red' }}>
          분석중...
        </Text>
      </View>
    </Modal>
  )
};

const ToastModal = ({ modalVisible, message }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 200, backgroundColor: 'white', opacity: 0.5 }}>
        <Text style={{ fontSize: 30, color: 'red' }}>
          {message}가
        </Text>
        <Text style={{ fontSize: 30 }}>
          정답을 맞췄어!
        </Text>
      </View>
    </Modal>
  )
};

const TouchButton = ({ text, onPress, style = defaultStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
    >
      <Text>
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const CameraComponent = ({
  navigation,
  cameraRef,
  quizList,
  timeLimit,
  users,
  userId,
  handleUpdateGame,
  handleEndGame,
  answerUsername,
}) => {
  const [keywordModalVisible, setKeywordModalVisible] = useState(false);
  const [hintModalVisible, setHintModalVisible] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [toastModalVisible, setToastModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isKeywordPhase, setIsKeywordPhase] = useState(true);
  const [minutes, setMinutes] = useState(Math.floor((timeLimit / (1000 * 60))));
  const [seconds, setSeconds] = useState(59);
  const [similarList, setSimilarList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const gameIndex = users.filter((user) => user._id === userId)[0].gameIndex + 1;
  const { keyword, hint, quiz, answer } = quizList[gameIndex];

  const initialSetting = () => {
    setKeywordModalVisible(true);
  };

  const takePicture = async () => {
    setCompareModalVisible(true);
    Vibration.vibrate();

    const options = { quality: 0.5, base64: true };
    const { base64 } = await cameraRef.current.takePictureAsync(options);
    const quiz = quizList[gameIndex];
    const response = await detectLabels(base64);
    // const isAnswer = await compareLabels({ keyword: quiz.keyword, response });
    const isAnswer = true;

    setCompareModalVisible(false);

    if (isAnswer) {
      setIsKeywordPhase(false);
    } else {
      const mappedList = response.Labels.slice(0, 3).map((label) => label.Name);
      setSimilarList(mappedList);
      setTimeout(() => setSimilarList([]), 3000);
    }
  };

  const handleSubmit = () => {
    if (inputValue === answer) {
      if (gameIndex + 1 === quizList.length) {
        const minutesToMs = (minutes + 1) * 60 * 1000;
        const secondsToMs = seconds * 1000;

        handleEndGame(minutesToMs + secondsToMs);
      } else {
        handleUpdateGame();
      }
    } else {
      setInputValue('땡!');
    }
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      if (seconds > 0) setSeconds((prev) => prev - 1);
      if (seconds === 0) {
        switch (minutes) {
          case 0:
            handleEndGame(0);
            break;
          default:
            setMinutes((prev) => prev - 1);
            setSeconds(59);
        }
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [seconds]);

  useEffect(() => {
    if (!answerUsername) return;

    setToastMessage(answerUsername);
    setToastModalVisible(true);

    setTimeout(() => {
      setToastMessage('');
      setToastModalVisible(false);
    }, 1000)
  }, [answerUsername]);

  return (
    <Camera
      style={{ flex: 1 }}
      type={Camera.Constants.Type.back}
      ref={cameraRef}
      onCameraReady={initialSetting}
    >
      <KeywordModal modalVisible={keywordModalVisible} setModalVisible={setKeywordModalVisible} keyword={keyword}/>
      <HintModal modalVisible={hintModalVisible} setModalVisible={setHintModalVisible} hint={hint}/>
      <LeaveModal modalVisible={leaveModalVisible} setModalVisible={setLeaveModalVisible} navigation={navigation}/>
      <CompareModal modalVisible={compareModalVisible}/>
      <ToastModal modalVisible={toastModalVisible} message={toastMessage}/>
      <View style={{ flex: 2.5, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <TouchButton text='힌트' onPress={() => setHintModalVisible(true)} style={{ ...defaultStyle, width: 60, height: 60, margin: 20 }}/>
        <View style={{ alignSelf: 'center', backgroundColor: 'black' }}>
          <Text style={{ color: 'white' }}>
            {minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
          </Text>
        </View>
        <TouchButton text='나가기' onPress={() => setLeaveModalVisible(true)} style={{ ...defaultStyle, width: 60, height: 60, margin: 20 }} />
      </View>
      <View style={{ flex: 10, backgroundColor: 'transparent', alignItems: 'center' }}>
        {isKeywordPhase
          ? <View>
              <View style={{ width: 200, height: 50, backgroundColor: 'white', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'red', fontSize: 16 }}>
                  {keyword}
                </Text>
              </View>
              {similarList.length > 0 &&
                <View style={{ width: 200, height: 100, backgroundColor: 'skyblue', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                  {similarList.map((name) => <Text key={name} style={{ color: 'white' }}>{name}</Text>)}
                </View>}
            </View>
          : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'white', width: 300, height: 400, borderRadius: 30, opacity: 0.9 }}>
                <Text style={{ flex: 1, fontSize: 20, margin: 50 }}>
                  <Text style={{ fontWeight: 'bold' }}>{'QUIZ\n'}</Text>
                  {'\n'}
                  {quiz}
                </Text>
                <TextInput
                  style={{ flex: 0.2, height: 40, borderColor: 'gray', borderBottomWidth: 1, width: 150, textAlign: 'center' }}
                  onChangeText={text => setInputValue(text)}
                  value={inputValue}
                  placeholder='정답을 입력해주세요!'
                  placeholderTextColor='blue'
                  onEndEditing={handleSubmit}
                />
              <TouchButton text='제출' onPress={handleSubmit} style={{ ...defaultStyle, backgroundColor: 'pink', margin: 20, width: 60, height: 40 }}/>
              </View>
            </View>
        }
      </View>
      <View style={{ flex: 3, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        <TouchButton text='찰칵' onPress={() => takePicture()}/>
      </View>
    </Camera>
  )
};

export default CameraComponent;
