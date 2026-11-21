// ITCHA Central Committee 2026. Source: ITCHA's handwritten Telugu list "ITCHA Central Committee 2026.pdf"
// (Nov 2026). English spellings are taken from the area-committee spreadsheet wherever the phone number
// matches; names marked `// check` were transliterated from Telugu and need ITCHA to confirm the spelling.
// Phone numbers are deliberately NOT published.

export const centralCommittee = [
  { title: 'Honorary Presidents', members: [
    { name: 'C. Chandrasekhar' }, // check
    { name: 'G. L. N. Reddy (Lakshmi Narayana Reddy)' },
  ] },
  { title: 'Office bearers', members: [
    { name: 'Pasam Amarnath Reddy', role: 'President' },
    { name: 'Tata Karunakar', role: 'General Secretary' },
    { name: 'Kasireddy Nagi Reddy', role: 'Treasurer' },
    { name: 'Marthala V Siva Kumar Reddy', role: 'Co-Treasurer' },
  ] },
  { title: 'Working Presidents', members: [
    { name: 'Yellampalli Maheedhar' },
    { name: 'Gottipati Srinivasa Rao' },
  ] },
  { title: 'Honorary Advisors', members: [
    { name: 'Mannepalli Sanjay Chowdary' }, // check
    { name: 'Basireddy Jayarami Reddy' },
  ] },
  { title: 'Organising Secretaries', members: [
    { name: 'Udumula Raja Rathna Reddy' },
    { name: 'P. V. Koteswara Rao (KTR)' },
    { name: 'Suryavardhan Vennam' },
  ] },
  { title: 'Senior Vice Presidents', members: [
    { name: 'Meka Basava Shankar' },
    { name: 'Adusumalli Srinivasa Rao' },
  ] },
  { title: 'Vice Presidents', members: [
    { name: 'M. Siva Koteswara Rao' },
    { name: 'Kesava Reddy Chundi' },
    { name: 'D. Nagarjuna Reddy' },
    { name: 'Chinnapureddy Ramana Reddy', note: 'P.R. Gardens' },
    { name: 'Kotapati Rama Rao', note: 'Gowlidoddi' },
    { name: 'Kaku Madhu' },
    { name: 'Dhana Babu' }, // check
    { name: 'Gangasani Srinivasula Reddy', note: 'DLF' },
  ] },
  { title: 'Joint Secretaries', members: [
    { name: 'MaramReddy Venkateswara Reddy (M.L.R.)' },
    { name: 'Pilli Kameswar Reddy' },
    { name: 'Yalla Prasad' },
    { name: 'J. L. Narasaiah' },
    { name: 'Palakolanu Ramana Reddy', note: 'Anjaiah Nagar' },
    { name: 'Jangiti Ramanjaneyulu', note: 'Nanakramguda' },
    { name: 'Duggireddy Pratap Reddy', note: 'Kokapet' },
    { name: 'Sannapareddy Mallikarjun Reddy', note: 'Gowlidoddi' },
  ] },
];

// Sub-committees of the central committee. The first member listed is the convener where marked.
export const subCommittees = [
  { title: 'Disciplinary Committee', members: [
    { name: 'Chinnapureddy Ramana Reddy', role: 'Convener' },
    { name: 'G. L. N. Reddy' },
    { name: 'Udumula Raja Rathna Reddy' },
    { name: 'Meka Basava Shankar' },
    { name: 'M. Siva Koteswara Rao' },
  ] },
  { title: 'Building Owners Coordination Committee', members: [
    { name: 'Raghu Naidu', role: 'Convener' }, // check
    { name: 'M. Gemini Ganesh' },
    { name: 'Palagulla Mallikarjuna Reddy' },
    { name: 'Manuvardhan Reddy' },
  ] },
  { title: 'Social Media (IT Cell)', members: [
    { name: 'Nehru Babu', role: 'Convener' }, // check
    { name: 'Gangasani Srinivasula Reddy', note: 'DLF' },
    { name: 'Sureddy V Mallikarjun Reddy', note: 'Madhapur' },
    { name: 'Kesava Reddy Chundi' },
  ] },
  { title: 'Sports and Cultural Committee', members: [
    { name: 'Kaku Madhu', role: 'Convener' },
    { name: 'Dharma' }, // check
    { name: 'K. Brahma Reddy' },
    { name: 'Ch. Ramesh Reddy' },
  ] },
  { title: 'Media', members: [
    { name: 'Yellampalli Maheedhar' },
    { name: 'Mannepalli Sanjay Chowdary' },
    { name: 'Pasam Amarnath Reddy' },
    { name: 'Tata Karunakar' },
  ] },
];

// Executive Committee (EC) members of the central committee, by area.
export const ecMembers = [
  { area: 'Raidurgam', members: ['Vemuri Venkata Hanum Prasad', 'Golamari Rajakiran Reddy', 'Boddu Kasi Viswanadha Gupta'] },
  { area: 'PJR Nagar', members: ['Puli Venkat Reddy', 'S. Ramana Reddy'] },
  { area: 'Padmasri Gardens', members: ['Kattipalli Lakshmilingeswara', 'Nelakurthi Prakash'] },
  { area: 'Kokapet', members: ['Duggireddy Venkata Ramana Reddy', 'Boyalla Bhaskar Reddy'] },
  { area: 'Nanakramguda', members: ['Busireddy Mallikarjuna Reddy', 'Manyam Venkata Subbareddy'] },
  { area: 'Telecom Nagar & Vinayak Nagar', members: ['Kalyani Srinivas', 'Kota Krishna Reddy', 'Ragavarapu Siddartha', 'Sare Venkata Subbaiah'] },
  { area: 'Gachibowli 1, 2, 3', members: ['Kotapati Venu', 'Gajulapalli Chandrahas', 'Malineni Subbarayudu'] },
  { area: 'TNGO Colony', members: ['Syamala Pratap Reddy', 'Ambhavaram Sudesh Reddy', 'Gorlamandala Sunil Kumar'] },
  { area: 'DLF', members: ['Marthala V Satish Kumar Reddy', 'Gaddam Ranga Reddy'] },
  { area: 'Madhapur 1', members: ['Duggireddy Krishna Reddy (co-living)', 'Gottipati Srihari', 'G V S Krishna Reddy (hostel)'] },
  { area: 'Madhapur 2', members: ['Ch. Mohan', 'A. Ramana Yadav', 'Ch. Ramesh Reddy', 'Devineni Vijayarami Reddy', 'G. Ram Mohan Reddy'] },
  { area: 'Madhapur 3', members: ['Kotla Karthik Reddy', 'Sureddy V Mallikarjun Reddy (S.V.R. PG)', 'M. Bhaskar Reddy', 'Kalluri Madan Mohan Reddy'] },
  { area: 'Kondapur', members: ['Daruvuri Babu Rao (Babanna)', 'Avula Rajeswar Reddy', 'Bairaboina Ramanaiah'] },
  { area: 'Tulasi Layout', members: ['Beeram Raja Reddy', 'Palakolanu Praveen Kumar Reddy', 'Pamuri Bhaskar Reddy'] },
  { area: "Women's Cell", members: ['Sunitha', 'K. Meghana'] },
  { area: 'Anjaiah Nagar', members: ['Palakolanu Venkata Subbi Reddy', 'Muddana Sambashiva Rao', 'Kalluri Madhusudhan Reddy', 'Katakam Satya Narayana (DLF)'] },
];
