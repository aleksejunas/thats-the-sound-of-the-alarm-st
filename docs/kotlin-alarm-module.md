# Plan: Kotlin-alarmmodul (erstatter steg 4–7 i forrige plan)

## Kontekst
Testene på CMF Phone 2 Pro (Android 16) viste:
- Telefonen nedgraderer varsellyden fra `USAGE_ALARM` til `USAGE_NOTIFICATION`, så alarmen er stum i vibrasjons- og lydløs modus.
- Varselet kan sveipes bort, og expo-av-loopen fortsetter uten noen måte å stoppe den på.
- Uten exact-permission har alarmen et vindu på én time.

Målet er en vekkerklokke som ringer på eksakt tid, i alarmstrømmen og i loop, med fullskjerm og Stopp-knapp, og som tåler sveip og reboot. Native kode gjør alt som skal skje når appen er lukket. JS beholder UI og lagring.

## Arkitektur
```
JS (AlarmsContext)
  └─ AlarmModule.setAlarms(enabledAlarms)      ← erstatter TaskManager.register/unregister
       │  (Expo-modul, Kotlin)
       ├─ AlarmStore     SharedPreferences: alarmlista (native trenger den uten JS, f.eks. ved boot)
       ├─ AlarmScheduler AlarmManager.setAlarmClock() – neste forekomst per alarm
       ├─ AlarmReceiver  BroadcastReceiver: alarmen går av → start AlarmService
       ├─ AlarmService   Foreground service: MediaPlayer (USAGE_ALARM, loop) + vibrasjon
       │                 + fast varsel med fullScreenIntent → AlarmActivity
       ├─ AlarmActivity  Fullskjerm over låseskjermen: Stopp / Slumre
       └─ BootReceiver   BOOT_COMPLETED → AlarmScheduler.scheduleAll()
```
**Designvalg:** JS sender **hele lista** med aktive alarmer hver gang den endres. Native avbestiller alt og planlegger på nytt, akkurat som `cancelAll`-fiksen. Native regner ut neste forekomst selv, også for ukedager. Etter at en alarm har ringt, planlegger native neste forekomst uten JS. Da trengs ikke expo-background-fetch lenger.

Alt (manifest, receivers, service, activity) ligger i modulen sin egen `AndroidManifest.xml`. Gradle slår den sammen med appens manifest, så `android/` trenger nesten ikke røres.

---

## Steg K0: Opprett lokal Expo-modul
```
npx create-expo-module@latest --local
# navn: alarm-module   →  modules/alarm-module/
```
- Slett iOS- og web-filene du ikke trenger. Behold `index.ts`, `src/` og `android/`.
- Gi `AlarmModule.kt` én funksjon: `Function("ping") { "pong" }`.
- Kall den fra JS (`import AlarmModule from '../modules/alarm-module'`), bygg med `pnpm expo run:android --device`, og se `pong` i loggen.
- **Læring:** Hvordan Expo-moduler autolinkes, og hvordan JS-kall når Kotlin.

## Steg K1: AlarmStore + datamodell
- `data class AlarmSpec(id: String, hour: Int, minute: Int, days: List<Int>, label: String)`. `days` bruker `Calendar.SUNDAY..SATURDAY`, og tom liste betyr engangsalarm.
- Lagre lista som JSON i SharedPreferences (`org.json` holder).
- I `AlarmModule`: `Function("setAlarms") { alarms: List<Map<String, Any>> -> ... }`. Parse, lagre, og logg.
- I JS (`AlarmsContext.scheduleAlarms`): map `"07:30"` og `["Mon", "Fri"]` til tall før du sender.
- **Test:** `adb shell run-as com.thats_the_sound_of_the_alarm.app cat shared_prefs/<navn>.xml`.

## Steg K2: AlarmScheduler med `setAlarmClock`
- `nextTrigger(spec, now): Long`. Bruk `Calendar` og finn neste ukedag i `days`, eller i dag/i morgen for engangsalarmer. **Skriv denne først og test den i hodet**, for den er lett å gjøre feil.
- `scheduleAll(context)`: avbestill gamle, og kjør `alarmManager.setAlarmClock(AlarmClockInfo(trigger, showIntent), operation)` per alarm.
  - `operation` = `PendingIntent.getBroadcast(..., requestCode = id.hashCode(), FLAG_IMMUTABLE)` til `AlarmReceiver`.
  - Avbestilling: samme `requestCode` og intent, deretter `alarmManager.cancel(pi)`. Lagre ID-ene du har planlagt, så du kan avbestille slettede alarmer.
- Manifest: `USE_EXACT_ALARM` og `SCHEDULE_EXACT_ALARM` (`maxSdkVersion="32"`).
- **Test:** `adb shell dumpsys alarm | grep -A4 thats_the_sound`. Forvent `ALARM_CLOCK`-flagg og `window=0`. Alarmklokkeikonet skal vises i statuslinjen.

## Steg K3: AlarmReceiver + AlarmService (lyd)
- `AlarmReceiver.onReceive`: `ContextCompat.startForegroundService(ctx, Intent(ctx, AlarmService::class.java).putExtra("id", id))`.
- `AlarmService`:
  - `onStartCommand`: kall `startForeground(...)` **innen 5 sekunder** med et varsel på en egen kanal (`alarm-ringing`, importance HIGH, **uten** kanallyd, fordi lyden kommer fra MediaPlayer).
  - `MediaPlayer` med `AudioAttributes.USAGE_ALARM`, `R.raw.morning_birds`, `isLooping = true` og `setWakeMode(PARTIAL_WAKE_LOCK)`.
  - Vibrasjon med `VibratorManager` / `VibrationAttributes.USAGE_ALARM`.
  - Etter avspilling: `AlarmScheduler.scheduleAll()`, slik at ukealarmer får neste forekomst.
  - Stopp: `ACTION_STOP`-intent, som kjører `player.stop()`, `stopForeground(STOP_FOREGROUND_REMOVE)` og `stopSelf()`.
  - Legg til en «Stopp»-knapp (`addAction`) i varselet allerede nå. Det er sikkerhetsnettet ditt.
- Manifest: `<service android:foregroundServiceType="mediaPlayback">`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK`, `WAKE_LOCK`, `VIBRATE`, og `<receiver android:exported="false">`.
- **Test, og dette er hovedmålet:** Sett telefonen i **vibrasjon**, sett en alarm 2 min frem, sveip appen bort og slå av skjermen. Lyden skal komme, loope, og stoppe på «Stopp».

## Steg K4: AlarmActivity (fullskjerm)
- Enkel `Activity` med Stopp- og Slumre-knapp. Den kan bruke en XML-layout eller rene Views, så du slipper Compose-oppsett.
- `onCreate`: `setShowWhenLocked(true)` og `setTurnScreenOn(true)`.
- I service-varselet: `setFullScreenIntent(activityPendingIntent, true)` og `setCategory(Notification.CATEGORY_ALARM)`.
- Manifest: `USE_FULL_SCREEN_INTENT` og `<activity android:showWhenLocked="true" android:turnScreenOn="true" android:excludeFromRecents="true" android:launchMode="singleInstance">`.
- Sjekk `notificationManager.canUseFullScreenIntent()` (Android 14+). Hvis den er false, åpne `Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT` fra JS-innstillingene.
- **Test:** Låst telefon. Skjermen skal våkne og vise alarmskjermen over låseskjermen.

## Steg K5: Slumre
- Slumre gjør `stop` og setter en engangs-`setAlarmClock` om N minutter med samme receiver. Bruk en egen requestCode, for eksempel `"$id-snooze".hashCode()`.
- Start med fast 9 minutter. Innstilling kan komme senere (todos.js).

## Steg K6: BootReceiver
- `<receiver>` for `BOOT_COMPLETED` (og `MY_PACKAGE_REPLACED`, så alarmer overlever en app-oppdatering) som kaller `AlarmScheduler.scheduleAll(ctx)`.
- Manifest: `RECEIVE_BOOT_COMPLETED` finnes allerede.
- **Test:** Alarm 5 min frem, `adb reboot`, ikke åpne appen. Den skal ringe.

## Steg K7: Rydd JS-siden
- `AlarmsContext.scheduleAlarms`: kall `AlarmModule.setAlarms(alarms.filter(a => a.enabled))`. Fjern `length > 0`-sjekken.
- Engangsalarm: native fjerner den fra planen etter at den har ringt. Eksponer `getFiredOneShotIds()` (eller et event), slik at JS kan sette `enabled: false` ved oppstart.
- Slett `lib/taskManager.ts` (background-fetch, notification-task, expo-av-loop) og `lib/sound.ts`. Fjern `expo-background-fetch`, `expo-task-manager` og `expo-av` fra `package.json` hvis ingenting annet bruker dem.
- Avgjør om expo-notifications skal stå igjen. Den brukes nå bare til permission-spørsmålet for `POST_NOTIFICATIONS`.

## Steg K8: Nothing OS-herding
- Be om unntak fra batterioptimalisering (`ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`) fra innstillingsskjermen.
- Test en hel natt med release-bygg: `pnpm expo run:android --variant release --device`.

---

## Verifisering etter hvert steg
1. `pnpm tsc --noEmit` og at bygget går gjennom (Kotlin-feil vises i Gradle-output).
2. `adb logcat | grep -E "AlarmModule|AlarmService|AlarmReceiver"`. Gi hver klasse en `TAG` og logg rikelig.
3. `adb shell dumpsys alarm | grep -A4 thats_the_sound`.
4. Den virkelige testen: vibrasjonsmodus, appen sveipet bort, skjermen av, og alarm 2 min frem.

## Filer
- Ny: `modules/alarm-module/` (`index.ts`, `expo-module.config.json`, `android/src/main/AndroidManifest.xml`, `android/src/main/java/.../{AlarmModule,AlarmStore,AlarmScheduler,AlarmReceiver,AlarmService,AlarmActivity,BootReceiver}.kt`)
- Endres: `app/context/AlarmsContext.tsx`
- Slettes til slutt: `lib/taskManager.ts`, `lib/sound.ts`
- `morning_birds.mp3` ligger allerede i `android/app/src/main/res/raw/`. Den kan flyttes inn i modulens `res/raw/` for å gjøre modulen selvstendig.
