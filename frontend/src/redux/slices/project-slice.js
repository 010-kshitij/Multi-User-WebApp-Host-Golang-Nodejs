import { createSlice } from '@reduxjs/toolkit';

export const projectSlice = createSlice({
  name: 'project',
  initialState: {
    id: "",
    name: "",
    slug: "",
    isEditing: false
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setSlug: (state, action) => {
      state.slug = action.payload;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setId, setName, setSlug, setIsEditing } = projectSlice.actions;

export default projectSlice.reducer;