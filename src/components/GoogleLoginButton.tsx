import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import { googleLoginAsync } from "@store/actions/auth";

interface GoogleLoginButtonProps {
  setError: (error: string) => void;
}

const GoogleLoginButton = ({ setError }: GoogleLoginButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      dispatch(
        googleLoginAsync({
          accessToken: tokenResponse.access_token,
          setError,
          dispatch,
        })
      );
    },
    onError: () => {
      setError("Error al iniciar sesión con Google");
    },
  });

  return (
    <button
      onClick={() => login()}
      type="button"
      className="w-full flex items-center justify-center gap-2 rounded-[8px] py-[10px] bg-white border border-gray-300 text-sofia-superDark text-[16px] font-semibold mb-[16px] hover:bg-gray-50"
    >
      <img src="/mvp/google-icon.svg" alt="Google" className="w-5 h-5" />
      Continuar con Google
    </button>
  );
};

export default GoogleLoginButton;
