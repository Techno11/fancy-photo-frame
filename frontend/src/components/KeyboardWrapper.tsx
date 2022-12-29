import React from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import {useState} from "preact/hooks";

interface IProps {
  onChange: (input: string) => void;
}

const KeyboardWrapper = ({onChange}: IProps) => {
  const [layoutName, setLayoutName] = useState("default");

  const onKeyPress = (button: string, s: boolean) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
  };

  return (
    <Keyboard
      layoutName={layoutName}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
  );
};

export default KeyboardWrapper;
