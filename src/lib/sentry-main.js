import { init } from '@sentry/electron/dist/main'
import * as Sentry from '@sentry/electron'
import { dsn } from '../config'

init({ dsn })