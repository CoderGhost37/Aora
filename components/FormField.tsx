import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "@/constants";

interface FormFieldProps {
    title: string;
    value: string;
    placeholder: string;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    handleChangeText: (text: string) => void;
    otherStyles?: string;
}

export default function FormField({
    title,
    value,
    placeholder,
    keyboardType = "default",
    handleChangeText,
    otherStyles,
    ...props
}: FormFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
                <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7B7B8B"
                    keyboardType={keyboardType}
                    onChangeText={handleChangeText}
                    secureTextEntry={title === "Password" && !showPassword}
                    {...props}
                />

                {title === "Password" && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            source={!showPassword ? icons.eye : icons.eyeHide}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};