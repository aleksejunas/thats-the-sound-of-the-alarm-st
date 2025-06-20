// ---- UNDONE ---- (the sweater song)
// TODO: [] - Make the navigation bar respect the theme (dark/light mode)
// TODO: [] - More margin top on the navigation bar
// BUG:  [] - All the alarms are sorted under the inactive alarms, even when they are active
// BUG:  [] - Fix the Alarm notification
// TODO: [] - Fix the time picker (not setting the same number as I pick)
// TODO: [] - Style the buttons that are just text (they are not easily recognisable as buttons)
// TODO: [] - Persistence for the pomodoro-timer
// TODO: [] - Add i18n support for translations
// TODO: [] - Move/refactor the editing of alarms to a separate file
// TODO: [] - Add SQLite database to store Alarms
// TODO: [] - Option to lock down the device for 10 minutes after waking up
// **************************************************
// TODO: [x] - Add a settings screen
// TODO: [] - Implement settings screen functions
// **************************************************

// **** OPTIONAL TODOS ****
// TODO: [] - Add recurring alarms (e.g., weekdays, weekends)
// TODO: [] - Add multiple alarm profiles (e.g., workday alarm, weekend alarm)
// TODO: [] - Add a smart alarm (gradual wake-up)
// TODO: [] - Add a wake-up progress bar or countdown
// TODO: [] - Allow multiple alarms at the same time (e.g., primary and backup alarms)
// TODO: [] - Integrate weather data to adjust alarm settings based on weather conditions
// TODO: [] - Allow customizable snooze duration
// TODO: [] - Add location-based alarms (e.g., "Wake me up when I get home")
// TODO: [] - Add inspirational quotes or custom messages with alarms
// TODO: [] - Add a sleep timer feature with relaxing sounds/music
// TODO: [] - Add alarm backup and sync across devices
// TODO: [] - Implement smart detection (e.g., ambient sound, sleep cycle) to adjust alarm timing
// TODO: [] - Allow custom alarm ringtones from the music library
// TODO: [] - Allow alarm sound customization (e.g., frequency, tone, volume)
// TODO: [] - Override "Do Not Disturb" or "Silent Mode" for important alarmsimport '../global.css';
// TODO: [] - Alarm sound picker
// TODO: [] - Block the device from usage for 10 minutes after the alarm goes off (in the mornings only to prevent email-checking etc.(toggleable))
// TODO: [] - Deploy to expo.dev or vercel.app (what is the best option?)
// TODO: [] - Make use of the ios/android notification panel
// TODO: [] - Add try/catch and other error handling
// TODO: [] - Personalize the styling
// TODO: [] - Make the app go fullscreen and front when the alarm goes off
// TODO: [] - Add a snooze feature
// TODO: [] - Add a stop feature
// TODO: [] - Add a vibration feature
// TODO: [] - Add a snooze button
// TODO: [] - Add a stop button
// TODO: [] - Add a vibration button
// TODO: [] - Add a sound button
// TODO: [] - Add a label button
// TODO: [] - Add a color button (functionality for color coding the alarms)
// TODO: [] - Add a frequently used alarms section(or a favorites section)

// ---- DONE ----
// TODO: [x] - Dark/Light mode
// TODO: [x] - Edit alarms
// TODO: [x] - Add sound to the alarm
// TODO: [x] - Color themes
// TODO: [x] - Add a clock component/screen
// FIX:  [x] - Fix the days buttons contrast issue
// TODO: [x] - Move the colors to a theme context from tailwind.config.js instead of having to rebuild the app every time
// TODO: [x] - Update the alarm screen after adding a new alarm
// TODO: [x] -  Add App icon
// TODO: [x] - Change the styling to look more like the sidetrack-slayer-app
// TODO: [x] - Add shadow or another cue, to see which alarms are selected for deletion

// **** TOASTS ****
// TODO: [x] - Add a toast notification when the alarm is set
// TODO: [x] - Add a toast notification when the alarm is deleted
// TODO: [x] - Add a toast notification when the alarm is edited
// TODO: [] - Add a toast notification when the alarm goes off
// TODO: [] - Add a toast notification when the alarm is snoozed
// TODO: [] - Add a toast notification when the alarm is stopped
// TODO: [] - Add a toast notification when the alarm is vibrated
// TODO: [] - Add a toast notification when the alarm is labeled
// TODO: [] - Add a toast notification when the alarm is color coded
// TODO: [] - Add a notification when the alarm goes off (expo-notifications, expo-task-manager, expo-background-fetch)
