import { Center } from "@components/ui/center";
import { Spinner } from "@components/ui/spinner";

const Loading = () => {
  return (
    <Center className="p-10">
      <Spinner size={"small"} />
    </Center>
  );
};

export default Loading;
export const UiLoading = () => {
  return (
    <Center className="p-10">
      <Spinner size={"small"} />
    </Center>
  );
};