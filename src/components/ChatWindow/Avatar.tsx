export const Avatar = ({
  avatar,
  secret,
  className,
}: {
  avatar: string | null;
  secret: string;
  className?: string;
}) => {
  return (
    <div className={`w-12 h-12 flex-shrink-0 relative ${className}`}>
      {avatar ? (
        <div className="w-full h-full rounded-full overflow-hidden border border-sofia-superDark">
          <img
            src={avatar ?? undefined}
            alt={secret}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-sofia-electricLight border border-sofia-superDark" />
          <span className="relative z-10 text-base font-semibold text-sofia-superDark">
            {secret?.substring(0, 2)}
          </span>
        </div>
      )}
    </div>
  );
};
