import {ILoginMenuAdapter} from 'tdp_core';

/**
 * The login menu expects an adapter with the below interface
 * The ready and wait methods are handled with redux state changes
 */
export class HeaderAdapter implements ILoginMenuAdapter {
    hideDialog(selector: string) {
        import('jquery').then((jquery) => {
            $(selector).modal('hide');
        });
    }

    showAndFocusOn(selector: string, focusSelector: string) {
        import('jquery').then((jquery) => {
            const $selector = $(selector);
            $selector.modal('show')
                // @ts-ignore
                .on('shown.bs.modal', function () {
                    $($selector).trigger('focus');
                });
        });
    }

    wait() {
        // void
    }

    ready() {
        // void
    }
}
