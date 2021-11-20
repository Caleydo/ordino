export class HeaderAdapter {
    hideDialog(selector) {
        import('jquery').then((jquery) => {
            $(selector).modal('hide');
        });
    }
    showAndFocusOn(selector, focusSelector) {
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
        HeaderAdapter.setVisibility(document.querySelector('#headerWaitingOverlay'), true);
    }
    ready() {
        HeaderAdapter.setVisibility(document.querySelector('#headerWaitingOverlay'), false);
    }
    static setVisibility(element, isVisible) {
        element.toggleAttribute('hidden', !isVisible);
    }
}
//# sourceMappingURL=LoginMenuAdapter.js.map