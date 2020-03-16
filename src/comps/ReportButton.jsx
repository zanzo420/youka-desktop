import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import GA from "react-ga";

export default function ReportButton(props) {
  const [disabled, setDisabled] = useState(false)
  const [text, setText] = useState(props.children)

  function handleClick() {
    setDisabled(true)
    setText("Thanks!")
    GA.event(props.event)
  }

  return (
  <Button disabled={disabled} onClick={handleClick} {...props}>{text}</Button>
  )
}