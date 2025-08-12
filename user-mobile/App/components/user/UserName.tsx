import { Heading } from "@components/ui/heading";
import { HStack } from "@components/ui/hstack";

const UserName = ({ user }) => {
  return (
    <HStack>
      <Heading size="sm" className="mb-1">
        {user.firstName + " " + user.lastName}
      </Heading>
    </HStack>
  );
};

export default UserName;
