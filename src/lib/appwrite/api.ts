import { INewUser } from "../../types";
import { ID, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases } from "./config";
import { URL } from "url";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            imageUrl: avatarUrl,
            username: user.username
        });
        return newUser;

    } catch (error) {
        console.log('error:', error);
        return error;
    }
}

export async function saveUserToDB(user: { accountId: string; email: string; name: string; imageUrl: URL; username: string; }) {
    try {
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );
    } catch (error) {
        console.log('error:', error);
        return error;
    }
}

export async function signInAccount(user: { email: string; password: string;}) {
    try {
        return await account.createEmailSession(user.email, user.password)
    } catch (error) {
        console.log('error:', error);
        return error;
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get()

        if (!currentAccount)  throw Error

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error

        return currentUser.documents[0]
    } catch (error) {
        console.log('error:', error);
        return error;
    }
}