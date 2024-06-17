import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  update,
  remove,
  onValue,
  push,
} from "firebase/database";

const firebaseConfig = {
  projectId: "menu-react-db",
  projectName: "Menu React DB",
  projectNumber: "804639218740",
  databaseURL: "https://menu-react-db-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, update, remove, onValue, push };
