import { getFirestore, doc, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

async function addAddress(addressData) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not signed in");
  }
  const addressesRef = collection(db, "users", user.uid, "addresses");
  await addDoc(addressesRef, {
    uid: user.uid,
    name: addressData.name,
    phone: addressData.phone,
    addressLine1: addressData.addressLine1,
    city: addressData.city,
    state: addressData.state,
    pincode: addressData.pincode,
    country: addressData.country
  });
}