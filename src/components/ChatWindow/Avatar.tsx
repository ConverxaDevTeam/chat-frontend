export const Avatar = ({
  avatar,
  secret,
  className,
  borderColor = "#001126",
}: {
  avatar: string | null;
  secret: string;
  className?: string;
  borderColor?: string;
}) => {
  return (
    <div className={`w-12 h-12 flex-shrink-0 relative ${className}`}>
      {avatar ? (
        <div
          className="w-full h-full rounded-full overflow-hidden border "
          style={{ borderColor: borderColor }}
        >
          <img
            src={avatar ?? undefined}
            alt={secret}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center relative">
          <div
            className="absolute inset-0 rounded-full bg-app-electricLight"
            style={{ borderColor: borderColor }}
          />
          <span
            className="relative z-1 text-base font-semibold text-app-superDark"
            style={{ color: borderColor }}
          >
            {secret?.substring(0, 2)}
          </span>
        </div>
      )}
    </div>
  );
};
