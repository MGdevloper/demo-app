import { onValue, orderByChild, push, query, ref, serverTimestamp, set } from 'firebase/database';
import { db } from '../firebaseConfig';

export async function createLostFoundItem(item) {
  const itemReference = push(ref(db, 'lostFoundItems'));

  if (!itemReference.key) {
    throw new Error('Unable to create an item reference.');
  }

  await set(itemReference, {
    ...item,
    id: itemReference.key,
    createdAt: serverTimestamp(),
  });

  return itemReference.key;
}

export function subscribeToActiveItems(onItems, onError) {
  const itemsQuery = query(
    ref(db, 'lostFoundItems'),
    orderByChild('status'),
  );

  return onValue(
    itemsQuery,
    (snapshot) => {
      const items = [];

      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();

        if (item?.status === 'active') {
          items.push({ ...item, id: item.id || childSnapshot.key });
        }
      });

      items.sort((firstItem, secondItem) => (secondItem.createdAt || 0) - (firstItem.createdAt || 0));
      onItems(items);
    },
    onError,
  );
}

export function subscribeToItem(itemId, onItem, onError) {
  return onValue(
    ref(db, `lostFoundItems/${itemId}`),
    (snapshot) => {
      const item = snapshot.val();
      onItem(item ? { ...item, id: item.id || snapshot.key } : null);
    },
    onError,
  );
}