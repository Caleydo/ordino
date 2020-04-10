import {IUploadComment} from 'tdp_comments/src/model/interfaces';
import {defaultUploadComment} from 'tdp_comments/src/model/utils';

export const ORDINO_APP_KEY = 'ordino';

export function createCommentTemplate(): Partial<IUploadComment> {
  return Object.assign(defaultUploadComment(), {
    app_key: ORDINO_APP_KEY
  });
}
