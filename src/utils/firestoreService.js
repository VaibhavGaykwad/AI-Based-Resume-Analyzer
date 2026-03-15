import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';

const ANALYSES_COLLECTION = 'analyses';

/**
 * Saves a completed resume analysis to Firestore.
 * @param {string} userId
 * @param {string} fileName
 * @param {string} pdfUrl - Firebase Storage download URL (may be empty string if upload failed)
 * @param {object} analysisData - Full Gemini JSON result
 * @returns {Promise<string>} Document ID of the saved record
 */
export async function saveAnalysis(userId, fileName, pdfUrl, analysisData) {
    const docRef = await addDoc(collection(db, ANALYSES_COLLECTION), {
        userId,
        fileName,
        pdfUrl,
        analysisData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Fetches the most recent analyses for a given user.
 * @param {string} userId
 * @param {number} [maxResults=5]
 * @returns {Promise<Array>} Array of analysis objects with an `id` field
 */
export async function getUserAnalyses(userId, maxResults = 5) {
    const q = query(
        collection(db, ANALYSES_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(maxResults)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to a plain JS Date for easy rendering
        createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
    }));
}
