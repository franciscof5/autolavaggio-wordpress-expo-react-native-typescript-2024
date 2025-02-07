interface CurrentUserApiState {
  mutations: {
    [key: string]: {
      data: any; // Replace `any` with a specific type if possible.
    };
  };
}

export interface AppState {
  currentUserApi: CurrentUserApiState;
  // Add other state slices if necessary.
}