import { I18nextManager } from 'tdp_core';
import React from 'react';
import { CommonSessionCard } from './CommonSessionCard';
import { SessionDropzone } from './SessionDropzone';
export default function UploadSessionCard({ name, faIcon }) {
    return (React.createElement(CommonSessionCard, { cardName: name, faIcon: faIcon, cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.uploadCardInfo') }, () => React.createElement(SessionDropzone, null)));
}
//# sourceMappingURL=UploadSessionCard.js.map