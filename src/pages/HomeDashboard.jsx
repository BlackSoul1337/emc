import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import DoctorCard from '../components/DoctorCard';
import { useLanguage } from '../context/LanguageContext';
import { Activity, Users, CalendarCheck, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Loader from '../components/Loader';

function HomeDashboard() {
    const { t } = useLanguage();
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ totalDoctors: 0, appointmentsToday: 0 });
    const dashboardRef = useRef(null);

    // Mock data for the chart to simulate activity over the week
    const activityData = [
        { name: 'Mon', patients: 12 },
        { name: 'Tue', patients: 19 },
        { name: 'Wed', patients: 15 },
        { name: 'Thu', patients: 22 },
        { name: 'Fri', patients: 30 },
        { name: 'Sat', patients: 8 },
        { name: 'Sun', patients: 5 },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorsRes, statsRes] = await Promise.all([
                    api.get('/doctors'),
                    api.get('/stats/summary')
                ]);
                setDoctors(doctorsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load some dashboard data. Try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container" ref={dashboardRef}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }} className="fade-in">
                <Activity size={32} color="var(--primary)" />
                <h1 style={{ margin: 0 }}>{t('welcome')}</h1>
            </div>
            
            <div className="dashboard-grid fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '40px' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ backgroundColor: 'rgba(0,86,179,0.1)', padding: '15px', borderRadius: '50%' }}>
                        <Users size={32} color="var(--primary)" />
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', border: 'none', padding: 0 }}>{t('totalDoctors')}</h3>
                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalDoctors}</span>
                    </div>
                </div>
                
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ backgroundColor: 'rgba(40,167,69,0.1)', padding: '15px', borderRadius: '50%' }}>
                        <CalendarCheck size={32} color="var(--success)" />
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', border: 'none', padding: 0 }}>{t('appointmentsToday')}</h3>
                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.appointmentsToday}</span>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ backgroundColor: 'rgba(255,193,7,0.1)', padding: '15px', borderRadius: '50%' }}>
                        <Shield size={32} color="#ffc107" />
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', border: 'none', padding: 0 }}>{t('systemStats')}</h3>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--success)' }}>{t('operational')}</span>
                    </div>
                </div>
            </div>

            <div className="fade-in" style={{ marginBottom: '40px' }}>
                <h2>{t('weeklyActivity')}</h2>
                <div className="card" style={{ height: '300px', paddingTop: '20px' }}>
                    <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
                        <BarChart data={stats.weeklyActivity || activityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            {!isLoading && <Tooltip />}
                            <Bar dataKey="patients" fill={isLoading ? "var(--border)" : "var(--primary)"} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <h2 className="fade-in">{t('healthCare')}</h2>
            
            {isLoading && <Loader text={t('loadingDoctors')} />}
            {error && <p className="fade-in" style={{ color: 'var(--danger)' }}>{error}</p>}

            {!isLoading && !error && doctors.length === 0 && (
                <p className="fade-in">{t('noDoctors')}</p>
            )}

            {!isLoading && !error && doctors.length > 0 && (
                <ul className="dashboard-grid fade-in" style={{ listStyleType: 'none', padding: 0 }}>
                    {doctors.map((doctor) => (
                        <li key={doctor._id}>
                            <DoctorCard doctor={doctor} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default HomeDashboard;