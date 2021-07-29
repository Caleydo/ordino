import React from 'react';
function BookmarkToggle({ graph, bookmarkView, setBookmarkView, }) {
    if (graph === undefined) {
        return null;
    }
    return (React.createElement("div", { className: "custom-control custom-switch" },
        React.createElement("input", { type: "checkbox", className: "custom-control-input", id: "customSwitches", checked: bookmarkView, onChange: () => {
                setBookmarkView(!bookmarkView);
            }, readOnly: true }),
        React.createElement("label", { className: "custom-control-label", htmlFor: "customSwitches" }, "Show bookmarked")));
}
export default BookmarkToggle;
//# sourceMappingURL=BookmarkToggle.js.map