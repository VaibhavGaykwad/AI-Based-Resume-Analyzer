import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a PDF file to Firebase Storage under resumes/{userId}/{timestamp}_{fileName}
 * and returns the public download URL.
 * @param {File} file - The PDF File object to upload
 * @param {string} userId - The authenticated user's UID
 * @returns {Promise<string>} Download URL
 */
export async function uploadPDF(file, userId) {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `resumes/${userId}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
}

/**
 * Uploads a screenshot to Firebase Storage.
 * @param {File} file
 * @param {string} userId
 * @returns {Promise<string>}
 */
export async function uploadScreenshot(file, userId) {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `feedback/${userId}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
}
