export const wrongAnswerSound = async () => {
  const audio = new Audio(
    "http://dight310.byu.edu/media/audio/FreeLoops.com/1/1/Beep%20Sound.wav-21324-Free-Loops.com.mp3"
  );

  audio.play();
};

export const rightAnswerSound = async () => {
  const audio = new Audio(
    "http://onj3.andrelouis.com/phonetones/unzipped/Apple-iPhone3GS/UISounds/wav/begin_record.wav"
  );

  audio.play();
};

export default {
  wrongAnswerSound,
  rightAnswerSound
};
