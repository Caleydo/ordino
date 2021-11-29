import React from 'react';
import {I18nextManager, useAsync} from 'tdp_core';

export function useInitVisynApp() {

    // TODO: initialize tours
    // TODO: initialize client config

    const initI18n = React.useMemo(() => () => {
        return I18nextManager.getInstance().initI18n();
    }, []);

    return useAsync(initI18n, []);

}
