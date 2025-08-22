
import { Notification } from './types';
import MOCK_NOTIFICATIONS from './data/notifications.json';


export const MOCK_FACULTY = [
    { value: 'Dr. Evelyn Reed', label: 'Dr. Evelyn Reed' },
    { value: 'Professor Samuel Grant', label: 'Professor Samuel Grant' },
    { value: 'Dr. Olivia Chen', label: 'Dr. Olivia Chen' },
    { value: 'Mr. Benjamin Carter', label: 'Mr. Benjamin Carter' },
    { value: 'Ms. Isabella Flores', label: 'Ms. Isabella Flores' },
    { value: 'Dr. Mason Hayes', label: 'Dr. Mason Hayes' },
];

export const MOCK_STUDENT_NOTIFICATIONS: Notification[] = MOCK_NOTIFICATIONS.filter(n => n.id.startsWith('student'));
export const MOCK_ADMIN_NOTIFICATIONS: Notification[] = MOCK_NOTIFICATIONS.filter(n => n.id.startsWith('admin'));
