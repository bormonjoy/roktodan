export const divisions = [
  { value: 'dhaka', label: 'Dhaka' },
  { value: 'chattogram', label: 'Chattogram' },
  { value: 'rajshahi', label: 'Rajshahi' },
  { value: 'khulna', label: 'Khulna' },
  { value: 'barishal', label: 'Barishal' },
  { value: 'sylhet', label: 'Sylhet' },
  { value: 'rangpur', label: 'Rangpur' },
  { value: 'mymensingh', label: 'Mymensingh' },
];

export const districtsByDivision: Record<string, Array<{ value: string; label: string }>> = {
  dhaka: [
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'gazipur', label: 'Gazipur' },
    { value: 'narayanganj', label: 'Narayanganj' },
    { value: 'tangail', label: 'Tangail' },
    { value: 'munshiganj', label: 'Munshiganj' },
  ],
  chattogram: [
    { value: 'chattogram', label: 'Chattogram' },
    { value: 'coxs-bazar', label: 'Cox\'s Bazar' },
    { value: 'bandarban', label: 'Bandarban' },
    { value: 'rangamati', label: 'Rangamati' },
    { value: 'khagrachari', label: 'Khagrachari' },
  ],
  rajshahi: [
    { value: 'rajshahi', label: 'Rajshahi' },
    { value: 'natore', label: 'Natore' },
    { value: 'pabna', label: 'Pabna' },
    { value: 'bogura', label: 'Bogura' },
    { value: 'chapainawabganj', label: 'Chapainawabganj' },
  ],
  khulna: [
    { value: 'khulna', label: 'Khulna' },
    { value: 'jessore', label: 'Jessore' },
    { value: 'satkhira', label: 'Satkhira' },
    { value: 'bagerhat', label: 'Bagerhat' },
    { value: 'chuadanga', label: 'Chuadanga' },
  ],
  barishal: [
    { value: 'barishal', label: 'Barishal' },
    { value: 'bhola', label: 'Bhola' },
    { value: 'patuakhali', label: 'Patuakhali' },
    { value: 'pirojpur', label: 'Pirojpur' },
    { value: 'jhalokati', label: 'Jhalokati' },
  ],
  sylhet: [
    { value: 'sylhet', label: 'Sylhet' },
    { value: 'moulvibazar', label: 'Moulvibazar' },
    { value: 'habiganj', label: 'Habiganj' },
    { value: 'sunamganj', label: 'Sunamganj' },
  ],
  rangpur: [
    { value: 'rangpur', label: 'Rangpur' },
    { value: 'dinajpur', label: 'Dinajpur' },
    { value: 'kurigram', label: 'Kurigram' },
    { value: 'thakurgaon', label: 'Thakurgaon' },
    { value: 'panchagarh', label: 'Panchagarh' },
  ],
  mymensingh: [
    { value: 'mymensingh', label: 'Mymensingh' },
    { value: 'jamalpur', label: 'Jamalpur' },
    { value: 'netrokona', label: 'Netrokona' },
    { value: 'sherpur', label: 'Sherpur' },
  ],
};

export const bloodGroups = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];