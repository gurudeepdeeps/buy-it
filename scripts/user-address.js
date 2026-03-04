import { getFirestore, doc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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