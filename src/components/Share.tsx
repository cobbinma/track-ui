import IosShareIcon from "@mui/icons-material/IosShare";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QRCode from "qrcode.react";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
        <Stack direction="row" spacing={1}>
          <Typography>Share</Typography>
          <IosShareIcon />
        </Stack>
      </Button>
      <Modal open={show} onClose={() => setShow(false)}>
        <Box sx={style}>
        <Stack spacing={2}>
          <URL link={link} />
          <QRCode value={link} />
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default Share;

interface URLProps {
  link: string;
}

const URL: React.FC<URLProps> = ({ link }) => {
  const style = {
    display: "flex",
    'flex-direction': "row"
  };
  return (
    <div style={style}>
      <TextField
        id="outlined-basic"
        style={{flexGrow: 4}}
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
    </div>
  );
};
