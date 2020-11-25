import { StyleSheet } from 'react-native';

const COLOR = {
  MAIN_COLOR: '#b69b7c',
  CARROT: '#F76D1F',
  YELLOW: 'rgb(255, 194, 88)',
};

export const defaultStyle = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
  },
});

export const styles = StyleSheet.create({
  keywordContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: 'white',
  },
  keywordLabel: {
    marginBottom: 50,
    padding: 10,
    borderColor: COLOR.CARROT,
    borderWidth: 5,
    borderRadius: 15,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  keyword: {
    marginBottom: 20,
    fontSize: 50,
    fontWeight: 'bold',
    color: COLOR.CARROT,
  },
  keywordMessage: {
    marginBottom: 50,
    fontSize: 24,
  },
  keywordButton: {
    width: 120,
    height: 50,
    margin: 20,
    backgroundColor: COLOR.MAIN_COLOR,
  },
  hintContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: 'white',
  },
  hintLabel: {
    marginBottom: 50,
    padding: 10,
    borderColor: COLOR.CARROT,
    borderWidth: 5,
    borderRadius: 15,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  hint: {
    marginBottom: 20,
    fontSize: 50,
    fontWeight: 'bold',
    color: COLOR.CARROT,
  },
  hintMessage: {
    marginBottom: 50,
    fontSize: 24,
  },
  hintButton: {
    width: 120,
    height: 50,
    margin: 20,
    backgroundColor: COLOR.MAIN_COLOR,
  },
  leaveContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: 'white',
  },
  leaveMessage: {
    marginBottom: 30,
    color: COLOR.CARROT,
    fontSize: 50,
  },
  leaveButtonWrapper: {
    flexDirection: 'row',
  },
  leaveButton: {
    width: 120,
    height: 50,
    margin: 10,
    backgroundColor: COLOR.MAIN_COLOR,
  },
  compareContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: COLOR.YELLOW,
    opacity: 0.7,
  },
  compareMessage: {
    color: 'black',
    fontSize: 30,
  },
  toastContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: 'white',
    opacity: 0.5,
  },
  toastUsername: {
    color: COLOR.CARROT,
    fontSize: 30,
  },
  toastMessage: {
    fontSize: 30,
  },
  header: {
    flex: 2.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  headerButton: {
    width: 40,
    height: 40,
    margin: 20,
    backgroundColor: 'transparent',
  },
  timerWrapper: {
    alignSelf: 'center',
    padding: 5,
    borderWidth: 3,
    borderRadius: 15,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  timer: {
    color: 'black',
    fontSize: 20,
  },
  cardContainer: {
    flex: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  keywordCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  keywordCardMessage: {
    color: COLOR.CARROT,
    fontSize: 24,
    fontWeight: 'bold',
  },
  similarListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'skyblue',
    opacity: 0.9,
  },
  similarKeyword: {
    color: 'white',
  },
  quizCardWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizCard: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 300,
    height: 400,
    padding: 20,
    borderRadius: 30,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  quizLabel: {
    flex: 1,
    marginTop: 60,
    fontSize: 20,
  },
  quizTitle: {
    fontWeight: 'bold',
  },
  quizInput: {
    flex: 0.2,
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    fontSize: 20,
    textAlign: 'center',
  },
  quizSubmitButton: {
    width: 100,
    height: 40,
    margin: 20,
    backgroundColor: COLOR.CARROT,
  },
  cameraButton: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
