export const VisualizerDataArrange = ({ data }) => {
  const visualizerData = [data.weekMap];

  const timeData = [
    "08AM",
    "09AM",
    "10AM",
    "11AM",
    "12PM",
    "01PM",
    "02PM",
    "03PM",
    "04PM",
    "05PM",
    "06PM",
    "07PM",
    "08PM",
    "09PM",
    "10PM",
  ];

  const removePeriod = (time) => time.replace(/[APMapm]/g, "");

  const handleSpecialCaseforDiv = (time, currentDayData) => {
    if (
      (time == "07:00 PM - 10:00 PM" || time == "7:00 PM - 10:00 PM") &&
      (currentDayData[0] == "MON" ||
        currentDayData[0] == "THU" ||
        currentDayData[0] == "TUE" ||
        currentDayData[0] == "WED" ||
        currentDayData[0] == "FRI")
    ) {
      return "06:59 PM - 10:05 PM";
    } else {
      return time;
    }
  };

  const handleSpecialCaseForTime = (time, currentDayData) => {
    if (
      (time == "07:00 PM - 10:00 PM" || time == "7:00 PM - 10:00 PM") &&
      (currentDayData[0] == "MON" ||
        currentDayData[0] == "THU" ||
        currentDayData[0] == "TUE" ||
        currentDayData[0] == "WED" ||
        currentDayData[0] == "FRI")
    ) {
      return ["06:59 PM - 10:05 PM"];
    } else {
      return [time];
    }
  };

  const HandleExtraHeight = (startSlotTime, ModifiedStartSlotTime) => {
    var extraHeight;
    const startTime = convertTo24Hour(startSlotTime);
    const ModifiedStartTime = convertTo24Hour(ModifiedStartSlotTime);

    if (startTime > ModifiedStartTime) {
      const averageValue = startTime - ModifiedStartTime;
      extraHeight = averageValue * 21;
      return extraHeight;
    } else {
      extraHeight = 0;
      return extraHeight;
    }
  };

  const convertToDate = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10); // Convert hours to an integer
    if (hours === 12) hours = 0;
    if (modifier === "PM") hours += 12;
    // Convert hours and minutes to a string and pad with zero if necessary
    return new Date(
      `1970-01-01T${String(hours).padStart(2, "0")}:${minutes}:00Z`
    );
  };

  function convertTo24Hour(time) {
    const [hours, minutes] = time.split(/[: ]/);
    let period = time.slice(-2);
    let hour = parseInt(hours);
    let minute = parseInt(minutes);

    if (period === "PM" && hour !== 12) hour += 12;

    if (period === "AM" && hour === 12) hour = 0;

    return parseFloat(`${hour}.${minute}`);
  }

  const sortSlotTimes = (daySlots) => {
    return daySlots.sort((a, b) => {
      const startA = convertToDate(a.slotTime[0].split(" - ")[0]);
      const startB = convertToDate(b.slotTime[0].split(" - ")[0]);

      return startA - startB;
    });
  };

  const updateStartTimes = (slots) => {
    var data = slots;

    for (let i = 0; i < data.length - 1; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const previousEndTime = convertTo24Hour(data[i].endSlotTime);
        const currentStartTime = convertTo24Hour(data[j].startSlotTime);

        if (previousEndTime >= currentStartTime) {
          const [previousHours, previousMinutes] =
            data[i].startSlotTime.split(/[: ]/);
          const [CurrentHours, Currentminutes] =
            data[j].startSlotTime.split(/[: ]/);
          var period = data[i].startSlotTime.slice(-2);
          data[
            j
          ].startSlotTime = `${previousHours}:${Currentminutes} ${period}`;
        }
      }
    }

    return data;
  };

  if (data.weekMap) {
    const TimeArrangementData = visualizerData.map((dayData) => {
      const result = {};

      Object.keys(dayData).forEach((day) => {
        const meetings = dayData[day];
        const currentDayData = [day];
        const splitMeetings = meetings
          .map((meeting) => {
            const meetingDaysMap = meeting?.meetingDaysMap;
            const meetingTimes = meetingDaysMap[day];

            if (meetingTimes.length > 1) {
              return meetingTimes.map((time) => ({
                ...meeting,
                slotTime: [time],
                meetingDaysMap: {
                  ...meetingDaysMap,
                  [day]: [time],
                },
              }));
            } else {
              return [{ ...meeting, slotTime: meetingTimes }];
            }
          })
          .flat();

        result[day] = splitMeetings;
      });

      return result;
    });

    const convertSlotToString = (slot) => {
      if (Array.isArray(slot)) {
        return slot.join(" "); // Join array elements into a string
      } else if (typeof slot === "string") {
        return slot; // If it's already a string, return it as is
      } else {
        return ""; // Return empty string if slot is neither an array nor a string
      }
    };

    const sortedTimeMinToMax = [];

    for (let dayObj of TimeArrangementData) {
      for (let day in dayObj) {
        sortedTimeMinToMax.push({ [day]: sortSlotTimes(dayObj[day]) });
      }
    }

    const modifiedSlotTimeVisualizerData = sortedTimeMinToMax.map((day) => {
      const modifiedDay = Object.keys(day).reduce((result, key) => {
        // Ensure that result is initialized as an object
        if (typeof result !== "object") result = {};
        const updatedSlotData = day[key].map((item) => {
          const [startSlotTime, endSlotTime] = item.slotTime[0].split(" - ");
          return { ...item, startSlotTime, endSlotTime };
        });
        // Assign the updatedSlotData array to the result object with the current key
        result[key] = updatedSlotData;
        return result;
      }, {}); // Initialize reduce with an empty object

      return modifiedDay;
    });

    const modifiedSlotTimeVisualizerData1 = modifiedSlotTimeVisualizerData.map(
      (day) => {
        const modifiedDay = Object.keys(day).reduce((result, key) => {
          // Ensure that result is initialized as an object
          if (typeof result !== "object") result = {};
          const UpdatedSlotTime = updateStartTimes(day[key]);
          // Assign the updatedSlotData array to the result object with the current key
          result[key] = UpdatedSlotTime;
          return result;
        }, {}); // Initialize reduce with an empty object

        return modifiedDay;
      }
    );
    const addNewSlotTime = modifiedSlotTimeVisualizerData1.map((day) => {
      const modifiedDay = Object.keys(day).reduce((result, key) => {
        if (typeof result !== "object") result = {};
        const updatedSlotData = day[key].map((item) => {
          const newSlot = `${item.startSlotTime} - ${item.endSlotTime}`;
          const [startSlotTime, endSlotTime] = item.slotTime[0].split(" - ");
          return {
            ...item,
            newSlot: [newSlot],
            extraHeight: HandleExtraHeight(startSlotTime, item.startSlotTime),
          };
        });

        result[key] = updatedSlotData;
        return result;
      }, {});
      return modifiedDay;
    });

    const modifiedVisualizerData = addNewSlotTime?.map((day) => {
      const modifiedDay = Object.keys(day).reduce((result, key) => {
        const modifiedSchedule = day[key].map((item) => {
          const changedFormatStartTimeSlot = item.newSlot;
          // Convert slot to string using the function
          const changedStartTimeSlot = convertSlotToString(
            changedFormatStartTimeSlot
          );
          const [seperatedStartTime, seperatedEndTime] =
            changedStartTimeSlot.split("-");
          let startTime = removePeriod(seperatedStartTime);
          const [, hour, minute, period] = seperatedStartTime.match(
            /(\d+):(\d+)\s([APMapm]{2})/
          );
          const modifiedTime = `${hour.padStart(
            2,
            "0"
          )}${period.toUpperCase()}`;
          return {
            ...item,
            modifiedTime: modifiedTime,
          };
        });
        result[key] = modifiedSchedule;
        return result;
      }, {});
      return modifiedDay;
    });

    const formattedData = modifiedVisualizerData
      .map((day) => {
        const formattedDay = Object.keys(day).map((dayKey) => {
          const eventsByTimeSlot = timeData
            .map((timeSlot) => {
              const events = day[dayKey].filter(
                (event) => event.modifiedTime === timeSlot
              );
              return events.length > 0 ? { timeSlot, events } : null;
            })
            .filter(Boolean);
          return { [dayKey]: eventsByTimeSlot };
        });
        return formattedDay;
      })
      .flat();

    const handleStartEndTime = (time, key, value) => {
      let matchingData;
      if (time?.hasOwnProperty(key)) {
        matchingData = time[key][0];
      }
      const [seperatedStartTime, seperatedEndTime] = matchingData.split("-");
      let startTime = removePeriod(seperatedStartTime);
      let endTime = removePeriod(seperatedEndTime);
      if (value == 0) {
        return startTime;
      } else {
        return endTime;
      }
    };

    const modifiedFormattedData = formattedData?.map((day, index) => {
      const keys = Object.keys(formattedData[index]);
      const modifiedDay = Object.fromEntries(
        Object.entries(day).map(([dayKey, timeSlots]) => [
          dayKey,
          timeSlots.map((slot) => ({
            ...slot,
            events: slot.events.map((event) => ({
              ...event,
              startTime: handleStartEndTime(event.meetingDaysMap, keys[0], 0),
              endTime: handleStartEndTime(event.meetingDaysMap, keys[0], 1),
            })),
          })),
        ])
      );
      return modifiedDay;
    });

    return modifiedFormattedData;
  } else {
    return [];
  }
};
