import { useSelector } from "react-redux";
import ButtonIntegracion from "../ButtonIntegracion";
import { RootState } from "@store";
import { alertError } from "@utils/alerts";
import { baseUrl } from "@config/config";

interface ButtonSlackIntegrationProps {
  departmentId: number | null;
  close: () => void;
  getDataIntegrations: () => void;
}

const ButtonSlackIntegration = ({
  departmentId,
  close,
  getDataIntegrations,
}: ButtonSlackIntegrationProps) => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  const slackAuthUrl = async () => {
    if (!departmentId || !selectOrganizationId) return;
    const clientId = "7464676423766.8502943266896";
    const redirectUri = encodeURIComponent(`${baseUrl}/api/slack/auth`);
    const scopes = encodeURIComponent(
      "channels:read,chat:write,im:history,im:write,mpim:read,users:read,users:read.email,users.profile:read,channels:manage,chat:write.public,commands,groups:write,conversations.connect:read,channels:history"
    );
    const state = encodeURIComponent(
      btoa(
        JSON.stringify({
          department_id: departmentId,
          organization_id: selectOrganizationId,
        })
      )
    );
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;

    const popup = window.open(
      slackAuthUrl,
      "popup",
      "scrollbars=no,resizable=no"
    );

    window.addEventListener("message", event => {
      if (event.data?.success) {
        getDataIntegrations();
        close();
      } else {
        alertError(event.data?.message);
      }
    });

    const checkPopupClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopupClosed);
      }
    }, 500);
  };

  return (
    <>
      <ButtonIntegracion action={slackAuthUrl} Icon="slack" text="Slack" />
    </>
  );
};

export default ButtonSlackIntegration;
