import type { Activity } from '@/entities/activity';

/**
 * Дерево видов деятельности (до 3 уровней).
 * Используется, пока бэкенд не предоставит GET /activities.
 */
export const MOCK_ACTIVITIES: Activity[] = [
    // Уровень 1
    { id: 1, name: 'Торговля', parent_id: null },
    { id: 2, name: 'Услуги', parent_id: null },
    { id: 3, name: 'Производство', parent_id: null },

    // Уровень 2 — Торговля
    { id: 11, name: 'Продукты питания', parent_id: 1 },
    { id: 12, name: 'Одежда и обувь', parent_id: 1 },
    { id: 13, name: 'Электроника', parent_id: 1 },

    // Уровень 2 — Услуги
    { id: 21, name: 'Общепит', parent_id: 2 },
    { id: 22, name: 'Ремонт', parent_id: 2 },
    { id: 23, name: 'Медицина', parent_id: 2 },

    // Уровень 2 — Производство
    { id: 31, name: 'Металлообработка', parent_id: 3 },
    { id: 32, name: 'Пищепром', parent_id: 3 },

    // Уровень 3 — Продукты питания
    { id: 111, name: 'Мясная продукция', parent_id: 11 },
    { id: 112, name: 'Молочная продукция', parent_id: 11 },
    { id: 113, name: 'Овощи и фрукты', parent_id: 11 },

    // Уровень 3 — Электроника
    { id: 131, name: 'Бытовая техника', parent_id: 13 },
    { id: 132, name: 'Компьютеры', parent_id: 13 },

    // Уровень 3 — Медицина
    { id: 231, name: 'Стоматология', parent_id: 23 },
    { id: 232, name: 'Терапия', parent_id: 23 },
];

/**
 * Стартовые мок-организации, привязанные к реальным зданиям (id 1..5).
 * Всё это живёт в localStorage и не отправляется на бэкенд.
 */
export const MOCK_ORGANIZATIONS: Array<{
    id: number;
    name: string;
    phones: Array<{ phone_number: string }>;
    building_id: number;
    activities: number[];
}> = [
    {
        id: -1,
        name: 'ООО «Рога и Копыта»',
        phones: [{ phone_number: '+7 (999) 123-45-67' }, { phone_number: '+7 (999) 765-43-21' }],
        building_id: 1,
        activities: [11, 111],
    },
    {
        id: -2,
        name: 'ИП Сидорова «Стоматология +»',
        phones: [{ phone_number: '+7 (863) 200-10-10' }],
        building_id: 2,
        activities: [23, 231],
    },
    {
        id: -3,
        name: 'ЗАО «ТехноМир»',
        phones: [{ phone_number: '+7 (800) 555-35-35' }],
        building_id: 3,
        activities: [1, 13, 131, 132],
    },
    {
        id: -4,
        name: 'Кафе «У дома»',
        phones: [{ phone_number: '+7 (863) 300-20-20' }],
        building_id: 4,
        activities: [2, 21],
    },
    {
        id: -5,
        name: 'ООО «МеталлПром»',
        phones: [{ phone_number: '+7 (863) 400-30-30' }],
        building_id: 5,
        activities: [3, 31],
    },
];