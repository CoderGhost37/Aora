import { View, Text, ScrollView, Image, Dimensions, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import { Link, router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'

import { createUser } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

export default function SignUp() {
    const { setUser, setIsLoggedIn } = useGlobalContext()
    const [form, setForm] = React.useState({
        username: "",
        email: "",
        password: "",
    })
    const [isPending, startTransition] = React.useTransition()

    const submit = async () => {
        if (!form.email || !form.password || !form.username) {
            Alert.alert('Error', 'Please fill in all the fields.')
        }

        startTransition(() => {
            (async () => {
                try {
                    const result = await createUser(form.username, form.email, form.password)
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
                        Sign up to Aora
                    </Text>

                    <FormField
                        title="Username"
                        placeholder='Enter your username'
                        value={form.username}
                        handleChangeText={(e) => setForm({ ...form, username: e })}
                        otherStyles="mt-7"
                    />

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
                        title="Sign Up"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isPending}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Already have an account?
                        </Text>
                        <Link
                            href="/sign-in"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Sign In
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}