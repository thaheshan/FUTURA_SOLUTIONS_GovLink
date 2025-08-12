import React, {
  useCallback,
  useRef,
  useMemo,
  createContext,
  useState,
} from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import {
  BottomSheetBackgroundProps,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { commentService } from "@services";
import { ListComments } from "./list-comment";
import { IFeed } from "@interfaces";
import { Heading } from "@components/ui/heading";
import { Divider } from "@gluestack-ui/themed";
import CommentForm from "./comment-form";
import CustomBackdrop from "./backdrop";
import BottomSheetBackground from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackground";

interface CommentContext {
  handleClose: () => void;
  handleOpen: () => void;
}

const ThemeContext = createContext<CommentContext>({
  handleClose: () => {},
  handleOpen: () => {},
});

type Props = {
  children: React.ReactNode; //custom
  feed: IFeed; //custom
  objectType: string;
  objectId: string;
  limit?: number;
  offset?: number;
  canReply?: boolean;
};

const CommentWrapper = ({ children, feed, objectType, objectId }: Props) => {
  // hooks
  const sheetRef = useRef<BottomSheetModal>(null);

  const offsetRef = useRef(0);

  // variables
  //   const data = useMemo(
  //     () =>
  //       Array(50)
  //         .fill(0)
  //         .map((_, index) => `index-${index}`),
  //     []
  //   );
  const snapPoints = useMemo(() => ["65%", "95%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    sheetRef.current?.present();
  }, []);
  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);
  //   const handleSnapPress = useCallback((index: number) => {
  //     sheetRef.current?.snapToIndex(index);
  //   }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={10}>
        <View
          className="bg-slate-300 border border-slate-200 rounded-lg"
          style={{
            padding: 12,
            // margin: 12,
            borderRadius: 12,
            backgroundColor: "",
          }}
        >
          {/* <EmojiInput /> */}
          <CommentForm
            //TODO
            // objectId={} objectType={} onSuccess={} isReply={}
            objectId={objectId}
            objectType={objectType}
            onSuccess={() => {
              console.error("This is not implemented yet");
            }}
          />
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  return (
    <ThemeContext.Provider
      value={{
        handleClose: handleClosePress,
        handleOpen: handlePresentModalPress,
      }}
    >
      <View style={styles.container}>
        {/* <Button title="Snap To 90%" onPress={() => handlePresentModalPress()} /> */}
        {children}
        <BottomSheetModal
          onDismiss={() => console.log("dismissed")}
          backdropComponent={(props) => (
            <TouchableWithoutFeedback
              onPress={() => {
                console.log("backdrop pressed");
                sheetRef.current?.close();
              }}
            >
              <CustomBackdrop {...props} />
            </TouchableWithoutFeedback>
          )}
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          footerComponent={renderFooter}
          // backgroundStyle={{backgroundColor: "transparent"}}
          backgroundComponent={({ style }) => (
            <View style={style} className="bg-white dark:bg-gray-800" />
          )}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
            // className={"bg-white dark:bg-gray-800"}
          >
            <Heading size="lg" className="text-center">
              Comments
            </Heading>
            <Divider className="mx-2 w-full" />
            <ListComments
              offset={offsetRef.current}
              objectId={objectId}
              objectType="feed"
            />
            {/* {data.map(renderItem)} */}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </View>
    </ThemeContext.Provider>
  );
};

export const useCommentContext = (): CommentContext => {
  const context: CommentContext = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useCommentContext must be used within a CommentSheetProvider"
    );
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 200,
  },
  contentContainer: {
    // backgroundColor: "white",
    flex: 1,
    minHeight: 500,
  },
  itemContainer: {
    margin: 6,
    padding: 6,
    // backgroundColor: "#eee",
  },
});

export default CommentWrapper;
