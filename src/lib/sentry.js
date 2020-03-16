import * as Sentry from '@sentry/electron';
import { dsn } from '../config'

const stats = localStorage.getItem("stats") === 'true'

if (stats) {
  Sentry.init({ dsn })
}