import React from 'react';
import { Alert } from 'react-native';
import { Models } from 'react-native-appwrite';

export const useAppwrite = (fn: () => Promise<Models.Document[]>) => {

    const [data, setData] = React.useState<Models.Document[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fn()
            setData(res)
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData();

    return { data, isLoading, refetch }
}