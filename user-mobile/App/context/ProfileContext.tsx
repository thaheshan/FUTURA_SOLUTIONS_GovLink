import { IPerformer } from "@interfaces";
import React from "react";

const ProfileContext = React.createContext<{
    performer: IPerformer | null;
    setPerformer: (performer: IPerformer) => void;

}>({
    performer: null,
    setPerformer: () => { },

});

export const ProfileContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [performer, setPerformerState] = React.useState<IPerformer | null>(null);

    const setPerformer = (newPerformer: IPerformer) => {
        setPerformerState(newPerformer);
    };

    const getPerformer = () => performer;

    return (
        <ProfileContext.Provider value={{ performer, setPerformer }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => {
    const context = React.useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfileContext must be used within a ProfileContextProvider");
    }
    return context;
};