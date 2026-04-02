import React, { createContext, useState, useContext } from 'react';

const translations = {
    ru: {
        main: "Главная", patientCard: "Медицинская карта", doctorCabinet: "Кабинет врача",
        adminPanel: "Панель админа", logout: "Выйти", login: "Войти", register: "Регистрация",
        welcome: "ДОБРО ПОЖАЛОВАТЬ", totalDoctors: "Всего врачей", totalPatients: "Всего пациентов",
        appointmentsToday: "Приемов сегодня", systemStats: "Статистика системы",
        healthCare: "Мы заботимся о вашем здоровье. Выберите подходящего специалиста:",
        loadingDoctors: "Анализ базы врачей...", noDoctors: "На данный момент нет доступных врачей.",
        email: "Электронная почта", password: "Пароль", firstName: "Имя", lastName: "Фамилия",
        phone: "Телефон", iin: "ИИН", myProfile: "Мой профиль", editProfile: "Редактировать профиль",
        save: "Сохранить", cancel: "Отмена", uploadAvatar: "Загрузить новый Аватар",
        makeAppointment: "Записаться на прием", chooseDoctor: "Выберите врача: *",
        dateTimeSlot: "Слот даты и времени: *", symptomsOptional: "Симптомы (необязательно):",
        signUp: "Записаться", saving: "Сохранение...", myMedicalCard: "Моя медицинская карта / Записи",
        noAppointmentsYet: "У вас еще нет записей к врачу.", status: "Статус",
        doctorNotes: "Заметки врача / Вши симптомы:", labResults: "Результаты анализов от врача:",
        cancelRecording: "Отменить запись", manageSchedule: "Управление моим расписанием (Свободные слоты)",
        generateSlot: "Сгенерировать слот", patientSearch: "Поиск пациента:",
        upcomingAppointments: "Предстоящие приемы", historyAppointments: "История приемов",
        fillProtocol: "Заполнить протокол / Изменить статус", editingReception: "Редактирование приема",
        conclusion: "Заключение / Рекомендации:", attachResult: "Загрузить результат / скан:",
        scheduled: "Запланирован", completed: "Завершен", cancelled: "Отменен", requireEmailAuth: "Требовать подтверждение Email для Пациентов",
        emailVerificationON: "Подтверждение Email ВКЛЮЧЕНО", emailVerificationOFF: "Подтверждение Email ВЫКЛЮЧЕНО",
        createNewDoctor: "Создать профиль нового врача", specialization: "Специализация", expYears: "Опыт работы (лет)",
        doNotHaveAccount: "Нет аккаунта?", loginToAccount: "Войдите в аккаунт", 
        alreadyHaveAccount: "Уже есть аккаунт?", registerApp: "Зарегистрироваться",
        weeklyActivity: "Обзор активности за неделю", operational: "Стабильно", enterLastNameOrIIN: "Введите Фамилию или ИИН",
        noScheduled: "Нет активных запланированных приемов.", noHistory: "Нет завершенных или отмененных приемов.",
        noSlots: "У вас пока нет доступных слотов.", policy: "Политика конфиденциальности", tos: "Пользовательское Соглашение",
        support: "Служба поддержки", loadingString: "Загрузка данных...", loadingSchedule: "Загрузка расписания...",
        turnOnEmailAuth: "ВКЛЮЧИТЬ подтверждение", turnOffEmailAuth: "ОТКЛЮЧИТЬ подтверждение",
        allAppointments: "Все приемы в системе", dateTable: "Дата", patientTable: "Пациент", doctorTable: "Врач", actionTable: "Действие",
        deleteAction: "Удалить", cannotDeleteActive: "Нельзя удалять активные", noApptsInSystem: "В системе еще нет приемов."
    },
    en: {
        main: "Home", patientCard: "Medical Card", doctorCabinet: "Doctor's Cabinet",
        adminPanel: "Admin Panel", logout: "Logout", login: "Login", register: "Register",
        welcome: "WELCOME", totalDoctors: "Total Doctors", totalPatients: "Total Patients",
        appointmentsToday: "Appointments Today", systemStats: "System Statistics",
        healthCare: "We care about your health. Choose a suitable specialist:",
        loadingDoctors: "Loading list of doctors...", noDoctors: "There are no available doctors at the moment.",
        email: "Email", password: "Password", firstName: "First Name", lastName: "Last Name",
        phone: "Phone", iin: "IIN", myProfile: "My Profile", editProfile: "Edit Profile",
        save: "Save", cancel: "Cancel", uploadAvatar: "Upload new Avatar",
        makeAppointment: "Make an Appointment", chooseDoctor: "Choose a doctor: *",
        dateTimeSlot: "Date and time slot: *", symptomsOptional: "Symptoms (optional):",
        signUp: "Sign Up", saving: "Saving...", myMedicalCard: "My Medical Card / Records",
        noAppointmentsYet: "You have no appointments yet.", status: "Status",
        doctorNotes: "Doctor Notes / Your symptoms:", labResults: "Lab Results / Scans from Doctor:",
        cancelRecording: "Cancel recording", manageSchedule: "Manage My Schedule (Available Slots)",
        generateSlot: "Generate Slot", patientSearch: "Patient search:",
        upcomingAppointments: "Upcoming Appointments", historyAppointments: "History of Appointments",
        fillProtocol: "Fill protocol / Change status", editingReception: "Editing Reception",
        conclusion: "Conclusion / Recommendations:", attachResult: "Upload result / scan:",
        scheduled: "Scheduled", completed: "Completed", cancelled: "Cancelled", requireEmailAuth: "Require Email verification for Patients",
        emailVerificationON: "Email Verification is ON", emailVerificationOFF: "Email Verification is OFF",
        createNewDoctor: "Create new Doctor profile", specialization: "Specialization", expYears: "Experience (years)",
        doNotHaveAccount: "Don't have an account?", loginToAccount: "Login to account",
        alreadyHaveAccount: "Already have an account?", registerApp: "Register",
        weeklyActivity: "Weekly Activity Overview", operational: "Operational", enterLastNameOrIIN: "Enter LastName or IIN",
        noScheduled: "No active scheduled appointments.", noHistory: "No completed or cancelled appointments.",
        noSlots: "You have no available slots generated yet.", policy: "Privacy Policy", tos: "Terms of Service",
        support: "Contact Support", loadingString: "Loading data...", loadingSchedule: "Loading the schedule...",
        turnOnEmailAuth: "TURN ON Verification", turnOffEmailAuth: "TURN OFF Verification",
        allAppointments: "All Appointments", dateTable: "Date", patientTable: "Patient", doctorTable: "Doctor", actionTable: "Action",
        deleteAction: "Delete", cannotDeleteActive: "Cannot delete active", noApptsInSystem: "No appointments in the system."
    }
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

    const switchLang = (newLang) => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    const t = (key) => translations[lang][key] || key;

    return (
        <LanguageContext.Provider value={{ lang, switchLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);