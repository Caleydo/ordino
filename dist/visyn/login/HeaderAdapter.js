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
        // void
    }
    ready() {
        // void
    }
}
//# sourceMappingURL=HeaderAdapter.js.map