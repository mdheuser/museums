'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { loadEmployees, Employee } from '../lib/parseCSV';
import StatCard from './StatCard';

const PALETTE = [
  '#4f8ef7', '#f7c948', '#e05252', '#4ecb8d', '#a78bfa',
  '#f97316', '#06b6d4', '#ec4899', '#84cc16', '#f59e0b',
  '#6366f1', '#14b8a6',
];

function countBy(data: Employee[], key: keyof Employee): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  data.forEach((e) => {
    const k = e[key] as string;
    map[k] = (map[k] ?? 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}

function pct(n: number, total: number) {
  return total ? `${((n / total) * 100).toFixed(1)}%` : '0%';
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-box">
      <p className="tooltip-name">{payload[0].name}</p>
      <p className="tooltip-value">{payload[0].value} people</p>
    </div>
  );
};

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedMuseum, setSelectedMuseum] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees().then((data) => { setEmployees(data); setLoading(false); });
  }, []);

  const museums = useMemo(() => ['All', ...Array.from(new Set(employees.map((e) => e.museum)))], [employees]);

  const filtered = useMemo(
    () => selectedMuseum === 'All' ? employees : employees.filter((e) => e.museum === selectedMuseum),
    [employees, selectedMuseum]
  );

  const genderData   = useMemo(() => countBy(filtered, 'gender'), [filtered]);
  const nationalData = useMemo(() => countBy(filtered, 'nationality'), [filtered]);
  const positionData = useMemo(() => countBy(filtered, 'positionCategory'), [filtered]);
  const museumData   = useMemo(() => countBy(employees, 'museum'), [employees]);

  const femaleCount = filtered.filter((e) => e.gender === 'Female').length;
  const foreignCount = filtered.filter((e) => e.nationality !== 'Finnish' && e.nationality !== 'Finnish-Swedish').length;

  if (loading) {
    return <div className="loading">Loading data…</div>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dash-header">
        <h1 className="dash-title">Art Museum Staff Dashboard</h1>
        <p className="dash-subtitle">
          Name-based inference of gender &amp; nationality across Finnish art museums
        </p>
        <p className="dash-note">
          Based on research by sociologist Akhlaq Ahmad on name-based discrimination in hiring.
        </p>
      </header>

      {/* Museum filter */}
      <div className="filter-row">
        {museums.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMuseum(m)}
            className={`filter-btn${selectedMuseum === m ? ' active' : ''}`}
          >
            {m === 'All' ? 'All Museums' : m.replace(' Art Museum', '').replace(' Museum of Contemporary Art', ' (Kiasma)')}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="stats-row">
        <StatCard label="Total Staff" value={filtered.length} />
        <StatCard label="Female" value={femaleCount} sub={pct(femaleCount, filtered.length)} />
        <StatCard label="Male" value={filtered.length - femaleCount} sub={pct(filtered.length - femaleCount, filtered.length)} />
        <StatCard label="Foreign-origin names" value={foreignCount} sub={pct(foreignCount, filtered.length)} />
        <StatCard label="Nationalities detected" value={new Set(filtered.map((e) => e.nationality)).size} />
      </div>

      {/* Charts grid */}
      <div className="charts-grid">
        {/* Gender pie */}
        <div className="chart-card">
          <h2 className="chart-title">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {genderData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Position categories */}
        <div className="chart-card">
          <h2 className="chart-title">Position Categories</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={positionData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" tick={{ fill: '#aaa', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#ccc', fontSize: 11 }} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {positionData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Nationality bar */}
        <div className="chart-card chart-card--wide">
          <h2 className="chart-title">Name-origin (Inferred Nationality)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nationalData} margin={{ left: 10, right: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" tick={{ fill: '#ccc', fontSize: 11 }} angle={-25} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: '#aaa', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {nationalData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Museum staff count */}
        {selectedMuseum === 'All' && (
          <div className="chart-card chart-card--wide">
            <h2 className="chart-title">Staff Count per Museum</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={museumData} margin={{ left: 10, right: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" tick={{ fill: '#ccc', fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: '#aaa', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#4f8ef7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Employee table */}
      <div className="table-section">
        <h2 className="chart-title">Employee List</h2>
        <div className="table-wrapper">
          <table className="emp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Category</th>
                <th>Museum</th>
                <th>Gender</th>
                <th>Name Origin</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={i} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td>{e.name}</td>
                  <td>{e.position}</td>
                  <td><span className="badge">{e.positionCategory}</span></td>
                  <td className="museum-cell">{e.museum.replace(' Art Museum','').replace(' Museum of Contemporary Art',' (Kiasma)')}</td>
                  <td className={`gender-cell gender-${e.gender.toLowerCase()}`}>{e.gender}</td>
                  <td>{e.nationality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="dash-footer">
        Data inferred from names using heuristic lookup tables. Gender and nationality classifications are probabilistic, not definitive.
      </footer>
    </div>
  );
}
