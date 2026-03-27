import { Routes, Route } from 'react-router-dom';
// import MainLayout from '../layouts/MainLayout';
import RoleRoute from './RoleRoute.jsx';

// function AppRouter() {
//   return (
//     <Routes>
//       <Route path="/" element={<MainLayout />}>
//         <Route index element={<HomeDashboard />} />
//         <Route path="login" element={<Login />} />
//         <Route path="doctors" element={<DoctorsList />} />

//         <Route path="patient" element={
//             <RoleRoute allowedRoles={['patient']}>
//                 <PatientCabinet />
//             </RoleRoute>
//         }>
//             <Route path="records" element={<MedicalRecords />} />
//             <Route path="book" element={<BookAppointment />} />
//         </Route>

//         <Route path="doctor" element={
//             <RoleRoute allowedRoles={['doctor']}>
//                 <DoctorCabinet />
//             </RoleRoute>
//         }>
//             <Route path="schedule" element={<DoctorSchedule />} />
//             <Route path="patients" element={<PatientSearch />} />
//         </Route>

//       </Route>
//     </Routes>
//   );
// }

export default AppRouter;