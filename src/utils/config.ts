export const CONST = Object.freeze({

  // minimum noise value below data would not be sent
  MIN_NOISE_VALUE: 10,
  // maximum noise value above data would not be sent
  MAX_NOISE_VALUE: 50,
  // time interval for checking dbMeter level
  TIME_INTERVAL_DBMETER: 1000,
  // time_interval for sending a session data to the server
  TIME_INTERVAL_SEND_DATA_TO_SERVER: 60000,
  // firedatabase consts
  FIRE_DATABASE: {
    DATABASE_FULL_URL: 'https://silencio-database.firebaseio.com/',
    TABLE_SESSION_URL: '/session/'

  },
  LED_COLOR_STRINGS: {
    RED: '255,0,0',
    GREEN: '0,255,0',
    ZERO: '0'
  }

});
