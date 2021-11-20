import { Modal } from 'bootstrap';
interface ILoginDialogProps {
    onSubmit?: (instance: Modal) => void;
    autoShow?: boolean;
}
export declare function LoginDialog(props: ILoginDialogProps): JSX.Element;
export {};
