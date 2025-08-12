// // import Post from "./post";

// // const Feed = () => {
// //   return <Post />;
// // };

// // export default Feed;

// import { IFeed } from "@interfaces/index";
// import { showError } from "@lib/utils";
// import { feedService } from "@services/feed.service";
// // import { Alert, Spin } from "antd";
// import { useEffect, useRef, useState } from "react";
// // import InfiniteScroll from "react-infinite-scroll-component";

// import { reactionService } from "@services/reaction.service";
// // import dynamic from "next/dynamic";
// // import style from "./scroll-list.module.scss";
// // import { useColorModeValue } from "src/constants/theme";
// import { Text } from "@components/ui/text";

// // const FeedCard = dynamic(() => import("./card/feed-card"));
// // const FeedGridCard = dynamic(() => import("./card/grid-card"));

// //custom
// // const SuggestionPost = dynamic(
// //   () => import("@components/performer/c-suggestion-post")
// // );

// import { FlashList } from "@shopify/flash-list";
// import Post from "./post";
// import MobileBottomTabs from "@components/navigation/BottomTabs";
// import { MainNavigationLayout } from "@components/layouts/MainNavigationLayout";
// import { Divider } from "@components/ui/divider";
// import { FeedGrid } from "./feedGrid";
// import CommentSheet from "./comments";
// import { UiDivider } from "@components/base/Divider";
// import SuggestionPost from "@components/performer/suggestions";

// interface IProps {
//   query: any; // todo - defind interface
//   isGrid?: boolean;
//   getTotal?: Function;
//   isBookmark?: boolean;
// }

// function ScrollListFeed({
//   isGrid = false,
//   getTotal = () => {},
//   isBookmark = false,
//   query,
// }: IProps) {
//   const [fetching, setFetching] = useState(true);
//   const [feeds, setItems] = useState<IFeed[]>([]);
//   const [total, setTotal] = useState(0);
//   const offset = useRef<number>(0);

//   const getItems = async (more = false) => {
//     try {
//       setFetching(true);
//       const resp = isBookmark
//         ? await reactionService.getBookmarks("feeds", {
//             limit: 12,
//             offset: offset.current * 12,
//           })
//         : await feedService.userSearch({
//             limit: 12,
//             offset: offset.current * 12,
//             ...query,
//           });
//       !more
//         ? setItems(resp.data.data)
//         : setItems([...feeds, ...resp.data.data]);
//       setTotal(resp.data.total);
//       getTotal && getTotal(resp.data.total);
//     } catch (e) {
//       showError(e);
//     } finally {
//       setFetching(false);
//     }
//   };

//   const getMore = () => {
//     if (Math.round(total / 12) === offset.current) return;
//     offset.current += 1;
//     getItems(true);
//   };

//   useEffect(() => {
//     offset.current = 0;
//     getItems();
//   }, [JSON.stringify(query)]);

//   const randomPostFrequencyCalc = () => {
//     return Math.random() < 0.3;
//   };

//   interface Props {
//     item: IFeed;
//   }

//   if (isGrid) {
//     return <FeedGrid feeds={feeds} />;
//   }

//   return (
//     <FlashList
//       renderItem={({ item, index }) => {
//         return (
//           <>
//             {index != 0 && <UiDivider className="h-1" />}
//             <Post feed={item} />
//             {randomPostFrequencyCalc() && (
//               <>
//                 <UiDivider className="h-1" />
//                 {/* random creator */}
//                 <SuggestionPost />
//               </>
//             )}
//           </>
//         );
//       }}
//       estimatedItemSize={50}
//       data={feeds}
//     />
//   );

//   // return (
//   //   <InfiniteScroll
//   //     dataLength={feeds.length}
//   //     hasMore={total > feeds.length}
//   //     loader={null}
//   //     next={() => {
//   //       !fetching && getMore();
//   //     }}
//   //     endMessage={null}
//   //     scrollThreshold={0.7}
//   //     // scrollableTarget="primaryLayout"
//   //   >
//   //     <div
//   //       className={isGrid ? style["grid-view"] : style["fixed-scroll"]}
//   //       style={{
//   //         backgroundColor: useColorModeValue("white", "black"),
//   //       }}
//   //     >
//   //       {feeds?.map((item: any) => {
//   //         if (isGrid) {
//   //           return <FeedGridCard feed={item} key={item._id} />;
//   //         }
//   //         return (
//   //           <>
//   //             <FeedCard
//   //               feed={
//   //                 isBookmark
//   //                   ? { ...item?.objectInfo, isBookMarked: true }
//   //                   : item
//   //               }
//   //               key={item._id}
//   //             />
//   //             {randomPostFrequencyCalc() && (
//   //               <>
//   //                 {/* random creator */}
//   //                 <SuggestionPost />
//   //               </>
//   //             )}
//   //           </>
//   //         );
//   //       })}
//   //     </div>
//   //     {!feeds.length && !fetching && (
//   //       <div className={style["fixed-scroll"]}>
//   //         <Alert
//   //           className="text-center"
//   //           message="No post was found"
//   //           type="info"
//   //         />
//   //       </div>
//   //     )}
//   //     {fetching && (
//   //       <div className="text-center">
//   //         <Spin />
//   //       </div>
//   //     )}
//   //   </InfiniteScroll>
//   // );
// }

// export default ScrollListFeed;
