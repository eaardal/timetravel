import React from 'react';

export default (day) => (
    <div className="DayPicker-Day--content">
      {day.getDate()}
    </div>
  );
