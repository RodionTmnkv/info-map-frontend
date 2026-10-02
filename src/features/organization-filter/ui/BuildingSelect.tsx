'use client';

import { useBuildings } from '@/entities/building';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';

interface Props {
    value: number | null;
    onChange: (value: number | null) => void;
    placeholder?: string;
    className?: string;
    allowAll?: boolean;
    disabled?: boolean;
}

const ALL_VALUE = '__all__';

export function BuildingSelect({
                                   value,
                                   onChange,
                                   placeholder,
                                   className,
                                   allowAll = false,
                                   disabled,
                               }: Props) {
    const { data, isLoading } = useBuildings();

    const effectivePlaceholder =
        placeholder ?? (allowAll ? 'Все здания' : 'Выберите здание');

    /**
     * Base UI Select строго различает uncontrolled (undefined) и
     * controlled (null | string). Передаём null для пустого значения,
     * а не undefined — иначе React ругается при первом выборе.
     */
    const selectValue: string | null =
        value == null ? (allowAll ? ALL_VALUE : null) : String(value);

    return (
        <Select
            value={selectValue}
            onValueChange={(v) => {
                if (v == null || v === ALL_VALUE) {
                    onChange(null);
                } else {
                    onChange(Number(v));
                }
            }}
            disabled={disabled || isLoading}
        >
            <SelectTrigger className={className ?? 'w-72'}>
                <SelectValue
                    placeholder={isLoading ? 'Загрузка...' : effectivePlaceholder}
                />
            </SelectTrigger>
            <SelectContent>
                {allowAll && (
                    <SelectItem value={ALL_VALUE}>{effectivePlaceholder}</SelectItem>
                )}
                {data?.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                        {b.address}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}