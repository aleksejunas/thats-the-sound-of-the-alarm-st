
package com.thats_the_sound_of_the_alarm.alarmmodule

import android.content.Context
import org.json.JSONArray

// `object` = en eneste instans (singleton). Du kaller AlarmStore.save(:::) uten `new`.
object AlarmStore {
  // `private const val` = constant that exists only in this file
  private const val PREFS_NAME = "alarm_module"
  private const val KEY_ALARMS = "alarms"

// Helperfunction: gets "file" SharedPreferences and writes to 
private fun prefs(context: Context) = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

  fun save(context: Context, alarms: List<AlarmSpec>) {
    val json = JSONArray(alarms.map { it.toJson() })
    prefs(context).edit().putString(KEY_ALARMS, json.toString()).apply()
  }

  fun load(context: Context): List<AlarmSpec> {
    val raw = prefs(context).getString(KEY_ALARMS, null) ?: return emptyList()
    val array = JSONArray(raw)
    return List(array.length()) { i -> AlarmSpec.fromJson(array.getJSONObject(i)) }
  }
}

