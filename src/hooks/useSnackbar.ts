import { type TSnackbar, snackbarContext } from "@/components/snackbar/SnackbarContent";
import React from "react";

export function useSnackbar(): TSnackbar {
    const context = React.useContext(snackbarContext);
    if (context === undefined) {
        throw new Error(`useSnackbar must be used within a Provider`);
    }
    return context;
}
