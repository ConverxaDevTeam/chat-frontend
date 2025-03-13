import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IDepartment } from "@interfaces/departments";
import { getDepartments } from "@services/department";
import { logOutAsync, setOrganizationId } from "../actions/auth";

interface DepartmentState {
  selectedDepartmentId: number | null;
  departments: IDepartment[];
  loadingDepartments: boolean;
}

const initialState: DepartmentState = {
  selectedDepartmentId: localStorage.getItem("departmentSelect")
    ? Number(localStorage.getItem("departmentSelect"))
    : null,
  departments: [],
  loadingDepartments: true,
};

export const fetchDepartments = createAsyncThunk(
  "department/fetchDepartments",
  async (organizationId: number | null) => {
    if (!organizationId) {
      return [];
    }
    const response = await getDepartments(organizationId);
    return response;
  }
);

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setSelectedDepartmentId: (state, action: PayloadAction<number | null>) => {
      if (action.payload === null) {
        localStorage.removeItem("departmentSelect");
      } else {
        localStorage.setItem("departmentSelect", String(action.payload));
      }
      state.selectedDepartmentId = action.payload;
    },
    clearSelectedDepartment: state => {
      localStorage.removeItem("departmentSelect");
      state.selectedDepartmentId = null;
      state.departments = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDepartments.pending, state => {
        state.loadingDepartments = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
        state.loadingDepartments = false;
        const storedDepartmentId = localStorage.getItem("departmentSelect")
          ? Number(localStorage.getItem("departmentSelect"))
          : null;
        const isValidDepartment = action.payload.some(
          (d: IDepartment) => d.id === storedDepartmentId
        );
        state.selectedDepartmentId = isValidDepartment
          ? storedDepartmentId
          : action.payload.length > 0
            ? action.payload[0].id
            : null;
      })
      .addCase(fetchDepartments.rejected, state => {
        state.loadingDepartments = false;
        state.departments = [];
        state.selectedDepartmentId = null;
      })
      .addCase(logOutAsync.fulfilled, () => initialState)
      .addCase(logOutAsync.rejected, () => initialState)
      .addCase(setOrganizationId, state => {
        state.loadingDepartments = true;
      });
  },
});

export const { setSelectedDepartmentId, clearSelectedDepartment } =
  departmentSlice.actions;
export default departmentSlice.reducer;
