import { View } from "@components/ui/view";
import { Text } from "@components/ui/text";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { SquareImage } from "@components/basic/squareImage";
import SuggestionPost from "@components/performer/suggestions";

export const FeedGrid = ({ feeds }) => {
  // console.log({ feedlength: feeds });

  
  return (
    <FlashList
      renderItem={({ item, index }) => {
        // return <Text>test</Text>
        return (
          // <View >
          //     <Text>test</Text>
          // </View>
          <>
            <GridPost feed={item} />
            
          </>
        );
      }}
      numColumns={3}
      estimatedItemSize={50}
      data={feeds}
    />
  );
};

const GridPost = ({ feed }) => {
  //   console.log({ feed: feed });
  return (
    <View style={{ backgroundColor: "green", height: 20 }}>
      <Text>{feed._id}</Text>
      {/* <SquareImage uri={feed?.objectInfo?.media?.url} size={100} /> */}
    </View>
  );
};
