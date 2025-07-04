import React from "react";

interface ConversationWarningBannerProps {
  isLastConversation?: boolean;
}

export const ConversationWarningBanner: React.FC<
  ConversationWarningBannerProps
> = ({ isLastConversation }) => {
  // No mostrar el banner si es la última conversación o si no se especifica
  if (isLastConversation !== false) {
    return null;
  }

  return (
    <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <span>Esta no es la conversación más reciente del usuario</span>
    </div>
  );
};
