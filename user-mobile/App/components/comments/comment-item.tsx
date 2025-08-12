import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IComment, IUser } from "@interfaces/index";
import { Text, View } from "@gluestack-ui/themed";
import { ListComments } from "./list-comment";
import { Button } from "@components/ui/button";
import { HStack } from "@components/ui/hstack";
import { VStack } from "@components/ui/vstack";
import { Avatar } from "@components/ui/avatar";
import AvatarImage from "@components/basic/avatarImage";
import { Heading } from "@components/ui/heading";

// const LikeButton = dynamic(() => import('@components/action-buttons/like-button'));

interface IProps {
  item: IComment;
  onDelete?: Function;
  canReply?: boolean;
}

function CommentItem({ item, onDelete = () => {}, canReply = false,  }: IProps) {
  const [totalReply, setTotalReply] = useState(item.totalReply);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const listRef = useRef(null);

  const user: IUser = useSelector((state: any) => state.user.current);

  const onOpenComment = () => {
    setIsOpenComment(!isOpenComment);
  };

  const onNewComment = (val) => {
    // listRef.current?.appendNew(val);
    setTotalReply(totalReply + 1);
  };

  //   const items: MenuProps["items"] = [
  //     {
  //       key: item._id,
  //       label: "Delete",
  //       onClick: () => onDelete(item),
  //     },
  //   ];

  useEffect(() => {
    setTotalReply(item.totalReply);
  }, [item.totalReply]);

  return (
    <HStack className="gap-2 py-3 px-4">
      <AvatarImage
        name={item?.creator?.username}
        uri={item?.creator?.avatar || "/no-avatar.jpg"}
        size={"md"}
      />
      <VStack style={{ alignItems: "flex-start" }}>
        <Heading size="sm">
          {item?.creator?.name || item?.creator?.username || "N/A"}
        </Heading>
        {/* <Text className="cmt-time">{moment(item.createdAt).fromNow()}</Text> */}
        <Text>{item.content}</Text>
        <Button
          variant="link"
          aria-hidden
          // className={classNames({
          //   "cmt-reply": true,
          //   active: isReply,
          // })}
          onPress={() => setIsReply(!isReply)}
        >
          <Text className="text-slate-500">Reply</Text>
        </Button>
        {isOpenComment && (
          <ListComments
            key={`comments_${item._id}`}
            objectId={item._id}
            objectType="comment"
            ref={listRef}
            canReply={false}
          />
        )}
      </VStack>
    </HStack>
  );
}
//   return (
//     <>
//       <View
//         // className={classNames(
//         //   style['cmt-item']
//         // )}
//         key={item._id}
//       >
//         <img alt="creator-avt" src={item?.creator?.avatar || '/no-avatar.jpg'} />
//         <div className="cmt-content">
//           <div className="cmt-user">
//             <span>
//               <span>{item?.creator?.name || item?.creator?.username || 'N/A'}</span>
//               <span className="cmt-time">{moment(item.createdAt).fromNow()}</span>
//             </span>
//             {user && item?.isAuth && (
//               <Dropdown menu={{ items }} className={style['cmt-handle-options']}>
//                 <MoreOutlined />
//               </Dropdown>
//             )}
//           </div>
//           <p className="cmt-text">{item.content}</p>
//           <div className="cmt-action">
//             <LikeButton
//               objectId={item._id}
//               objectType="feed"
//               performerId={item?.creator?._id}
//               totalLike={item.totalLike || 0}
//               liked={!!item?.isLiked}
//             />
//             {canReply && (
//             <Button
//               aria-hidden
//               className={classNames({
//                 'cmt-reply': true,
//                 active: isReply
//               })}
//               onClick={() => setIsReply(!isReply)}
//             >
//               Reply
//             </Button>
//             )}
//           </div>
//           <div className={isReply ? `${style['reply-bl-form']} ${style.active}` : style['reply-bl-form']}>
//             <div className="feed-comment">
//               <CommentForm
//                 onSuccess={onNewComment}
//                 objectId={item._id}
//                 objectType="comment"
//                 isReply
//               />
//             </div>
//           </div>
//           {canReply && totalReply > 0 && (
//             <div className={style['view-cmt']}>
//               <a className="primary-color" aria-hidden onClick={() => onOpenComment()}>
//                 {' '}
//                 <CaretUpOutlined rotate={!isOpenComment ? 180 : 0} />
//                 {' '}
//                 {!isOpenComment ? 'View reply' : 'Hide reply'}
//               </a>
//             </div>
//           )}
//         </div>
//       </div>
//       {isOpenComment && (
//         <div className={style['reply-bl-list']}>
//           <ListComments
//             key={`comments_${item._id}`}
//             objectId={item._id}
//             objectType="comment"
//             ref={listRef}
//             canReply={false}
//           />
//         </div>
//       )}
//     </>
//   );
// }


export default CommentItem;
