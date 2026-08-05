/* eslint-disable no-unused-vars */
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
    doc,
    deleteDoc,
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
        where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to a plain JS Date for easy rendering
        createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
    }));

    // Client-side sort by createdAt desc
    results.sort((a, b) => b.createdAt - a.createdAt);

    return results.slice(0, maxResults);
}

export async function deleteAnalysis(analysisId) {
    console.log('[deleteAnalysis] Starting delete for ID:', analysisId);
    try {
        const docRef = doc(db, ANALYSES_COLLECTION, analysisId);
        console.log('[deleteAnalysis] Doc ref path:', docRef.path);
        await deleteDoc(docRef);
        console.log('[deleteAnalysis] SUCCESS — document deleted:', analysisId);
    } catch (err) {
        console.error('[deleteAnalysis] FAILED — code:', err.code, 'message:', err.message);
        console.error('[deleteAnalysis] Full error:', err);
        throw err; // re-throw so caller can handle
    }
}

/**
 * Saves a feedback item to Firestore.
 * @param {object} feedbackData
 * @returns {Promise<string>}
 */
export async function saveFeedback(feedbackData) {
    const docRef = await addDoc(collection(db, 'feedback'), {
        ...feedbackData,
        createdAt: serverTimestamp(),
        status: 'new',
    });
    return docRef.id;
}
