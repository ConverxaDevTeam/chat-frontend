import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./";

export const useAppDispatch: () => AppDispatch = useDispatch; // hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // otro hook :v
