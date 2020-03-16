import { init } from "@sentry/electron/dist/main"
import * as Sentry from "@sentry/electron" // eslint-disable-line
import { dsn } from "../config"

init({ dsn })