import { showError } from "@lib/utils";
import { commentService } from "@services/comment.service";

import { useState } from "react";
import { useSelector } from "react-redux";
import { ICreateComment } from "@interfaces/comment";
import message from "@lib/message";
import { Textarea } from "@components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button, HStack, Input, Text, View } from "@gluestack-ui/themed";
// import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { SendHorizonal } from "lucide-react-native";
import { Icon } from "@components/ui/icon";
import { BottomSheetTextInput } from "@components/ui/bottomsheet";

// const Emotions = dynamic(() => import("@components/common/emotions"), {
//   ssr: false,
//   loading: () => (
//     <div className="skeleton-loading" style={{ width: 300, height: 400 }} />
//   ),
// });

type Props = {
  objectId: string;
  objectType: string;
  onSuccess: Function;
  isReply?: boolean;
};

export function CommentForm({
  objectId,
  objectType,
  isReply = false,
  onSuccess = () => {},
}: Props) {
  const formRef = useForm();
  const [submiting, setsubmiting] = useState(false);
  const loggedIn = useSelector<boolean>((state: any) => state.auth.loggedIn);

  const [content, setContent] = useState("");

   
  const onFinish = async (values: ICreateComment) => {
    try {
      const data = { ...values };
      if (!loggedIn) {
        return message.error("Please login!");
      }
      if (!data.content) {
        return message.error("Please add a comment!");
      }
      if (data.content.length > 150) {
        return message.error("Comment cannot be over 150 characters");
      }
      setsubmiting(true);
      data.objectId = objectId;
      data.objectType = objectType || "video";
      const res = await commentService.create(data);
      formRef.reset();
      onSuccess({ ...res.data, isAuth: true });
      message.success("Commented successfully");
      setContent("");
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  // const onEmojiClick = async (emoji) => {
  //   if (!loggedIn) return;
  //   formRef.setValue(
  //     "content",  `${formRef.getFieldValue("content") || ""} ${emoji} `,
  //   );
  // };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        gap: 20,
      }}
    >
      <BottomSheetTextInput
        
        style={{
          flex: 1,
          marginTop: 8,
          marginBottom: 10,
          borderRadius: 10,
          fontSize: 16,
          lineHeight: 20,
          padding: 8,
          backgroundColor: "rgba(151, 151, 151, 0.25)",
        }}
        className="text-gray-800 dark:text-gray-200"
        onChangeText={(text) => setContent(text)}
        placeholder={!isReply ? "Add a comment here" : "Add a reply here"}
      ></BottomSheetTextInput>
      <Button
        onPress={() => {
          onFinish({ content, objectType, objectId });
        }}
      >
        <Icon as={SendHorizonal} size={20} />
      </Button>
    </View>
  );
}

//   return (
//     <Form
//       form={formRef}
//       name="comment-form"
//       onFinish={(val) => onFinish(val)}
//       initialValues={{
//         content: "",
//       }}
//     >
//       <div className={classNames(style["comment-form"])}>
//         <div className="cmt-area">
//           <Form.Item name="content">
//             <TextArea
//               disabled={!loggedIn}
//               maxLength={150}
//               showCount
//               minLength={1}
//               rows={!isReply ? 2 : 1}
//               placeholder={!isReply ? "Add a comment here" : "Add a reply here"}
//             />
//           </Form.Item>
//           <Popover
//             key={objectId}
//             className="emotion-popover"
//             content={<Emotions onEmojiClick={(emoji) => onEmojiClick(emoji)} />}
//             title={null}
//             trigger="click"
//           >
//             <Button className="grp-emotions">
//               <SmileOutlined />
//             </Button>
//           </Popover>
//         </div>
//         <Button
//           className={!isReply ? style["submit-btn"] : ""}
//           htmlType="submit"
//           disabled={!loggedIn || submiting}
//         >
//           {!isReply ? <SendOutlined /> : "Reply"}
//         </Button>
//       </div>
//     </Form>
//   );
// }

export default CommentForm;
