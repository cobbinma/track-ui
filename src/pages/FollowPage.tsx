import AuthButton from "../components/AuthButton";
import Follow from "../components/Follow";

const FollowPage = () => {
  const getLastItem = (thePath: string) =>
    thePath.substring(thePath.lastIndexOf("/") + 1);
  const id = getLastItem(window.location.pathname);

  return (
    <div>
      <AuthButton />
      <Follow id={id} />
    </div>
  );
};

export default FollowPage;
