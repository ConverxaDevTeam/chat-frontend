interface TextChatProps {
  user: string;
  text: string;
}

const TextChat = ({ user, text }: TextChatProps) => {
  return (
    <p
      className={`w-[80%] rounded-md p-1 flex-1 ${user === "user" ? "bg-sofiaCall-primary ml-auto" : "bg-sofiaCall-grayBorder"}`}
    >
      {text}
    </p>
  );
};

export default TextChat;
