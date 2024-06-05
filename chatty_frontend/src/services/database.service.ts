import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { finalize, from, map, Observable, tap } from 'rxjs';
import { Product } from 'src/models/product';
import { child, Database, equalTo, get, getDatabase, orderByChild, orderByKey, orderByValue, query, QueryConstraint, ref, remove, set, startAt, update } from "firebase/database";
import { getAuth, signInAnonymously, signInWithCustomToken, signInWithEmailAndPassword } from 'firebase/auth';
import { ShoppingListItem } from 'src/models/shopping-list-item';

interface DBStructure {
    PRODUCTS: Product;
    SHOPPING_LIST_ITEMS: ShoppingListItem
};





@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    private app: FirebaseApp;

    private database: Database;

    constructor() {
        // TODO: Replace the following with your app's Firebase project configuration
        // See: https://firebase.google.com/docs/web/learn-more#config-object
        const firebaseConfig = {
            apiKey: "AIzaSyBx6XDbzta8V3h9JeXJVTDXZGADvgCvfko",
            authDomain: "chatty.firebaseapp.com",
            databaseURL: "https://chatty-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "chatty",
            storageBucket: "chatty.appspot.com",
            messagingSenderId: "57126928367",
            appId: "1:57126928367:web:168fcdccba5d269a8d801a",
        };

        // Initialize Firebase
        this.app = initializeApp(firebaseConfig);


        // Initialize Realtime Database and get a reference to the service
        this.database = getDatabase(this.app);

        const auth = getAuth();
        signInWithEmailAndPassword(auth, 'a@a.com', '123456')
            .then(_ => {
                console.log('Logged in: ', _);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
            });
    }

    public add(tableName: keyof DBStructure, entityToAdd: DBStructure[keyof DBStructure]): Observable<void> {
        document.getElementById('loadingSpinner')!.style.display = 'block';
        return from(set(ref(this.database, `${tableName}/` + entityToAdd.id), entityToAdd)).pipe(
            finalize(() => {
                document.getElementById('loadingSpinner')!.style.display = 'none';
            })
        );
    }

    public getAll$<T>(tableName: keyof DBStructure): Observable<T[]> {
        document.getElementById('loadingSpinner')!.style.display = 'block';
        const dbRef = ref(this.database);

        return from(get(child(dbRef, `${tableName}`))).pipe(
            map(snapshot => snapshot.val()),
            map(val => val ?? {}),
            map(val => Object.values(val) as T[]),
            tap(c => console.log(c)),
            finalize(() => {
                document.getElementById('loadingSpinner')!.style.display = 'none';
            })
        )
    }

    public edit(tableName: keyof DBStructure, modifiedEntity: DBStructure[keyof DBStructure]): Observable<void> {
        document.getElementById('loadingSpinner')!.style.display = 'block';
        return from(update(ref(this.database, `${tableName}/` + modifiedEntity.id), modifiedEntity)).pipe(
            finalize(() => {
                document.getElementById('loadingSpinner')!.style.display = 'none';
            })
        );
    }
    public deleteById(tableName: keyof DBStructure, id: string): Observable<void> {
        document.getElementById('loadingSpinner')!.style.display = 'block';
        orderByValue();
        return from(remove(ref(this.database, `${tableName}/` + id))).pipe(
            finalize(() => {
                document.getElementById('loadingSpinner')!.style.display = 'none';
            })
        )


        // const q = query(collection(db, 'your_collection'), where('attribute', '==', 'value'));
        // const querySnapshot = await getDocs(q);

        // querySnapshot.forEach(doc => {
        //     // Delete the entity
        //     deleteDoc(doc.ref);
        // });
    }

    public getByCondition$<T>(tableName: keyof DBStructure, ...conditions: QueryConstraint[]): Observable<T[]> {
        console.log('CONDITIONS', conditions);
        document.getElementById('loadingSpinner')!.style.display = 'block';
        const dbRef = child(ref(this.database), tableName);
        const filteredDataRef = query(dbRef, ...conditions);

        return from(get(filteredDataRef)).pipe(
            map(snapshot => snapshot.val()),
            map(val => val ?? {}),
            map(val => Object.values(val) as T[]),
            tap(c => console.log(c)),
            finalize(() => {
                document.getElementById('loadingSpinner')!.style.display = 'none';
            })
        )
    }

    // For this to work, the 'keyName' has to be added to the db rules:
    // https://firebase.google.com/docs/database/security/indexing-data
    public getByTextFilter$<T>(tableName: keyof DBStructure, filterText: string, keyName: string): Observable<T[]> {
        return this.getByCondition$(tableName, orderByChild(keyName), startAt(filterText));
    }
}
