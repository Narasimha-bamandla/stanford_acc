export const VisualizerCal = ({ data }) => {
  const cardPosition = {
    "08AM": "0px",
    "09AM": "21px",
    "10AM": "42px",
    "11AM": "63px",
    "12PM": "84px",
    "01PM": "105px",
    "02PM": "126px",
    "03PM": "147px",
    "04PM": "168px",
    "05PM": "189px",
    "06PM": "210px",
    "07PM": "231px",
    "08PM": "252px",
    "09PM": "273px",
    "10PM": "294px",
  };

  const cardLeftPosition = {
    MON: "3px",
    TUE: "22px",
    WED: "95px",
    THU: "162px",
    FRI: "190px",
  };

  const expandVisulizerCardLeftPosition = {
    MON: "50px",
    TUE: "327px",
    WED: "543px",
    THU: "800px",
    FRI: "990px",
  };

  const newData = data.map((dayData) => {
    const updatedDayData = {};
    for (const dayKey in dayData) {
      updatedDayData[dayKey] = dayData[dayKey].map((timeSlot) => {
        const updatedEvents = timeSlot.events.map((event) => {
          const startTime = event.startTime;
          const endTime = event.endTime;

          const [startHours, startMinutes] = startTime
            .split(":")
            .map(parseFloat);
          const [endHours, endMinutes] = endTime.split(":").map(parseFloat);

          const totalStartMinutes = startHours * 60 + startMinutes;
          const totalEndMinutes = endHours * 60 + endMinutes;

          const timeDifference = totalEndMinutes - totalStartMinutes;
          const calculatedValue = (timeDifference / 15) * 5.5;

          return {
            ...event,
            height: `${calculatedValue}px`,
          };
        });

        return {
          ...timeSlot,
          events: updatedEvents,
        };
      });
    }
    return updatedDayData;
  });

  function getTimeSlotPosition(timeSlot) {
    const key = Object.keys(cardPosition).find((slot) =>
      timeSlot.toLowerCase().includes(slot.toLowerCase())
    );
    return key ? cardPosition[key] : null;
  }

  const updatedData = newData.map((day) => {
    const updatedData = Object.fromEntries(
      Object.entries(day).map(([dayKey, timeSlots]) => [
        dayKey,
        timeSlots.map((slot) => ({
          ...slot,
          position: getTimeSlotPosition(slot.timeSlot),
        })),
      ])
    );

    return updatedData;
  });

  const processedData = updatedData.map((day) => {
    const updatedDay = {};

    for (const key in day) {
      updatedDay[key] = day[key].map((slot) => {
        const updatedSlot = {
          timeSlot: slot.timeSlot,
          position: slot.position,
          events: slot.events.map((event) => {
            const startTime = event.startTime.split(":");
            const minutes = parseInt(startTime[1], 10);
            const extratop = event.extraHeight;
            let startPosition = 0;
            if (!isNaN(minutes)) {
              startPosition = (28 / 60) * minutes;
            }
            const CalbottomPosition = `${startPosition}px`;

            const topPosition = `calc(${startPosition + extratop}px)`;
            return {
              ...event,
              topPosition,
              CalbottomPosition,
            };
          }),
        };

        return updatedSlot;
      });
    }

    return updatedDay;
  });

  function calculateMarginLeft(dayOfWeek) {
    return cardLeftPosition[dayOfWeek] || "0px";
  }

  // Iterate through data and add marginLeft dynamically
  processedData.forEach((dayData) => {
    for (const dayOfWeek in dayData) {
      dayData[dayOfWeek].forEach((event) => {
        event.events.forEach((eventDetail) => {
          eventDetail.marginLeft = calculateMarginLeft(dayOfWeek);
        });
      });
    }
  });

  function calculateExpandMarginLeft(dayOfWeek) {
    return expandVisulizerCardLeftPosition[dayOfWeek] || "0px";
  }

  const generateUniqueId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  // Iterate through data and add ExpandMarginLeft dynamically
  processedData.forEach((dayData) => {
    for (const dayOfWeek in dayData) {
      dayData[dayOfWeek].forEach((event) => {
        event.events.forEach((eventDetail) => {
          eventDetail.expandMarginLeft = calculateExpandMarginLeft(dayOfWeek);
          eventDetail.uniqueID = generateUniqueId();
        });
      });
    }
  });

  const dayCard = {
    MON: "Monday",
    TUE: "Tuesday",
    WED: "Wednesday",
    THU: "Thursday",
    FRI: "Friday",
  };

  processedData?.forEach((dayObj) => {
    const day = Object.keys(dayObj)[0];
    if (dayObj[day].length > 0) {
      dayObj[day].forEach((slot) => {
        slot.day = dayCard[day];
      });
    }
  });

  const modifiedMarginData = processedData.map((dayObject) => {
    // Loop through each day (MON, TUE, WED, etc.)
    const updatedDayObject = Object.entries(dayObject).map(
      ([dayKey, eventsArray]) => {
        // Loop through each event in the day
        const updatedEventsArray = eventsArray.map((event) => {
          // Extract position and topPosition from the nested structure
          const { position } = event;

          // Update the bottom property
          const newBottom = position;
          return { ...event, bottom: newBottom };
        });

        // Return the updated events for the day under the corresponding day key
        return { [dayKey]: updatedEventsArray };
      }
    );
    // Return the updated day
    return updatedDayObject[0];
  });
  return modifiedMarginData;
};
