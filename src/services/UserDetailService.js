import firebase from "./Firebase";

export class UserDetailService {
    static async getNameFromUid(uid) {
        let db = firebase.firestore();
        let doc = await db.collection("users").doc(uid).get();
        let data = doc.data();
        return data.firstName + " " + data.lastName;
    }
}