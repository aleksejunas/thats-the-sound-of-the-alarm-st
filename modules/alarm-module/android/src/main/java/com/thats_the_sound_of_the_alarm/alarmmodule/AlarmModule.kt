package com.thats_the_sound_of_the_alarm.alarmmodule

import android.content.Context
import android.nfc.Tag
import android.util.Log
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

private const val TAG = "AlarmModule"

// Shape of each alarm object sent from JS. Expo converts it for us
class AlarmRecord : Record {
  @Field val id: String = ""
  @Field val hour: Int = 0
  @Field val minute: Int = 0
  @Field val days: List<Int> = emptyList()
  @Field val label: String = "Alarm"
}

class AlarmModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("AlarmModule")

    Function("ping") {
      "pong"
    }

    Function("setAlarms") { alarms: List<AlarmRecord> ->
      val specs = alarms.map { AlarmSpec(it.id, it.hour, it.minute, it.days, it.label) }
      AlarmStore.save(context, specs)
      Log.d(TAG, "setAlarms: saved ${specs.size} alarms: $specs")
    }

    Function("getAlarms") {
      AlarmStore.load(context).map { it.toString() }
    }
  }
}
















