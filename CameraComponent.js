import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Vibration, Modal, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { detectLabels, compareLabels } from './util/aws';
import { styles, defaultStyle } from './styles';


const KeywordModal = ({ modalVisible, setModalVisible, keyword }) => {
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
          onPress={() => setModalVisible(false)}
          style={{ ...defaultStyle.button, ...styles.keywordButton }}
        />
      </View>
    </Modal>
  )
};

const HintModal = ({ modalVisible, setModalVisible, hint }) => {
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
          onPress={() => setModalVisible(false)}
          style={{ ...defaultStyle.button, ...styles.hintButton }}
        />
      </View>
    </Modal>
  )
};

const LeaveModal = ({ modalVisible, setModalVisible, navigation }) => {
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
            onPress={() => setModalVisible(false)}
            style={{ ...defaultStyle.button, ...styles.leaveButton }}
          />
          <TouchButton
            text='나갈래🙀'
            onPress={() => navigation.popToTop()}
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
      <KeywordModal modalVisible={keywordModalVisible} setModalVisible={setKeywordModalVisible} keyword={keyword} />
      <HintModal modalVisible={hintModalVisible} setModalVisible={setHintModalVisible} hint={hint} />
      <LeaveModal modalVisible={leaveModalVisible} setModalVisible={setLeaveModalVisible} navigation={navigation} />
      <CompareModal modalVisible={compareModalVisible} />
      <ToastModal modalVisible={toastModalVisible} message={toastMessage} />
      <View style={styles.header}>
        <Icon
          name='pencil-alt'
          size={30}
          color='#FFF'
          onPress={() => setHintModalVisible(true)}
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
          onPress={() => setLeaveModalVisible(true)}
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
                    onChangeText={text => setInputValue(text)}
                    value={inputValue}
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
          onPress={() => takePicture()}
        />
      </View>
    </Camera>
  )
};

export default CameraComponent;
