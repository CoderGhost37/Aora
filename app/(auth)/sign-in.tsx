import { View, Text, ScrollView, Image, Dimensions, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import { Link, router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { getCurrentUser, signIn } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

export default function SignIn() {
    const { setUser, setIsLoggedIn } = useGlobalContext()
    const [form, setForm] = React.useState({
        email: "",
        password: "",
    })
    const [isPending, startTransition] = React.useTransition()

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields.')
        }

        startTransition(() => {
            (async () => {
                try {
                    await signIn(form.email, form.password)
                    const result = await getCurrentUser()
                    setUser(result)
                    setIsLoggedIn(true)

                    router.replace('/home')
                } catch (error: any) {
                    Alert.alert('Error', error.message)
                }
            })()
        });
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View
                    className="w-full flex justify-center min-h-[85vh] px-4 my-6"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}
                >
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        className="w-[115px] h-[34px]"
                    />

                    <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
                        Log in to Aora
                    </Text>

                    <FormField
                        title="Email"
                        placeholder='Enter your email'
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        placeholder='Enter your password'
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isPending}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link
                            href="/sign-up"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Signup
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}