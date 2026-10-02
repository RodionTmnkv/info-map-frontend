'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { useActivities, type Activity } from '@/entities/activity';
import { buildTree } from '@/shared/lib/tree';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/lib/utils';

interface Props {
    value: number | number[] | null;
    onChange: (value: number | number[] | null) => void;
    multiple?: boolean;
    disabled?: boolean;
}

export function ActivityTreeSelect({value, onChange, multiple = false, disabled,}: Props) {
    const { data: activities = [], isLoading } = useActivities();
    const tree = useMemo(() => buildTree(activities), [activities]);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    const selected = useMemo(() => {
        if (multiple) return new Set((value as number[]) ?? []);
        return new Set(value == null ? [] : [value as number]);
    }, [value, multiple]);

    const toggleExpand = (id: number) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleSelect = (id: number) => {
        if (disabled) return;
        if (multiple) {
            const arr = (value as number[]) ?? [];
            const next = arr.includes(id)
                ? arr.filter((x) => x !== id)
                : [...arr, id];
            onChange(next);
        } else {
            onChange(value === id ? null : id);
        }
    };

    if (isLoading) {
        return (
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
                Загрузка видов деятельности...
            </div>
        );
    }

    const renderNode = (node: Activity, depth: number) => {
        const hasChildren = (node.children?.length ?? 0) > 0;
        const isExpanded = expanded.has(node.id);
        const isSelected = selected.has(node.id);

        return (
            <div key={node.id}>
                <div
                    className={cn(
                        'flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50',
                        isSelected && 'bg-primary/10',
                        disabled && 'opacity-60',
                    )}
                    style={{ paddingLeft: `${depth * 20 + 8}px` }}
                >
                    {hasChildren ? (
                        <button
                            type="button"
                            onClick={() => toggleExpand(node.id)}
                            className="rounded p-0.5 hover:bg-muted"
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </button>
                    ) : (
                        <span className="w-4" />
                    )}

                    {hasChildren ? (
                        isExpanded ? (
                            <FolderOpen className="h-4 w-4 text-amber-500" />
                        ) : (
                            <Folder className="h-4 w-4 text-amber-500" />
                        )
                    ) : (
                        <span className="w-4" />
                    )}

                    <Checkbox
                        checked={isSelected}
                        disabled={disabled}
                        onCheckedChange={() => toggleSelect(node.id)}
                    />

                    <span
                        className="cursor-pointer select-none text-sm"
                        onClick={() => toggleSelect(node.id)}
                    >
            {node.name}
          </span>
                </div>

                {hasChildren && isExpanded && (
                    <div>
                        {node.children!.map((child) => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-h-80 overflow-auto rounded-md border p-2">
            {tree.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    Нет доступных видов деятельности
                </p>
            ) : (
                tree.map((node) => renderNode(node, 0))
            )}
        </div>
    );
}