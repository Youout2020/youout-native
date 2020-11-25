import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Vibration, Modal, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { detectLabels, compareLabels } from './util/aws';
import { styles, defaultStyle } from './styles';
import {
  setModalVisible,
  setIsKeywordPhase,
  setSimilarList,
  setAnswerUsername,
} from './reducer/camera';

const KeywordModal = ({ modalVisible, keyword }) => {
  const { modalVisibles } = useSelector((state) => state.camera);
  const dispatch = useDispatch();

  const handleOffModal = () => {
    dispatch(setModalVisible({ ...modalVisibles, keyword: false }));
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.keywordContainer}>
        <Text style={styles.keywordLabel}>
          Keyword🐣
        </Text>
        <Text style={styles.keyword}>
          {keyword}
        </Text>
        <Text style={styles.keywordMessage}>
          찍어!
        </Text>
        <TouchButton
          text='OK 📷'
          onPress={handleOffModal}
          style={{ ...defaultStyle.button, ...styles.keywordButton }}
        />
      </View>
    </Modal>
  )
};

const HintModal = ({ modalVisible, hint }) => {
  const { modalVisibles } = useSelector((state) => state.camera);
  const dispatch = useDispatch();

  const handleOffModal = () => {
    dispatch(setModalVisible({ ...modalVisibles, hint: false }));
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.hintContainer}>
        <Text style={styles.hintLabel}>
          Hint🤡
        </Text>
        <Text style={styles.hint}>
          {hint}
        </Text>
        <Text style={styles.hintMessage}>
          이게 힌트야!
        </Text>
        <TouchButton
          text='OK👍'
          onPress={handleOffModal}
          style={{ ...defaultStyle.button, ...styles.hintButton }}
        />
      </View>
    </Modal>
  )
};

const LeaveModal = ({ modalVisible, navigation }) => {
  const { modalVisibles } = useSelector((state) => state.camera);
  const dispatch = useDispatch();

  const handleOffModal = () => {
    dispatch(setModalVisible({ ...modalVisibles, leave: false }));
  };

  const handleLeaveRoom = () => {
    navigation.popToTop();
    dispatch(setModalVisible({ ...modalVisibles, leave: false }));
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.leaveContainer}>
        <Text style={styles.leaveMessage}>
          정말 나갈거야?
        </Text>
        <View style={styles.leaveButtonWrapper}>
          <TouchButton
            text='아니👻'
            onPress={handleOffModal}
            style={{ ...defaultStyle.button, ...styles.leaveButton }}
          />
          <TouchButton
            text='나갈래🙀'
            onPress={handleLeaveRoom}
            style={{ ...defaultStyle.button, ...styles.leaveButton }}
          />
        </View>
      </View>
    </Modal>
  )
};

const CompareModal = ({ modalVisible }) => {
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.compareContainer}>
        <Text style={styles.compareMessage}>
          분석중...📡
        </Text>
      </View>
    </Modal>
  )
};

const ToastModal = ({ modalVisible, message }) => {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.toastContainer}>
        <Text style={styles.toastUsername}>
          {message}가
        </Text>
        <Text style={styles.toastMessage}>
          정답을 맞혔어!
        </Text>
      </View>
    </Modal>
  )
};

const TouchButton = ({ text, onPress, style = defaultStyle.button }) => {
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
  handleUpdateGame,
  handleEndGame,
}) => {
  const {
    modalVisibles,
    isKeywordPhase,
    similarList,
    answerUsername,
  } = useSelector((state) => state.camera);
  const { id: userId } = useSelector((state) => state.user);
  const { gameInfo, users } = useSelector((state) => state.game);
  const { quizList, timeLimit, _id: gameId } = gameInfo;

  const dispatch = useDispatch();

  const [answerValue, setAnswerValue] = useState('');
  const [minutes, setMinutes] = useState(99);
  const [seconds, setSeconds] = useState(0);
  const [toastModalVisibles, setToastModalVisibles] = useState(false);

  const gameIndex = users.filter((user) => user._id === userId)[0]?.gameIndex + 1;
  const { keyword, hint, quiz, answer } = quizList[gameIndex];

  const initialSetting = () => {
    console.log('init');
    setMinutes(Math.floor((timeLimit / (1000 * 60))));
    dispatch(setModalVisible({ ...modalVisibles, keyword: true }));
  };

  const handleOnHintModal = () => {
    dispatch(setModalVisible({ ...modalVisibles, hint: true }));
  };

  const handleOnLeaveModal = () => {
    console.log('open');
    dispatch(setModalVisible({ ...modalVisibles, leave: true }));
  };

  const handleSetAnswer = (text) => {
    setAnswerValue(text);
  };

  const takePicture = async () => {
    dispatch(setModalVisible({ ...modalVisibles, compare: true }));

    Vibration.vibrate();

    const options = { quality: 0.5, base64: true };
    const { base64 } = await cameraRef.current.takePictureAsync(options);
    const quiz = quizList[gameIndex];
    // const response = await detectLabels(base64);
    // const isAnswer = await compareLabels({ keyword: quiz.keyword, response });
    const isAnswer = true;

    dispatch(setModalVisible({ ...modalVisibles, compare: false }));

    if (isAnswer) {
      dispatch(setIsKeywordPhase(false));
    } else {
      const mappedList = response.Labels.slice(0, 3).map((label) => label.Name);
      dispatch(setSimilarList(mappedList));
      setTimeout(() => dispatch(setSimilarList([])), 3000);
    }
  };

  const handleSubmit = () => {
    if (answerValue === answer) {
      if (gameIndex + 1 === quizList.length) {
        const minutesToMs = (minutes + 1) * 60 * 1000;
        const secondsToMs = seconds * 1000;
        const clearTime = minutesToMs + secondsToMs;

        handleEndGame({ gameId, userId, clearTime });
      } else {
        handleUpdateGame({ gameId, userId });
        dispatch(setModalVisible({ ...modalVisibles, keyword: true }));
      }

      dispatch(setIsKeywordPhase(true));
      setAnswerValue('');
    } else {
      setAnswerValue('땡!');
    }
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      if (seconds > 0) setSeconds((prev) => prev - 1);
      if (seconds === 0) {
        switch (minutes) {
          case 0:
            const clearTime = 0;
            handleEndGame({ gameId, userId, clearTime });
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
    setToastModalVisibles(true);

    setTimeout(() => {
      setToastModalVisibles(false);
      dispatch(setAnswerUsername(''));
    }, 1000);
  }, [answerUsername]);

  return (
    <Camera
      style={{ flex: 1 }}
      type={Camera.Constants.Type.back}
      ref={cameraRef}
      onCameraReady={initialSetting}
    >
      <ToastModal modalVisible={toastModalVisibles} message={answerUsername} />
      <KeywordModal modalVisible={modalVisibles.keyword} keyword={keyword} />
      <HintModal modalVisible={modalVisibles.hint} hint={hint} />
      <LeaveModal modalVisible={modalVisibles.leave} navigation={navigation} />
      <CompareModal modalVisible={modalVisibles.compare} />
      <View style={styles.header}>
        <Icon
          name='pencil-alt'
          size={30}
          color='#FFF'
          onPress={handleOnHintModal}
          style={{ ...defaultStyle.button, ...styles.headerButton }}
        />
        <View style={styles.timerWrapper}>
          <Text style={styles.timer}>
            {minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
          </Text>
        </View>
        <Icon
          name='door-closed'
          size={30}
          color='#FFF'
          onPress={handleOnLeaveModal}
          style={{ ...defaultStyle.button, ...styles.headerButton }}
        />
      </View>
      <View style={styles.cardContainer}>
        {isKeywordPhase
          ? <View>
              <View style={styles.keywordCard}>
                <Text style={styles.keywordCardMessage}>
                  {keyword}
                </Text>
              </View>
              {similarList.length > 0 &&
                <View style={styles.similarListContainer}>
                  <Text>
                    분석 결과...
                  </Text>
                  {similarList.map((name) => (
                    <Text key={name} style={styles.similarKeyword}>{name}</Text>
                  ))}
                </View>}
            </View>
          : <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.quizCardWrapper}>
                <View style={styles.quizCard}>
                  <Text style={styles.quizLabel}>
                    <Text style={styles.quizTitle}>{'QUIZ\n'}</Text>
                    {'\n'}
                    {quiz}
                  </Text>
                  <TextInput
                    style={styles.quizInput}
                    onChangeText={handleSetAnswer}
                    value={answerValue}
                    placeholder='정답을 입력해주세요!'
                    placeholderTextColor='blue'
                    onEndEditing={handleSubmit}
                  />
                  <TouchButton
                    text='제출'
                    onPress={handleSubmit}
                    style={{ ...defaultStyle.button, ...styles.quizSubmitButton }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
        }
      </View>
      <View style={styles.cameraButton}>
        <TouchButton
          text='찰칵'
          onPress={takePicture}
        />
      </View>
    </Camera>
  )
};

export default CameraComponent;
