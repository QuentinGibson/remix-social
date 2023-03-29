import { useEffect, useState } from "react";

export default function Toast({ message }: { message: string }) {
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {show && (
        <div className="absolute bottom-8 right-8">
          <div
            id="toast-notification"
            className={`w-full max-w-xs p-4 text-gray-900  rounded-lg shadow bg-red-700 text-gray-300`}
            role="alert"
          >
            <div className="flex items-center mb-3">
              <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                New notification
              </span>
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5  text-white rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5  inline-flex h-8 w-8 text-gray-500 hover:text-white bg-red-800 hover:bg-red-700"
                data-dismiss-target="#toast-notification"
                onClick={handleClose}
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex items-center">
              <span>{message}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
