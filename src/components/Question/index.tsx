import { View, Text, Dimensions } from "react-native";

import { Option } from "../Option";
import { styles } from "./styles";
import Animated, { Keyframe, runOnJS } from "react-native-reanimated";

type QuestionProps = {
  title: string;
  alternatives: string[];
};

type Props = {
  question: QuestionProps;
  alternativeSelected?: number | null;
  setAlternativeSelected?: (value: number) => void;
  onUnmount: () => void;
};

export function Question({
  question,
  alternativeSelected,
  setAlternativeSelected,
  onUnmount,
}: Props) {
  const SCREEN_WIDTH = Dimensions.get("window").width;

  const enteringKeyframe = new Keyframe({
    from: {
      opacity: 0,
      transform: [{ translateX: SCREEN_WIDTH }],
    },
    to: {
      opacity: 1,
      transform: [{ translateX: 0 }],
    },
  });

  const exitingKeyframe = new Keyframe({
    from: {
      opacity: 1,
      transform: [{ translateX: 0 }],
    },
    to: {
      opacity: 0,
      transform: [{ translateX: SCREEN_WIDTH * -1 }],
    },
  });

  return (
    <Animated.View
      style={styles.container}
      entering={enteringKeyframe.duration(400)}
      exiting={exitingKeyframe.duration(400).withCallback((finished) => {
        "worklet";
        if (finished) {
          runOnJS(onUnmount)();
        }
      })}
    >
      <Text style={styles.title}>{question.title}</Text>

      {question.alternatives.map((alternative, index) => (
        <Option
          key={index}
          title={alternative}
          checked={alternativeSelected === index}
          onPress={() =>
            setAlternativeSelected && setAlternativeSelected(index)
          }
        />
      ))}
    </Animated.View>
  );
}
