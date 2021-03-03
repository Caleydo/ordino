import React from 'react';
import { CommonSessionCard } from './CommonSessionCard';
import { SessionDropzone } from './SessionDropzone';
export default function UploadSessionCard({ name, faIcon, cssClass }) {
    return (React.createElement(CommonSessionCard, { cardName: name, faIcon: faIcon, cardInfo: "You can import sessions as temporary sessions and continue the analysis afterwards." }, () => React.createElement(SessionDropzone, null)));
}
//# sourceMappingURL=UploadSessionCard.js.map