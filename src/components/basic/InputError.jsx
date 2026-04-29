import { motion } from "framer-motion";

export function InputError({ message, id }) {
    return (
        <motion.p
            id={id}
            role="alert"
            className="flex items-center ml-2 gap-1 px-1 font-semibold text-xs text-error rounded-md"
            {...framer_error}
        >
            {message}
        </motion.p>
    );
}

const framer_error = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 }
};