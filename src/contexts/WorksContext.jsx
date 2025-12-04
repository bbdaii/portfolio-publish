import { createContext } from 'react';
import { worksData } from '../datas/worksData.js';

export const WorksContext = createContext();

export const WorksProvider = ({ children }) => {
    const works = worksData;

    return (
        <WorksContext.Provider value={ works }>
            {children}
        </WorksContext.Provider>
    )
}