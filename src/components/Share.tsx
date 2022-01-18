import IosShareIcon from "@mui/icons-material/IosShare";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QRCode from "qrcode.react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface ShareProps {
  journeyId: string;
}

const Share: React.FC<ShareProps> = ({ journeyId }) => {
  const [show, setShow] = useState<boolean>(false);
  const link = document.location.origin + "/follow/" + journeyId;

  return (
    <div>
      <Button onClick={() => setShow(true)} variant="contained">
        <IosShareIcon /> Share
      </Button>
      <Modal open={show} onClose={() => setShow(false)}>
        <Box sx={style}>
          <TextField
            id="outlined-basic"
            label={link}
            variant="outlined"
            disabled={true}
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(link);
            }}
          >
            <ContentCopyIcon />
          </Button>
          <br />
          <QRCode value={link} />
        </Box>
      </Modal>
    </div>
  );
};

export default Share;
