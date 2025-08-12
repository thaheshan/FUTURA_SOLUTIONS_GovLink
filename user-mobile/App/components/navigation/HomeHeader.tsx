import { HStack } from "@components/ui/hstack";
import { VStack } from "@components/ui/vstack";
import { Text } from "@components/ui/text";
import React from "react";
import { HEADER_HEIGHT } from "@constants/Style";
import { SafeAreaView, StatusBar } from "react-native";
import { Heading } from "@components/ui/heading";
import { Icon } from "@components/ui/icon";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BellIcon, MoonIcon, SunIcon } from "lucide-react-native";
import { IS_ANDROID } from "@constants/Values";
import { useColorScheme } from "nativewind";
import { Button, ButtonIcon } from "@components/ui/button";
import { UiIcon } from "@components/base/UiIcon";

const HomeHeader = () => {
  const { setColorScheme, colorScheme } = useColorScheme();

  return (
    <SafeAreaView
      className="shadow-md"
      style={IS_ANDROID ? { paddingTop: StatusBar.currentHeight } : {}}
    >
      <HStack
        style={{ height: HEADER_HEIGHT }}
        className="items-center justify-between"
      >
        <VStack className="items-center">
          <Heading size="xl" className="justify-center p-3 dark:text-gray-100">
            InsiderHUB
          </Heading>
        </VStack>
        {/* <Icon as={Ionicons} name="notifications-outline" className="m-3 size-lg" /> */}
        <HStack className="items-center px-5" space="xl">
          <Button
            variant="link"
            onPress={() => {
              setColorScheme(colorScheme == "dark" ? "light" : "dark");
            }}
          >
            <ButtonIcon
              as={colorScheme == "dark" ? SunIcon : MoonIcon}
              // className="m-3 size-lg"
            />
          </Button>
          <Button
            variant="link"
            // onPress={() => {
            //   setColorScheme(colorScheme == "dark" ? "light" : "dark");
            // }}
          >
            <ButtonIcon
              as={BellIcon}
              // className="m-3 size-lg"
            />
          </Button>
        </HStack>
      </HStack>
    </SafeAreaView>
  );
};

export default HomeHeader;
