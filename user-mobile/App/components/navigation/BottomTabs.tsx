import React, { useContext } from "react";
import { Text } from "@components/ui/text";
import { VStack } from "@components/ui/vstack";
import { Pressable } from "@components/ui/pressable";
import { Icon } from "@components/ui/icon";
import { HStack } from "@components/ui/hstack";
import {
  Plus,
  Home,
  MessageCircle,
  User,
  SlidersHorizontal,
  Search,
} from "lucide-react-native";
import { useRouter } from "expo-router";

// import { ThemeContext } from "@/App";

const MobileBottomTabs = ({ bottomTabs, activeTab, setActiveTab }: any) => {
  //   const { colorMode } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [actionsheetVisible, setActionsheetVisible] = React.useState(false);
  const router = useRouter();

  return (
    // <>
      <HStack className="content-center justify-between w-full py-3 px-8 md:hidden pb-6 shadow-md background-white">
        {bottomTabs.map((tab: any) => {
          return (
            <Pressable
              key={tab.label}
              onPress={() => {
                if (tab.path) {
                  router.replace(tab.path);
                }

                if (tab.label !== "Listing" && tab.label !== "Filter") {
                  setActiveTab(tab.label);
                }
                if (tab.label === "Listing") {
                  setModalVisible(true);
                }
                if (tab.label === "Filter") {
                  setActionsheetVisible(true);
                }
              }}
              disabled={tab.disabled}
              //@ts-ignore
              opacity={tab.disabled ? 0.5 : 1}
            >
              <VStack className="items-center">
                <Icon
                  as={tab.icon}
                  size={25}
                  className={`${
                    activeTab === tab.label
                      ? "text-purple-500 dark:text-purple-500"
                      : "text-typography-600 dark:text-typography-400"
                  } m-2`}
                />
                {/* <Text
                  size="xs"
                  className={`${
                    activeTab === tab.label
                      ? "text-typography-900"
                      : "text-typography-400"
                  }`}
                >
                  {tab.label}
                </Text> */}
              </VStack>
            </Pressable>
          );
        })}
      </HStack>
    // </>
  );
};

const BottomTabs = () => {
  const [activeTab, setActiveTab] = React.useState("Home");

  const bottomTabs = [
    {
      icon: Home,
      label: "Home",
      path: "(home)/feed",
    },
    {
      icon: Search,
      label: "Search",
      path: '(home)/explore',
    },
    {
      icon: MessageCircle,
      label: "Message",
      path: "(home)/chat",
    },
    {
      icon: User,
      label: "Profile",
      path: "(home)/(profile)",
    },
  ];

  return (
    <MobileBottomTabs
      bottomTabs={bottomTabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
};

export default BottomTabs;
