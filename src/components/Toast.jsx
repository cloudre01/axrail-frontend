import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { TiTick } from "react-icons/ti";

const variants = {
  error: "alert-error",
  success: "alert-success",
  warning: "alert-warning",
};

const icons = {
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-current flex-shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  success: <TiTick />,
  warning: <AiOutlineExclamationCircle />,
};

export default function Toast({ message, type, onClose, showToast }) {
  return (
    <AnimatePresence>
      {showToast && (
        <motion.div className="toast" exit={{ opacity: 0 }}>
          <div className={`alert ${variants[type]} shadow-lg`}>
            <div>
              {icons[type]}
              <span>{message}</span>
            </div>
            <div className="flex-none">
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={onClose}
              >
                <GrFormClose />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
