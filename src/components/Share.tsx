interface ShareProps {
  journeyId: string;
}

const Share: React.FC<ShareProps> = ({ journeyId }) => {
  const link = document.location.origin + "/follow/" + journeyId;

  return (
    <div>
      Share:
      <a href={link}>{link}</a>
    </div>
  );
};

export default Share;
