import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DepartmentState {
  selectedDepartmentId: number | null;
}

const initialState: DepartmentState = {
  selectedDepartmentId: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setSelectedDepartmentId: (state, action: PayloadAction<number | null>) => {
      state.selectedDepartmentId = action.payload;
    },
    clearSelectedDepartment: state => {
      state.selectedDepartmentId = null;
    },
  },
});

export const { setSelectedDepartmentId, clearSelectedDepartment } =
  departmentSlice.actions;
export default departmentSlice.reducer;
