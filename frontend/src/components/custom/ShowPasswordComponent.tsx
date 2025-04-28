import { EyeIcon, EyeOffIcon } from 'lucide-react';

export const ShowPasswordComponent = (props: {
    showPassword: boolean;
    handleShowPassword: () => void;
}) => {
    return (
        <div
            className=" absolute bottom-[50%] right-3 translate-y-2/4  "
            onClick={props.handleShowPassword}
        >
            {!props.showPassword && <EyeOffIcon className="size-3" />}

            {props.showPassword && <EyeIcon className="size-3" />}

            {/* {showPassword.showConfirmPassword &&  } */}
        </div>
    );
};
