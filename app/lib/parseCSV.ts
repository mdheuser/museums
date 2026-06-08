import Papa from 'papaparse';
import { inferGenderAndNationality, categorisePosition } from './nameAnalysis';

export interface Employee {
  name: string;
  position: string;
  positionCategory: string;
  museum: string;
  gender: string;
  nationality: string;
}

export async function loadEmployees(): Promise<Employee[]> {
  const res = await fetch('/employees.csv');
  const text = await res.text();

  const { data } = Papa.parse<{ name: string; position: string; museum: string }>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return data.map((row) => {
    const { gender, nationality } = inferGenderAndNationality(row.name);
    return {
      name: row.name,
      position: row.position,
      positionCategory: categorisePosition(row.position),
      museum: row.museum,
      gender,
      nationality,
    };
  });
}
