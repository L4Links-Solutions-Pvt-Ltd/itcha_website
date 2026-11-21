// Fixed list of ITCHA areas (one per area committee, see lib/area-committees.js). Used by the public
// membership form, the dashboard member form and the area filters. Keep in sync with area-committees.js.
export const AREAS = [
  'Raidurgam',
  'Gachibowli Village',
  'DLF & JV Colony',
  'Anjaiah & Siddique Nagar',
  'Nanakramguda',
  'PJR Nagar',
  'Madhapur 1',
  'Madhapur 2',
  'Madhapur 3',
  'TNGO Colony',
  'Kondapur',
  'Kokapet',
  'Padmasri Layout',
  'Vinayak Nagar',
  'Gowlidoddi Tulasi Layout',
];

export const isArea = (v) => AREAS.includes(v);
