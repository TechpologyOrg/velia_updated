import React, { useState, useEffect } from 'react';

/**
 * V_SelectObject
 * 
 * Props:
 * - items: Array of objects to select from
 * - displayKey: String, key in each object to display as label
 * - displayKey2: String, key in each object to display as label (optional, defaults to 'last_name')
 * - valueKey: String, key in each object to use as value (optional, defaults to 'id')
 * - onSelect: function(selectedObject) - called when an item is selected
 * - selectedValue: value of the currently selected item (optional, for controlled usage)
 * - initialValueId: ID of the initially selected item (optional, for setting initial selection by ID)
 * - cardTitle: string (optional)
 * - className: string (optional) - extra classes for the card
 */
function V_SelectObject({
  items = [],
  displayKey = "name",
  displayKey2 = "last_name",
  valueKey = "id",
  onSelect,
  selectedValue,
  initialValueId,
  cardTitle,
  className = "",
}) {
  // If parent controls selection, use that, else manage internally
  const [internalSelected, setInternalSelected] = useState(() => {
    // If initialValueId is provided, find the matching item and set it as initial value
    if (initialValueId && items.length > 0) {
      const initialItem = items.find(item => getValue(item) === initialValueId);
      return initialItem ? getValue(initialItem) : null;
    }
    return null;
  });

  const getValue = (item) => (valueKey in item ? item[valueKey] : item);

  // Update internal selection when items change and we have an initialValueId
  useEffect(() => {
    if (initialValueId && items.length > 0 && !selectedValue) {
      const initialItem = items.find(item => getValue(item) === initialValueId);
      if (initialItem) {
        setInternalSelected(getValue(initialItem));
      }
    }
  }, [items, initialValueId, selectedValue, valueKey]);

  const handleSelect = (item) => {
    const value = getValue(item);
    if (selectedValue === undefined) {
      setInternalSelected(value);
    }
    if (onSelect) {
      onSelect(item);
    }
  };

  const isSelected = (item) => {
    const value = getValue(item);
    if (selectedValue !== undefined) {
      return selectedValue === value;
    }
    return internalSelected === value;
  };

  return (
    <div
      className={
        "w-full max-w-[340px] bg-white rounded-xl shadow-md border border-neutral-200 p-4 flex flex-col " +
        className
      }
    >
      {cardTitle && (
        <div className="mb-2 font-semibold text-lg">{cardTitle}</div>
      )}
      <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto">
        {items.length === 0 && (
          <div className="text-neutral-400 text-center py-6">Inga objekt</div>
        )}
        {items.map((item, idx) => (
          <button
            key={getValue(item) ?? idx}
            className={
              "w-full text-left px-4 py-2 rounded-lg transition border " +
              (isSelected(item)
                ? "bg-blue-100 border-blue-400 text-blue-900 font-semibold"
                : "bg-neutral-50 border-transparent hover:bg-blue-50")
            }
            onClick={() => handleSelect(item)}
            type="button"
          >
            {(() => {
              const primaryValue = item[displayKey];
              const secondaryValue = item[displayKey2];
              
              if (!primaryValue && !secondaryValue) {
                return <span className="text-neutral-400">Ingen data</span>;
              }
              
              const displayText = [primaryValue, secondaryValue]
                .filter(Boolean)
                .join(' ');
              
              return displayText || <span className="text-neutral-400">Ingen data</span>;
            })()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default V_SelectObject;
