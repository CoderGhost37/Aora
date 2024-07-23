import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite'
import * as ImagePicker from "expo-image-picker";

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.personal.aora',
    projectId: '669e17a5000651d9b052',
    databaseId: '669e1adb002206e49e4c',
    userCollectionId: '669e1aff00158a4a0b72',
    videoCollectionId: '669e1b41001691e97681',
    storageId: '669e3b89002763801590'
}

const client = new Client()

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export async function createUser(username: string, email: string, password: string) {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username)

        if (!newAccount) {
            throw new Error('Failed to create account')
        }

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
        })

        return newUser
    } catch (error) {
        console.log(error)
        throw new Error('Something went wrong.')
    }
}

export async function signIn(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session
    } catch (error) {
        console.log(error)
        throw new Error('Something went wrong.')
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get()

        if (!currentAccount) {
            throw new Error('User not found')
        }

        const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal('accountId', currentAccount.$id)])

        if (!currentUser) {
            throw new Error('User not found')
        }

        return currentUser
    } catch (error) {
        throw new Error('User not found')
    }
}

export async function getAllPosts() {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId)

        return posts.documents
    } catch (error) {
        throw new Error('Failed to fetch posts')
    }
}

export async function getLatestPosts() {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, [Query.orderDesc('$createdAt'), Query.limit(7)])

        return posts.documents
    } catch (error) {
        throw new Error('Failed to fetch posts')
    }
}

export async function searchPosts(query: string) {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, [Query.search('title', query)])

        return posts.documents
    } catch (error) {
        throw new Error('Failed to fetch posts')
    }
}

export async function getUserPosts(userId: string) {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, [Query.equal('creator', userId)])

        return posts.documents
    } catch (error) {
        throw new Error('Failed to fetch posts.')
    }
}

export async function signOut() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error("Failed to sign out");
    }
}

export async function getFilePreview(fileId: string, type: string) {
    let fileUrl
    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, ImageGravity.Top, 100)
        } else {
            throw new Error('Invalid file type')
        }

        if (!fileUrl) {
            throw new Error('Failed to fetch file')
        }

        return fileUrl
    } catch (error) {
        throw new Error('Failed to fetch file')
    }
}

export async function uploadFile(file: ImagePicker.ImagePickerAsset, type: string) {
    try {
        if (!file) {
            throw new Error('No file provided')
        }

        const asset = {
            name: file.fileName as string,
            type: file.mimeType as string,
            size: file.fileSize as number,
            uri: file.uri
        }

        const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), asset)

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
    } catch (error) {
        throw new Error('Failed to upload file')
    }
}

export async function createVideoPost(form: {
    title: string;
    video: ImagePicker.ImagePickerAsset | null;
    thumbnail: ImagePicker.ImagePickerAsset | null;
    prompt: string;
}, userId: string) {
    if (form.prompt === "" || form.title === "" || !form.thumbnail || !form.video) {
        throw new Error("Please provide all fields");
    }
    try {
        const [thumbnail, video] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])

        const newPost = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, ID.unique(), {
            title: form.title,
            prompt: form.prompt,
            thumbnail,
            video,
            creator: userId
        })

        return newPost
    } catch (error) {
        throw new Error("Failed to sign out");
    }
}