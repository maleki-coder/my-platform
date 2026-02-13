import { useEffect } from "react";
import useToggleState from "@lib/hooks/use-toggle-state";
import { useFormStatus } from "react-dom";
import { clx } from "@lib/util/clx";
import { Button } from "@lib/components/ui/button";

type AccountInfoProps = {
  label: string;
  currentInfo: string | React.ReactNode;
  isSuccess?: boolean;
  isError?: boolean;
  errorMessage?: string;
  clearState: () => void;
  children?: React.ReactNode;
  "data-testid"?: string;
};

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState();
  const { pending } = useFormStatus();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    clearState();
    toggle();
  };

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess, close]);

  return (
    <div className="text-small-regular" data-testid={dataTestid}>
      {/* Header: label + edit button */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col space-y-2">
          <span>{label}</span>
          <div className="flex items-center flex-1 basis-0 justify-start gap-x-4">
            {typeof currentInfo === "string" && currentInfo != null && (
              <span className="font-semibold" data-testid="current-info">
                {currentInfo}
              </span>
            )}
          </div>
        </div>

        <div>
          <Button
            className="cursor-pointer w-[100px] min-h-[25px] py-1"
            type="button"
            onClick={handleToggle}
            disabled={pending}
            data-testid="edit-button"
          >
            {state ? "لغو" : "ویرایش"}
          </Button>
        </div>
      </div>

      <div className="relative w-full mt-2">
        {/* Success message */}
        {isSuccess && (
          <div
            className={clx(
              "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden max-h-[1000px] opacity-100 p-2 my-4 text-green-600"
            )}
            data-testid="success-message"
          >
            {label} با موفقیت ذخیره شد
          </div>
        )}

        {/* Error message */}
        {isError && (
          <div
            className={clx(
              "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden max-h-[1000px] opacity-100 p-2 my-4 text-red-600"
            )}
            data-testid="error-message"
          >
            {errorMessage}
          </div>
        )}

        {/* Edit panel */}
        {state && (
          <div
            className={clx(
              "flex flex-col gap-y-2 py-4 transition-all duration-300 ease-in-out"
            )}
            data-testid="edit-panel"
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
