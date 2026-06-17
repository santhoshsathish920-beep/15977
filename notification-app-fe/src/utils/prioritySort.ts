import { Log } from './logger';

export interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

const getWeight = (type: string): number => {
  const t = type.toLowerCase();
  if (t === 'placement') return 3;
  if (t === 'result') return 2;
  if (t === 'event') return 1;
  return 0; 
};

export const getPriorityInbox = (
  items: Notification[],
  limit: number
): Notification[] => {
  if (limit <= 0 || !items.length) return [];

  // log priority sort trigger
  Log('frontend', 'debug', 'utils', `Running priority sort on ${items.length} items`);

  // We only need the top N items, keeping a bounded array is faster than a full sort on huge streams
  const top: Notification[] = [];

  for (const item of items) {
    if (top.length < limit) {
      top.push(item);
      top.sort((a, b) => {
        const wA = getWeight(a.Type);
        const wB = getWeight(b.Type);
        if (wA !== wB) return wB - wA;
        return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
      });
    } else {
      const lowest = top[top.length - 1];
      const wItem = getWeight(item.Type);
      const wLowest = getWeight(lowest.Type);

      // check if incoming item beats our lowest priority stored item
      let shouldInsert = false;
      if (wItem > wLowest) {
        shouldInsert = true;
      } else if (wItem === wLowest) {
        if (new Date(item.Timestamp).getTime() > new Date(lowest.Timestamp).getTime()) {
          shouldInsert = true;
        }
      }

      if (shouldInsert) {
        top[top.length - 1] = item;
        top.sort((a, b) => {
          const wA = getWeight(a.Type);
          const wB = getWeight(b.Type);
          if (wA !== wB) return wB - wA;
          return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });
      }
    }
  }

  return top;
};
