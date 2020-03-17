import "../lib/sentry"
import React, { useState, useEffect } from "react";
import { Message, Icon } from "semantic-ui-react"
import { downloadFfpmeg } from "../lib/mess"

export function initialized() {
  return window.localStorage.getItem("initialized") === "true"
}

export default function InitPage() {
  const [error, setError] = useState()

  useEffect(() => {
    (async () => {
      try {
        await downloadFfpmeg()
        window.localStorage.setItem("initialized", true)
        window.location.reload()
      } catch (error) {
        setError(error.toString())
      }
    })()
  }, [])

  return (
    error ?
      <Message negative>
        <Message.Header>Ooops, some error occurred :(</Message.Header>
        <p>{error}</p>
      </Message>
      :
      <Message icon>
        <Icon name="circle notched" loading />
        <Message.Content>
          <Message.Header>Initializing</Message.Header>
        It may take a minute..
      </Message.Content>
      </Message>
  )
}