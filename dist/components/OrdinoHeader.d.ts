import { IVisynHeaderProps } from '../visyn';
import { ITab } from './header/StartMenuTabWrapper';
export interface IOrdinoHeaderProps extends IVisynHeaderProps {
    tabs?: ITab[];
}
export declare function OrdinoHeader(props: IOrdinoHeaderProps): JSX.Element;
