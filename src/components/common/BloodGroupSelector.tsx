import React from 'react';

interface BloodGroupSelectorProps {
  selectedGroup: string;
  onChange: (group: string) => void;
}

const BloodGroupSelector: React.FC<BloodGroupSelectorProps> = ({ selectedGroup, onChange }) => {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'All'];

  return (
    <div className="flex flex-wrap gap-2">
      {bloodGroups.map((group) => (
        <button
          key={group}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedGroup === group
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onChange(group)}
        >
          {group}
        </button>
      ))}
    </div>
  );
};

export default BloodGroupSelector;