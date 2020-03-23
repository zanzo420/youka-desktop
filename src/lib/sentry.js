import * as Sentry from "@sentry/electron";
import { dsn } from "../config";
import store from "./store";

const stats = store.get("stats");

if (stats) {
  Sentry.init({ dsn });
}
