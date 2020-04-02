import React, { useState, useEffect } from "react";
import { Message, Dimmer, Loader } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { downloadFfpmeg } from "../lib/mess";
import store from "../lib/store";

export default function InitPage() {
  let history = useHistory();
  const [error, setError] = useState();

  useEffect(() => {
    (async () => {
      try {
        await downloadFfpmeg();
        store.set("initialized", true);
        history.push("/");
      } catch (error) {
        setError(error.toString());
      }
    })();
  }, [history]);

  return error ? (
    <Message negative>
      <Message.Header>Ooops, some error occurred :(</Message.Header>
      <p>{error}</p>
    </Message>
  ) : (
    <Dimmer inverted active>
      <Loader>Initializing. It may take a minute..</Loader>
    </Dimmer>
  );
}
