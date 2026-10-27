package com.thats_the_sound_of_the_alarm.alarmmodule

import org.json.JSONArray
import org.json.JSONObject
import android.content.Context

/**
 * One alarm as native code needs it.
 * days uses java.utils.Calendar constants: SUNDAY = 1 ... SATURDAY = 7.
 * An empty list means a one-time alarm.
 */
data class AlarmSpec(
    val id: String,
    val hour: Int,
    val minute: Int,
    val days: List<Int>,
  val label: String,
) {
fun toJson(): JSONObject = JSONObject()
    .put("id", id)
    .put("hour", hour)
    .put("minute", minute)
    .put("days", JSONArray(days))
    .put("label", label)

    companion object {
      fun fromJson(json: JSONObject): AlarmSpec {
        val daysJson = json.getJSONArray("days")
        return AlarmSpec(
         id = json.getString("id"),
         hour = json.getInt("hour"),
         minute = json.getInt("minute"),
         days = List(daysJson.length()) { i -> daysJson.getInt(i) },
         label = json.optString("label", "Alarm"),
        )
      }
    }
}
