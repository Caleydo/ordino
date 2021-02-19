import React from 'react';
import { Card } from 'react-bootstrap';
import { SessionDropzone } from '..';
export function UploadSessionCard() {
    return (React.createElement(React.Fragment, null,
        "  ",
        React.createElement("h4", { className: "text-left mt-4 mb-3" },
            React.createElement("i", { className: "mr-2 fas ordino-icon-2 fa-file-upload" }),
            " Import Session"),
        React.createElement(Card, { className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                React.createElement(Card.Text, null, "You can import sessions as temporary sessions and continue the analysis afterwards."),
                React.createElement(SessionDropzone, null)))));
}
//# sourceMappingURL=UploadSessionCard.js.map