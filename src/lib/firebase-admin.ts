import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function setUserAsAuthor(email: string) {
  try {
    const userRef = doc(db, "users", email);
    await setDoc(userRef, {
      isAuthor: true,
      updatedAt: new Date(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error setting user as author:", error);
    return false;
  }
}

export async function removeUserAsAuthor(email: string) {
  try {
    const userRef = doc(db, "users", email);
    await setDoc(userRef, {
      isAuthor: false,
      updatedAt: new Date(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error removing user as author:", error);
    return false;
  }
}

export async function checkIfUserIsAuthor(email: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() && userDoc.data()?.isAuthor === true;
  } catch (error) {
    console.error("Error checking author status:", error);
    return false;
  }
}
