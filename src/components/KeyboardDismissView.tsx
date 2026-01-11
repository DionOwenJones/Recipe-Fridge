import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

export default function KeyboardDismissView({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
}
