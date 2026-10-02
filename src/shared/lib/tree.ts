import type { Activity } from '@/entities/activity';

export function buildTree(flat: Activity[]): Activity[] {
  const map = new Map<number, Activity>();
  const roots: Activity[] = [];

  flat.forEach((a) => map.set(a.id, { ...a, children: [] }));

  flat.forEach((a) => {
    const node = map.get(a.id)!;
    if (a.parent_id != null && map.has(a.parent_id)) {
      map.get(a.parent_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export function flattenTree(
    tree: Activity[],
    depth = 0,
): Array<{ item: Activity; depth: number }> {
  return tree.flatMap((node) => [
    { item: node, depth },
    ...flattenTree(node.children ?? [], depth + 1),
  ]);
}

export function collectDescendantIds(node: Activity): number[] {
  const ids: number[] = [node.id];
  (node.children ?? []).forEach((c) => {
    ids.push(...collectDescendantIds(c));
  });
  return ids;
}