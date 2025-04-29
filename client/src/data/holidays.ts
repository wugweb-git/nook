export interface Holiday {
  id: string;
  name: string;
  date: Date;
  description?: string;
  type: 'national' | 'regional' | 'optional';
  region: 'north' | 'south' | 'east' | 'west' | 'all';
}

// North Indian Holidays for 2025
export const northIndianHolidays2025: Holiday[] = [
  {
    id: '2025-01-01',
    name: 'New Year\'s Day',
    date: new Date(2025, 0, 1), // January 1, 2025
    type: 'national',
    region: 'all',
    description: 'First day of the year in the Gregorian calendar'
  },
  {
    id: '2025-01-26',
    name: 'Republic Day',
    date: new Date(2025, 0, 26), // January 26, 2025
    type: 'national',
    region: 'all',
    description: 'Honors the date on which the Constitution of India came into effect'
  },
  {
    id: '2025-03-14',
    name: 'Maha Shivaratri',
    date: new Date(2025, 2, 14), // March 14, 2025
    type: 'national',
    region: 'all',
    description: 'Hindu festival celebrating Lord Shiva'
  },
  {
    id: '2025-03-22',
    name: 'Holi',
    date: new Date(2025, 2, 22), // March 22, 2025
    type: 'national',
    region: 'all',
    description: 'Festival of colors celebrating the arrival of spring'
  },
  {
    id: '2025-04-11',
    name: 'Ram Navami',
    date: new Date(2025, 3, 11), // April 11, 2025
    type: 'national',
    region: 'all',
    description: 'Celebrates the birth of Lord Rama'
  },
  {
    id: '2025-04-18',
    name: 'Good Friday',
    date: new Date(2025, 3, 18), // April 18, 2025
    type: 'national',
    region: 'all',
    description: 'Christian observance commemorating the crucifixion of Jesus'
  },
  {
    id: '2025-05-01',
    name: 'International Labour Day',
    date: new Date(2025, 4, 1), // May 1, 2025
    type: 'national',
    region: 'all',
    description: 'Celebrates the achievements of workers'
  },
  {
    id: '2025-06-29',
    name: 'Eid al-Adha',
    date: new Date(2025, 5, 29), // June 29, 2025
    type: 'national',
    region: 'all',
    description: 'Islamic festival to commemorate Ibrahim\'s willingness to sacrifice his son'
  },
  {
    id: '2025-08-15',
    name: 'Independence Day',
    date: new Date(2025, 7, 15), // August 15, 2025
    type: 'national',
    region: 'all',
    description: 'Anniversary of India\'s independence from British rule'
  },
  {
    id: '2025-08-18',
    name: 'Raksha Bandhan',
    date: new Date(2025, 7, 18), // August 18, 2025
    type: 'regional',
    region: 'north',
    description: 'Hindu festival celebrating the bond between brothers and sisters'
  },
  {
    id: '2025-08-26',
    name: 'Janmashtami',
    date: new Date(2025, 7, 26), // August 26, 2025
    type: 'national',
    region: 'all',
    description: 'Celebrates the birth of Lord Krishna'
  },
  {
    id: '2025-10-02',
    name: 'Gandhi Jayanti',
    date: new Date(2025, 9, 2), // October 2, 2025
    type: 'national',
    region: 'all',
    description: 'Birthday of Mahatma Gandhi'
  },
  {
    id: '2025-10-12',
    name: 'Dussehra',
    date: new Date(2025, 9, 12), // October 12, 2025
    type: 'national',
    region: 'all',
    description: 'Hindu festival celebrating the victory of good over evil'
  },
  {
    id: '2025-10-31',
    name: 'Diwali',
    date: new Date(2025, 9, 31), // October 31, 2025
    type: 'national',
    region: 'all',
    description: 'Festival of lights celebrating the victory of light over darkness'
  },
  {
    id: '2025-11-01',
    name: 'Govardhan Puja',
    date: new Date(2025, 10, 1), // November 1, 2025
    type: 'regional',
    region: 'north',
    description: 'Hindu festival dedicated to Lord Krishna'
  },
  {
    id: '2025-11-02',
    name: 'Bhai Dooj',
    date: new Date(2025, 10, 2), // November 2, 2025
    type: 'regional',
    region: 'north',
    description: 'Hindu festival celebrating brother-sister relationships'
  },
  {
    id: '2025-11-14',
    name: 'Children\'s Day',
    date: new Date(2025, 10, 14), // November 14, 2025
    type: 'optional',
    region: 'all',
    description: 'Birthday of Jawaharlal Nehru, celebrated as Children\'s Day'
  },
  {
    id: '2025-11-24',
    name: 'Guru Nanak Jayanti',
    date: new Date(2025, 10, 24), // November 24, 2025
    type: 'national',
    region: 'all',
    description: 'Birthday of Guru Nanak, the founder of Sikhism'
  },
  {
    id: '2025-12-25',
    name: 'Christmas',
    date: new Date(2025, 11, 25), // December 25, 2025
    type: 'national',
    region: 'all',
    description: 'Christian festival celebrating the birth of Jesus Christ'
  }
];

// Gets all North Indian holidays for a given year
export function getNorthIndianHolidays(year: number = new Date().getFullYear()): Holiday[] {
  // Currently we only have 2025 data, so use that for any requested year
  // In a real app, you'd have data for different years or calculate it dynamically
  return northIndianHolidays2025.filter(holiday => 
    holiday.region === 'all' || holiday.region === 'north'
  );
}

// Gets all holidays for a specific month (0-indexed like JavaScript Date)
export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  const holidays = getNorthIndianHolidays(year);
  return holidays.filter(holiday => 
    holiday.date.getMonth() === month
  );
}

// Gets all holidays applicable for a salary slip (typically national holidays)
export function getSalarySlipHolidays(year: number, month: number): Holiday[] {
  const holidays = getNorthIndianHolidays(year);
  return holidays.filter(holiday => 
    holiday.date.getMonth() === month && 
    (holiday.type === 'national' || holiday.type === 'regional')
  );
}