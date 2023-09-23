import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { tz } from './types/tz'

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault(tz('Asia/Seoul'))

export const date = dayjs
