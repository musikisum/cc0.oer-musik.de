import React, { useState } from 'react';

export default ({ options, onChange }) => {

  const [data, setData] = useState(options);

  const toggle = index => {
    const newData = [...data];
    newData.splice(index, 1, {
      label: data[index].label,
      checked: !data[index].checked
    });
    setData(newData);
    onChange(newData.filter(x => x.checked));
  };

  return (
    <div className="fieldOfCheckboxes">
      {data.map((item, index) => (
        <label className="checkbox" key={item.label}>
          <input
            readOnly
            type="checkbox"
            checked={item.checked || false}
            onClick={() => toggle(index)}
          />
          {item.label}
        </label>
      ))}
    </div>
  );
};