// import { GoogleOutlined, TwitterOutlined } from '@ant-design/icons';
// import { AvatarUpload } from '@components/user/avatar-upload';
import { UiButton } from "@components/base/Button";
import { UiText } from "@components/base/Text";
import { UiIcon } from "@components/base/UiIcon";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@components/ui/avatar";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@components/ui/form-control";
import { HStack } from "@components/ui/hstack";
import { Icon } from "@components/ui/icon";
import { Input, InputField } from "@components/ui/input";
import { VStack } from "@components/ui/vstack";
import { SafeAreaView } from "@gluestack-ui/themed";
import message from "@lib/message";
import { showError } from "@lib/utils";
import { updateCurrentUserAvatar, updateUser } from "@redux/user/actions";
import { authService } from "@services/auth.service";
import { userService } from "@services/user.service";
import { Edit } from "lucide-react-native";
// import {
//   Button, Col, Form, Input, Popover, Row, Select, message
// } from 'antd';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

function UserAccountFormComponent() {
  const { current: user, updating } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [countTime, setCountTime] = useState(60);
  const countRef = useRef() as any;

  const onFinish = (data) => {
    dispatch(updateUser(data));
  };

  const uploadAvatar = (data) => {
    dispatch(updateCurrentUserAvatar(data.response.data.url));
  };

  const handleCountdown = () => {
    if (countTime === 0) {
      setCountTime(60);
      countRef.current && clearTimeout(countRef.current);
      return;
    }
    setCountTime((s) => s - 1);
    countRef.current = setTimeout(() => handleCountdown, 1000);
  };

  const verifyEmail = async () => {
    try {
      const resp = await authService.verifyEmail({
        sourceType: "user",
        source: user,
      });
      handleCountdown();
      message.success(resp.data.message);
    } catch (e) {
      showError(e);
    }
  };

  useEffect(
    () => () => {
      countRef.current && clearTimeout(countRef.current);
    },
    [countTime]
  );

  const UiInput = ({
    name,
    label,
    rules = [],
    placeholder = "Enter value",
    value,
    setValue,
    isInvalid = false,
    type = "text",
  }) => {
    return (
      <FormControl
        isInvalid={isInvalid}
        size="md"
        isDisabled={false}
        isReadOnly={false}
        isRequired={false}
        className="m-1 mx-4"
      >
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
        <Input
          className="my-1"
          // size={props.size}
          size="xl"
        >
          <InputField
            className="rounded-lg p-2"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Input>
      </FormControl>
    );
  };

  return (
    <SafeAreaView>
      <VStack className="py-10" space="md">
        <HStack className="justify-center">
          <Avatar className="mr-4" size="xl">
            <AvatarFallbackText>JD</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: "https://images.unsplash.com/photo-1620403724159-40363e84a155?q=80&w=2646&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
            />
            <AvatarBadge className="bg-white">
              <Icon as={Edit} size="md" />
            </AvatarBadge>
          </Avatar>
        </HStack>
        <UiInput
          name="firstName"
          label="First Name"
          value={user.firstName}
          setValue={(value) => {}}
        />
        <UiInput
          name="lastName"
          label="Last Name"
          value={user.lastName}
          setValue={(value) => {}}
        />
        <UiInput
          name="username"
          label="Username"
          value={user.username}
          setValue={(value) => {}}
        />
        <UiInput
          name="email"
          label="Email Address"
          value={user.email}
          setValue={(value) => {}}
        />
        <UiInput
          name="name"
          label="Display Name"
          value={user.name}
          setValue={(value) => {}}
        />
        <HStack className="flex-1 align-center justify-center">
          <UiButton>
            <UiText>Update</UiText>
          </UiButton>
        </HStack>
      </VStack>
    </SafeAreaView>
  );

  //   return (
  //     <Form
  //       className={style['account-form']}
  //       {...layout}
  //       name="user-account-form"
  //       onFinish={(data) => onFinish(data)}
  //       scrollToFirstError
  //       initialValues={user}
  //     >
  //       <Row>
  //         <Col xs={24} sm={12}>
  //           <Form.Item
  //             name="firstName"
  //             label="First Name"
  //             validateTrigger={['onChange', 'onBlur']}
  //             rules={[
  //               { required: true, message: 'Please input your first name!' },
  //               {
  //                 pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
  //                 message: 'First name can not contain number and special character'
  //               }
  //             ]}
  //           >
  //             <Input placeholder="First Name" />
  //           </Form.Item>
  //         </Col>
  //         <Col xs={24} sm={12}>
  //           <Form.Item
  //             name="lastName"
  //             label="Last Name"
  //             validateTrigger={['onChange', 'onBlur']}
  //             rules={[
  //               { required: true, message: 'Please input your last name!' },
  //               {
  //                 pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
  //                 message: 'Last name can not contain number and special character'
  //               }
  //             ]}
  //           >
  //             <Input placeholder="Last Name" />
  //           </Form.Item>
  //         </Col>
  //         <Col xs={24} sm={12}>
  //           <Form.Item
  //             name="username"
  //             label="Username"
  //             validateTrigger={['onChange', 'onBlur']}
  //             rules={[
  //               { required: true, message: 'Please input your username!' },
  //               {
  //                 pattern: /^[a-zA-Z0-9]+$/g,
  //                 message: 'Username must contain lowercase alphanumerics only'
  //               },
  //               { min: 3, message: 'Username must containt at least 3 characters' }
  //             ]}
  //           >
  //             <Input placeholder="mirana, invoker123, etc..." />
  //           </Form.Item>
  //         </Col>
  //         <Col xs={24} sm={12}>
  //           <Form.Item
  //             name="email"
  //             label={(
  //               <span style={{ fontSize: 10 }}>
  //                 Email Address
  //                 {'  '}
  //                 {user.verifiedEmail ? (
  //                   <Popover title="Your email address is verified" content={null}>
  //                     <a className="success-color">Verified!</a>
  //                   </Popover>
  //                 ) : (
  //                   <Popover
  //                     title="Your email address is not verified"
  //                     content={(
  //                       <Button
  //                         type="primary"
  //                         onClick={() => verifyEmail()}
  //                         disabled={!user.email || countTime < 60}
  //                         loading={countTime < 60}
  //                       >
  //                         Click here to
  //                         {' '}
  //                         {countTime < 60 ? 'resend' : 'send'}
  //                         {' '}
  //                         the verification link
  //                         {' '}
  //                         {countTime < 60 && `${countTime}s`}
  //                       </Button>
  //                     )}
  //                   >
  //                     <a className="error-color">Not verified!</a>
  //                   </Popover>
  //                 )}
  //               </span>
  //             )}
  //             rules={[{ type: 'email' }, { required: true, message: 'Please input your email address!' }]}
  //             validateTrigger={['onChange', 'onBlur']}
  //           >
  //             <Input disabled={user.verifiedEmail} placeholder="Email Address" />
  //           </Form.Item>
  //         </Col>
  //         <Col xs={24} sm={12}>
  //           <Form.Item
  //             name="name"
  //             label="Display Name"
  //             validateTrigger={['onChange', 'onBlur']}
  //             rules={[
  //               { required: true, message: 'Please input your display name!' },
  //               {
  //                 pattern: /^(?=.*\S).+$/g,
  //                 message: 'Display name can not contain only whitespace'
  //               },
  //               {
  //                 min: 3,
  //                 message: 'Display name must containt at least 3 characters'
  //               }
  //             ]}
  //           >
  //             <Input placeholder="Display Name" />
  //           </Form.Item>
  //         </Col>
  //         <Col xs={24} sm={12}>
  //           <Form.Item
  //             name="gender"
  //             label="Gender"
  //             rules={[{ required: true, message: 'Please select gender!' }]}
  //           >
  //             <Select>
  //               <Select.Option value="male" key="male">
  //                 Male
  //               </Select.Option>
  //               <Select.Option value="female" key="female">
  //                 Female
  //               </Select.Option>
  //               <Select.Option value="transgender" key="transgender">
  //                 Transgender
  //               </Select.Option>
  //             </Select>
  //           </Form.Item>
  //         </Col>
  //         <Col md={12} xs={24}>
  //           <Form.Item
  //             label="New Password"
  //             name="password"
  //             rules={[
  //               {
  //                 pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
  //                 message: 'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
  //               }
  //             ]}
  //           >
  //             <Input.Password placeholder="Enter new password here" />
  //           </Form.Item>
  //           <p
  //             className="text-center"
  //             style={{ fontSize: '10px', fontWeight: 'lighter' }}
  //           >
  //             Keep it blank for current password
  //           </p>
  //         </Col>
  //         <Col md={12} xs={24}>
  //           <Form.Item
  //             label="Confirm new password"
  //             name="confirm-password"
  //             dependencies={['password']}
  //             rules={[
  //               ({ getFieldValue }) => ({
  //                 validator(rule, value) {
  //                   if (!value || getFieldValue('password') === value) {
  //                     return Promise.resolve();
  //                   }
  //                   // eslint-disable-next-line prefer-promise-reject-errors
  //                   return Promise.reject('Passwords do not match together!');
  //                 }
  //               })
  //             ]}
  //           >
  //             <Input.Password placeholder="Confirm new password" />
  //           </Form.Item>
  //         </Col>
  //         <Col xs={24} sm={12}>
  //           <Form.Item label="Avatar">
  //             <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
  //               <AvatarUpload
  //                 image={user.avatar}
  //                 uploadUrl={userService.getAvatarUploadUrl()}
  //                 onUploaded={uploadAvatar}
  //               />
  //             </div>
  //           </Form.Item>
  //         </Col>
  //         <Col xs={24} sm={12}>
  //           {user.twitterConnected && (
  //             <Form.Item>
  //               <p className="primary-color">
  //                 <TwitterOutlined style={{ color: '#1ea2f1', fontSize: '30px' }} />
  //                 {' '}
  //                 Signup/login via Twitter
  //               </p>
  //             </Form.Item>
  //           )}
  //           {user.googleConnected && (
  //             <Form.Item>
  //               <p className="primary-color">
  //                 <GoogleOutlined style={{ color: '#d64b40', fontSize: '30px' }} />
  //                 {' '}
  //                 Signup/login via Google
  //               </p>
  //             </Form.Item>
  //           )}
  //         </Col>
  //       </Row>
  //       <Form.Item className="text-center">
  //         <Button htmlType="submit" className="primary" loading={updating}>
  //           Update Profile
  //         </Button>
  //       </Form.Item>
  //     </Form>
  //   );
}

export default UserAccountFormComponent;
