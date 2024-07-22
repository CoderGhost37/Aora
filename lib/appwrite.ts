import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite'

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

export const createUser = async (username: string, email: string, password: string) => {
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