import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CopilotKit
      showDevConsole={false}
      publicApiKey="ck_pub_2dd697c66097f0e76b9584b861082d7e"
    >
      <App />
      <div
        style={{
          "--copilot-kit-primary-color": "#222",
        }}
      >
        <CopilotPopup
          labels={{
            title: "Ask BingingPro AI",
            initial: "How may I help you?",
          }}
        />
      </div>
    </CopilotKit>
  </StrictMode>
);
